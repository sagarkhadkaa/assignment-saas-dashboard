import { useState } from 'react';
import { useGitHubData } from '../hooks/useGitHubData';

export default function GitHubIntegration() {
  const {
    trendingRepos,
    languageStats,
    loading,
    error,
    rateLimitStatus,
    fetchTrendingRepositories,
    fetchLanguageStats,
    searchRepositories,
    getUserProfile,
  } = useGitHubData();

  const [activeView, setActiveView] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [timeRange, setTimeRange] = useState('daily');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    const results = await searchRepositories(searchQuery);
    setSearchResults(results);
    setActiveView('search');
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    const profile = await getUserProfile(username);
    setUserProfile(profile);
    setActiveView('user');
  };

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    fetchTrendingRepositories('', newRange);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      'C#': '#239120',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      Dart: '#00B4AB',
      Shell: '#89e051',
      HTML: '#e34c26',
      CSS: '#1572B6',
    };
    return colors[language] || '#8b949e';
  };

  const tabs = [
    { id: 'trending', name: 'Trending', icon: '🔥' },
    { id: 'search', name: 'Search', icon: '🔍' },
    { id: 'user', name: 'User Profile', icon: '👤' },
    { id: 'languages', name: 'Languages', icon: '💻' },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">GitHub Integration</h3>
            <p className="text-sm text-gray-500">Explore trending repositories and developer insights</p>
          </div>
          {rateLimitStatus.remaining !== null && (
            <div className="text-sm text-gray-500">
              API Calls Remaining: <span className="font-medium">{rateLimitStatus.remaining}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`${
                activeView === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading GitHub data...</span>
          </div>
        )}

        {/* Trending Repositories */}
        {activeView === 'trending' && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Trending Repositories</h4>
              <div className="flex space-x-2">
                {['daily', 'weekly', 'monthly'].map((range) => (
                  <button
                    key={range}
                    onClick={() => handleTimeRangeChange(range)}
                    className={`px-3 py-1 text-sm rounded ${
                      timeRange === range
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {trendingRepos.slice(0, 5).map((repo) => (
                <div key={repo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-gray-900">{repo.name}</h5>
                        {repo.language && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          >
                            {repo.language}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          ⭐ {formatNumber(repo.stargazers_count)}
                        </span>
                        <span className="flex items-center">
                          🍴 {formatNumber(repo.forks_count)}
                        </span>
                        <span>Updated {formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Repositories */}
        {activeView === 'search' && (
          <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repositories..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Search
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="grid gap-4">
                {searchResults.map((repo) => (
                  <div key={repo.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-gray-900">{repo.full_name}</h5>
                          {repo.language && (
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                              style={{ backgroundColor: getLanguageColor(repo.language) }}
                            >
                              {repo.language}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            ⭐ {formatNumber(repo.stargazers_count)}
                          </span>
                          <span className="flex items-center">
                            🍴 {formatNumber(repo.forks_count)}
                          </span>
                          <span>Updated {formatDate(repo.updated_at)}</span>
                        </div>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile */}
        {activeView === 'user' && (
          <div className="space-y-4">
            <form onSubmit={handleUserSearch} className="flex space-x-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter GitHub username..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                Search User
              </button>
            </form>

            {userProfile && (
              <div className="border rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.login}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="text-lg font-medium text-gray-900">{userProfile.name || userProfile.login}</h5>
                      <span className="text-gray-500">@{userProfile.login}</span>
                    </div>
                    {userProfile.bio && (
                      <p className="text-sm text-gray-600 mt-1">{userProfile.bio}</p>
                    )}
                    <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        👥 {formatNumber(userProfile.followers)} followers
                      </span>
                      <span className="flex items-center">
                        📦 {formatNumber(userProfile.public_repos)} repositories
                      </span>
                      <span>Joined {formatDate(userProfile.created_at)}</span>
                    </div>
                  </div>
                  <a
                    href={userProfile.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Languages */}
        {activeView === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Popular Languages</h4>
              <button
                onClick={fetchLanguageStats}
                disabled={loading}
                className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {Object.keys(languageStats).length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(languageStats)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 9)
                  .map(([language, bytes]) => (
                    <div key={language} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getLanguageColor(language) }}
                        ></div>
                        <span className="font-medium text-gray-900">{language}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatNumber(bytes)} bytes
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Click "Refresh" to load language statistics</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
