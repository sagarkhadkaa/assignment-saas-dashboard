import { Link } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';

export default function QuickActions({ 
  onAddProject, 
  onAddDemoData, 
  projectCount, 
  loading 
}) {
  const { getCurrentPlan, canPerformAction } = useSubscription();
  const currentPlan = getCurrentPlan();

  const quickActions = [
    {
      id: 'new-project',
      name: 'Create Project',
      description: 'Start a new project',
      icon: (
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
        </svg>
      ),
      action: onAddProject,
      disabled: !canPerformAction('createProject', projectCount),
      restriction: 'createProject',
    },
    {
      id: 'demo-data',
      name: 'Add Demo Data',
      description: 'Populate with sample projects',
      icon: (
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
        </svg>
      ),
      action: onAddDemoData,
      disabled: loading,
    },
    {
      id: 'export-data',
      name: 'Export Data',
      description: 'Download project data',
      icon: (
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
        </svg>
      ),
      action: () => alert('Export feature coming soon!'),
      disabled: !canPerformAction('exportData'),
      restriction: 'exportData',
    },
    {
      id: 'pricing',
      name: 'View Plans',
      description: 'Manage subscription',
      icon: (
        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
        </svg>
      ),
      href: '/pricing',
    },
  ];

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>Quick Actions</h3>
      <div className='space-y-3'>
        {quickActions.map((action) => {
          if (action.href) {
            return (
              <Link
                key={action.id}
                to={action.href}
                className='flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
              >
                <div className='flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-3'>
                  <div className='text-indigo-600'>{action.icon}</div>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900'>{action.name}</p>
                  <p className='text-xs text-gray-500'>{action.description}</p>
                </div>
              </Link>
            );
          }

          return (
            <button
              key={action.id}
              onClick={action.action}
              disabled={action.disabled}
              className={`w-full flex items-center p-3 rounded-lg border transition-colors ${
                action.disabled
                  ? 'border-gray-100 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                action.disabled 
                  ? 'bg-gray-100' 
                  : action.restriction && !canPerformAction(action.restriction, projectCount)
                  ? 'bg-red-100'
                  : 'bg-indigo-100'
              }`}>
                <div className={`${
                  action.disabled 
                    ? 'text-gray-400' 
                    : action.restriction && !canPerformAction(action.restriction, projectCount)
                    ? 'text-red-600'
                    : 'text-indigo-600'
                }`}>
                  {action.icon}
                </div>
              </div>
              <div className='text-left'>
                <p className={`text-sm font-medium ${
                  action.disabled ? 'text-gray-400' : 'text-gray-900'
                }`}>
                  {action.name}
                </p>
                <p className={`text-xs ${
                  action.disabled ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {action.restriction && !canPerformAction(action.restriction, projectCount)
                    ? `${currentPlan.name} plan required`
                    : action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Plan Upgrade Prompt */}
      {currentPlan.id === 'free' && (
        <div className='mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200'>
          <h4 className='text-sm font-medium text-gray-900 mb-2'>
            Upgrade for More Features
          </h4>
          <p className='text-xs text-gray-600 mb-3'>
            Unlock unlimited projects, advanced analytics, and more with Pro.
          </p>
          <Link
            to='/pricing'
            className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
}
