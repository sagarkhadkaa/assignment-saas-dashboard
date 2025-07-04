import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { projects, loading, error, addProject, updateProject, deleteProject } =
    useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  if (!currentUser) {
    return <Navigate to='/login' />;
  }

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await addProject(formData);
      }
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = async (projectId) => {
    await deleteProject(projectId);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navigation */}
      <nav className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex flex-shrink-0 items-center'>
                <span className='text-xl font-bold text-indigo-600'>
                  Project Dashboard
                </span>
              </div>
            </div>
            <div className='flex items-center'>
              <span className='mr-4 text-gray-700'>{currentUser.email}</span>
              <button
                onClick={logout}
                className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Projects</h1>
              <p className='mt-1 text-sm text-gray-500'>
                Manage your projects and track their progress
              </p>
            </div>
            <button
              onClick={handleAddProject}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <svg
                className='-ml-1 mr-2 h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              Add Project
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
            {error}
          </div>
        )}

        {/* Project List */}
        <div className='bg-white shadow rounded-lg p-6'>
          <ProjectList
            projects={projects}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            loading={loading}
          />
        </div>
      </main>

      {/* Project Form Modal */}
      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}
    </div>
  );
}
