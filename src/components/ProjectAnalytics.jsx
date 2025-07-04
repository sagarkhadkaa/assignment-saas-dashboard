import { useState } from 'react';
import ProjectStatusChart from './ProjectStatusChart';
import ProjectTimelineChart from './ProjectTimelineChart';

export default function ProjectAnalytics({ projects, loading }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('doughnut');

  // Calculate basic statistics
  const stats = {
    total: projects.length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    planning: projects.filter((p) => p.status === 'Planning').length,
    testing: projects.filter((p) => p.status === 'Testing').length,
    onHold: projects.filter((p) => p.status === 'On Hold').length,
    cancelled: projects.filter((p) => p.status === 'Cancelled').length,
  };

  // Calculate completion rate
  const completionRate =
    stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0';

  // Get recent projects (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentProjects = projects.filter((project) => {
    const projectDate = project.createdAt
      ? new Date(project.createdAt)
      : new Date();
    return projectDate >= thirtyDaysAgo;
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'status', name: 'Status', icon: '📈' },
    { id: 'timeline', name: 'Timeline', icon: '📅' },
  ];

  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow p-6'>
        <div className='animate-pulse'>
          <div className='h-4 bg-gray-300 rounded w-1/4 mb-4'></div>
          <div className='space-y-3'>
            <div className='h-3 bg-gray-300 rounded'></div>
            <div className='h-3 bg-gray-300 rounded w-5/6'></div>
            <div className='h-3 bg-gray-300 rounded w-3/4'></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8 px-6' aria-label='Tabs'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
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

      <div className='p-6'>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Project Overview
              </h3>

              {/* Stats Grid */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                <div className='bg-blue-50 rounded-lg p-4'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-sm font-bold'>
                          {stats.total}
                        </span>
                      </div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-blue-600'>
                        Total Projects
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-green-50 rounded-lg p-4'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-sm font-bold'>
                          {stats.completed}
                        </span>
                      </div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-green-600'>
                        Completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-yellow-50 rounded-lg p-4'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-sm font-bold'>
                          {stats.inProgress}
                        </span>
                      </div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-yellow-600'>
                        In Progress
                      </p>
                    </div>
                  </div>
                </div>

                <div className='bg-purple-50 rounded-lg p-4'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0'>
                      <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-sm font-bold'>
                          {completionRate}%
                        </span>
                      </div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm font-medium text-purple-600'>
                        Completion Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <h4 className='text-md font-medium text-gray-900 mb-2'>
                  Recent Activity (30 days)
                </h4>
                <p className='text-sm text-gray-600'>
                  {recentProjects.length} projects created in the last 30 days
                </p>
                {recentProjects.length > 0 && (
                  <div className='mt-2'>
                    <div className='flex flex-wrap gap-1'>
                      {recentProjects.slice(0, 5).map((project) => (
                        <span
                          key={project.id}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'
                        >
                          {project.title}
                        </span>
                      ))}
                      {recentProjects.length > 5 && (
                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
                          +{recentProjects.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>
                Status Distribution
              </h3>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setChartType('doughnut')}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === 'doughnut'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Doughnut
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === 'bar'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
            <ProjectStatusChart projects={projects} chartType={chartType} />
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900'>
              Project Timeline
            </h3>
            <ProjectTimelineChart projects={projects} />
          </div>
        )}
      </div>
    </div>
  );
}
