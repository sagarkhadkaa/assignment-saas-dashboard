import { useSubscription } from '../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';

export default function FeatureRestriction({ 
  feature, 
  currentCount = 0, 
  children, 
  fallback = null,
  showUpgradePrompt = true 
}) {
  const { canPerformAction, getCurrentPlan, getUsageLimits } = useSubscription();
  
  const canAccess = canPerformAction(feature, currentCount);
  const currentPlan = getCurrentPlan();
  const limits = getUsageLimits();
  
  // If user can access the feature, render children
  if (canAccess) {
    return children;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return fallback;
  }

  // Default restriction UI
  const getRestrictionMessage = () => {
    switch (feature) {
      case 'createProject':
        return {
          title: 'Project Limit Reached',
          message: `You've reached the maximum of ${limits.projects} projects on the ${currentPlan.name} plan.`,
          suggestion: 'Upgrade to Pro for unlimited projects.',
        };
      case 'githubRequest':
        return {
          title: 'API Limit Reached',
          message: `You've used all ${limits.githubRequests} GitHub API requests this month.`,
          suggestion: 'Upgrade for higher API limits.',
        };
      case 'exportData':
        return {
          title: 'Premium Feature',
          message: 'Data export is available on Pro and Enterprise plans.',
          suggestion: 'Upgrade to access advanced export features.',
        };
      case 'teamCollaboration':
        return {
          title: 'Team Feature',
          message: 'Team collaboration is available on Pro and Enterprise plans.',
          suggestion: 'Upgrade to collaborate with your team.',
        };
      default:
        return {
          title: 'Feature Restricted',
          message: `This feature is not available on the ${currentPlan.name} plan.`,
          suggestion: 'Consider upgrading for access to more features.',
        };
    }
  };

  const restriction = getRestrictionMessage();

  if (!showUpgradePrompt) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">{restriction.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 text-center">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full">
        <svg
          className="w-6 h-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-8V9a2 2 0 00-2-2H8a2 2 0 00-2 2v2m4-4V7a2 2 0 012-2h2a2 2 0 012 2v2"
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {restriction.title}
      </h3>
      
      <p className="text-gray-600 mb-4">
        {restriction.message}
      </p>
      
      <p className="text-sm text-gray-500 mb-6">
        {restriction.suggestion}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/pricing"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Upgrade Now
        </Link>
        
        <Link
          to="/pricing"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View All Plans
        </Link>
      </div>
    </div>
  );
}

// Usage limit indicator component
export function UsageLimitIndicator({ feature, currentCount, className = "" }) {
  const { getUsageLimits, getCurrentPlan } = useSubscription();
  
  const limits = getUsageLimits();
  const currentPlan = getCurrentPlan();
  
  let limit, label;
  
  switch (feature) {
    case 'projects':
      limit = limits.projects;
      label = 'Projects';
      break;
    case 'githubRequests':
      limit = limits.githubRequests;
      label = 'GitHub API calls';
      break;
    default:
      return null;
  }

  if (limit === -1) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        {label}: {currentCount} (Unlimited)
      </div>
    );
  }

  const percentage = (currentCount / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isAtLimit = currentCount >= limit;

  return (
    <div className={`text-sm ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-900'
        }`}>
          {currentCount} / {limit === -1 ? '∞' : limit}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-yellow-600 mt-1">
          You're approaching your plan limit
        </p>
      )}
      
      {isAtLimit && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-red-600">
            Limit reached
          </p>
          <Link
            to="/pricing"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Upgrade
          </Link>
        </div>
      )}
      
      {currentPlan.id === 'free' && !isAtLimit && (
        <div className="mt-2">
          <Link
            to="/pricing"
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Upgrade for unlimited {label.toLowerCase()}
          </Link>
        </div>
      )}
    </div>
  );
}
