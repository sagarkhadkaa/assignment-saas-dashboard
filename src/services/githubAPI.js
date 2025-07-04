// GitHub API service for fetching repository and user data
const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubAPIService {
  constructor() {
    this.rateLimitRemaining = null;
    this.rateLimitReset = null;
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'SaaS-Dashboard-App',
          ...options.headers,
        },
        ...options,
      });

      // Update rate limit info
      this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining') || '0');
      this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset') || '0');

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GitHub API request failed:', error);
      throw error;
    }
  }

  // Get trending repositories
  async getTrendingRepositories(language = '', since = 'daily') {
    const query = `stars:>1 created:>${this.getDateSince(since)}${language ? ` language:${language}` : ''}`;
    const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=10`;
    
    const data = await this.makeRequest(endpoint);
    return data.items || [];
  }

  // Get repository details
  async getRepository(owner, repo) {
    const endpoint = `/repos/${owner}/${repo}`;
    return await this.makeRequest(endpoint);
  }

  // Get repository languages
  async getRepositoryLanguages(owner, repo) {
    const endpoint = `/repos/${owner}/${repo}/languages`;
    return await this.makeRequest(endpoint);
  }

  // Get repository contributors
  async getRepositoryContributors(owner, repo, limit = 5) {
    const endpoint = `/repos/${owner}/${repo}/contributors?per_page=${limit}`;
    return await this.makeRequest(endpoint);
  }

  // Get user profile
  async getUserProfile(username) {
    const endpoint = `/users/${username}`;
    return await this.makeRequest(endpoint);
  }

  // Get user repositories
  async getUserRepositories(username, limit = 10) {
    const endpoint = `/users/${username}/repos?sort=updated&per_page=${limit}`;
    return await this.makeRequest(endpoint);
  }

  // Search repositories
  async searchRepositories(query, limit = 10) {
    const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=${limit}`;
    const data = await this.makeRequest(endpoint);
    return data.items || [];
  }

  // Get programming language statistics
  async getLanguageStats() {
    // This gets trending repos and aggregates language data
    const repos = await this.getTrendingRepositories('', 'weekly');
    const languageStats = {};

    for (const repo of repos.slice(0, 5)) { // Limit to avoid rate limiting
      try {
        const languages = await this.getRepositoryLanguages(repo.owner.login, repo.name);
        Object.keys(languages).forEach(lang => {
          languageStats[lang] = (languageStats[lang] || 0) + languages[lang];
        });
      } catch (error) {
        console.warn(`Failed to get languages for ${repo.full_name}:`, error);
      }
    }

    return languageStats;
  }

  // Helper method to get date string for "since" parameter
  getDateSince(since) {
    const date = new Date();
    switch (since) {
      case 'daily':
        date.setDate(date.getDate() - 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() - 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() - 1);
        break;
      default:
        date.setDate(date.getDate() - 1);
    }
    return date.toISOString().split('T')[0];
  }

  // Get rate limit status
  getRateLimitStatus() {
    return {
      remaining: this.rateLimitRemaining,
      resetTime: this.rateLimitReset ? new Date(this.rateLimitReset * 1000) : null,
    };
  }
}

export const githubAPI = new GitHubAPIService();
