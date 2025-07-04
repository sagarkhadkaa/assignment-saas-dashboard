import { useState } from 'react';

const getStatusColor = (status) => {
  const colors = {
    Planning: 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    Testing: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-green-100 text-green-800',
    'On Hold': 'bg-orange-100 text-orange-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export default function ProjectList({ projects, onEdit, onDelete, loading }) {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (projectId) => {
    try {
      await onDelete(projectId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
        <span className='ml-2 text-gray-600'>Loading projects...</span>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className='text-center py-8'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
          />
        </svg>
        <h3 className='mt-2 text-sm font-medium text-gray-900'>No projects</h3>
        <p className='mt-1 text-sm text-gray-500'>
          Get started by creating a new project.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {projects.map((project) => (
        <div
          key={project.id}
          className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow'
        >
          <div className='p-6'>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {project.title}
                </h3>
                <p className='text-gray-600 mb-3'>{project.description}</p>
                <div className='flex items-center space-x-4 mb-2'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status}
                  </span>
                  <span className='text-sm text-gray-500'>
                    Created: {formatDate(project.createdAt)}
                  </span>
                </div>
                {project.githubUrl && (
                  <div className='flex items-center space-x-1 text-sm'>
                    <svg className='w-4 h-4 text-gray-500' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z' clipRule='evenodd' />
                    </svg>
                    <a
                      href={project.githubUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:text-blue-800 hover:underline truncate'
                    >
                      {project.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </div>
                )}
              </div>
              <div className='flex items-center space-x-2 ml-4'>
                <button
                  onClick={() => onEdit(project)}
                  className='inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(project.id)}
                  className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3 text-center'>
              <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                <svg
                  className='h-6 w-6 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z'
                  />
                </svg>
              </div>
              <h3 className='text-lg leading-6 font-medium text-gray-900 mt-4'>
                Delete Project
              </h3>
              <div className='mt-2 px-7 py-3'>
                <p className='text-sm text-gray-500'>
                  Are you sure you want to delete this project? This action
                  cannot be undone.
                </p>
              </div>
              <div className='items-center px-4 py-3'>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className='px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300'
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className='px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
