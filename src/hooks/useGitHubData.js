import { useState, useEffect } from 'react';
import { githubAPI } from '../services/githubAPI';

export function useGitHubData() {
  const [trendingRepos, setTrendingRepos] = useState([]);
  const [languageStats, setLanguageStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitStatus, setRateLimitStatus] = useState({ remaining: null, resetTime: null });

  const fetchTrendingRepositories = async (language = '', since = 'daily') => {
    try {
      setLoading(true);
      setError('');
      
      const repos = await githubAPI.getTrendingRepositories(language, since);
      setTrendingRepos(repos);
      
      // Update rate limit status
      setRateLimitStatus(githubAPI.getRateLimitStatus());
      
    } catch (err) {
      setError(`Failed to fetch trending repositories: ${err.message}`);
      console.error('Error fetching trending repos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguageStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const stats = await githubAPI.getLanguageStats();
      setLanguageStats(stats);
      
      // Update rate limit status
      setRateLimitStatus(githubAPI.getRateLimitStatus());
      
    } catch (err) {
      setError(`Failed to fetch language statistics: ${err.message}`);
      console.error('Error fetching language stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchRepositories = async (query) => {
    try {
      setLoading(true);
      setError('');
      
      const repos = await githubAPI.searchRepositories(query);
      setTrendingRepos(repos); // Reuse the same state for simplicity
      
      // Update rate limit status
      setRateLimitStatus(githubAPI.getRateLimitStatus());
      
      return repos;
    } catch (err) {
      setError(`Failed to search repositories: ${err.message}`);
      console.error('Error searching repos:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (username) => {
    try {
      setLoading(true);
      setError('');
      
      const profile = await githubAPI.getUserProfile(username);
      
      // Update rate limit status
      setRateLimitStatus(githubAPI.getRateLimitStatus());
      
      return profile;
    } catch (err) {
      setError(`Failed to fetch user profile: ${err.message}`);
      console.error('Error fetching user profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch trending repos on mount
  useEffect(() => {
    fetchTrendingRepositories();
  }, []);

  return {
    trendingRepos,
    languageStats,
    loading,
    error,
    rateLimitStatus,
    fetchTrendingRepositories,
    fetchLanguageStats,
    searchRepositories,
    getUserProfile,
  };
}
