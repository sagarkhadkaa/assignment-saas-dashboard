import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Navigate, Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from './ProjectForm';
import ProjectList from './ProjectList';
import ProjectAnalytics from './ProjectAnalytics';
import GitHubIntegration from './GitHubIntegration';
import FeatureRestriction, { UsageLimitIndicator } from './FeatureRestriction';
import QuickActions from './QuickActions';
import StripeCheckout from './StripeCheckout';
import { addDemoDataToFirestore } from '../utils/demoData';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { getCurrentPlan, canPerformAction, updateSubscription } = useSubscription();
  const { projects, loading, error, addProject, updateProject, deleteProject } =
    useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const currentPlan = getCurrentPlan();

  if (!currentUser) {
    return <Navigate to='/login' />;
  }

  const handleAddProject = () => {
    // Check if user can create more projects
    if (!canPerformAction('createProject', projects.length)) {
      return; // FeatureRestriction component will handle the UI
    }
    setEditingProject(null);
    setShowForm(true);
  };

  const handleUpgrade = (planId, planName, planPrice) => {
    setSelectedPlan({ id: planId, name: planName, price: planPrice });
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = async (planId) => {
    try {
      await updateSubscription(planId);
      alert('Subscription updated successfully!');
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
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

  const handleAddDemoData = async () => {
    try {
      setFormLoading(true);
      await addDemoDataToFirestore(addProject);
      console.log('Demo data added successfully');
    } catch (error) {
      console.error('Error adding demo data:', error);
    } finally {
      setFormLoading(false);
    }
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
            <div className='flex items-center space-x-4'>
              {/* Subscription Info */}
              <div className='flex items-center space-x-2'>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentPlan.id === 'free' 
                    ? 'bg-gray-100 text-gray-800' 
                    : currentPlan.id === 'pro'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {currentPlan.name} Plan
                </span>
                <Link
                  to="/pricing"
                  className='text-sm text-gray-600 hover:text-indigo-600'
                >
                  Manage
                </Link>
              </div>
              
              <span className='text-gray-300'>|</span>
              <span className='text-sm text-gray-700'>{currentUser.email}</span>
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
        {/* Dashboard Header */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div className='mb-4 lg:mb-0'>
              <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
              <p className='mt-2 text-lg text-gray-600'>
                Welcome back! Here's an overview of your projects and activity.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <button
                onClick={handleAddDemoData}
                disabled={formLoading}
                className='inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
              >
                <svg className='-ml-1 mr-2 h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' />
                </svg>
                Add Demo Data
              </button>
              
              <FeatureRestriction 
                feature="createProject" 
                currentCount={projects.length}
                fallback={
                  <button
                    onClick={() => handleUpgrade('pro', 'Pro', 19)}
                    className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                  >
                    <svg className='-ml-1 mr-2 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m0 0v2m0-2h2m-2 0H10' />
                    </svg>
                    Upgrade to Add Projects
                  </button>
                }
              >
                <button
                  onClick={handleAddProject}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  <svg className='-ml-1 mr-2 h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                  New Project
                </button>
              </FeatureRestriction>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
            <div className='flex items-center'>
              <svg className='w-5 h-5 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Quick Stats and Usage Overview */}
        <div className='mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {/* Project Count */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total Projects</p>
                <p className='text-3xl font-bold text-gray-900'>{projects.length}</p>
              </div>
              <div className='flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg'>
                <svg className='w-6 h-6 text-indigo-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                </svg>
              </div>
            </div>
            <div className='mt-4'>
              <UsageLimitIndicator feature="projects" currentCount={projects.length} className="text-xs" />
            </div>
          </div>

          {/* Completed Projects */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Completed</p>
                <p className='text-3xl font-bold text-green-600'>
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
              </div>
              <div className='flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg'>
                <svg className='w-6 h-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-sm text-gray-500'>
                {projects.length > 0 ? Math.round((projects.filter(p => p.status === 'Completed').length / projects.length) * 100) : 0}% completion rate
              </p>
            </div>
          </div>

          {/* In Progress Projects */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>In Progress</p>
                <p className='text-3xl font-bold text-blue-600'>
                  {projects.filter(p => p.status === 'In Progress').length}
                </p>
              </div>
              <div className='flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
                </svg>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-sm text-gray-500'>Active development</p>
            </div>
          </div>

          {/* GitHub API Usage */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>API Usage</p>
                <p className='text-3xl font-bold text-purple-600'>25</p>
              </div>
              <div className='flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg'>
                <svg className='w-6 h-6 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z' clipRule='evenodd' />
                </svg>
              </div>
            </div>
            <div className='mt-4'>
              <UsageLimitIndicator feature="githubRequests" currentCount={25} className="text-xs" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
          {/* Left Column - Projects */}
          <div className='xl:col-span-2 space-y-8'>
            {/* Project List Section */}
            <div className='bg-white shadow rounded-lg'>
              <div className='px-6 py-4 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-medium text-gray-900'>Recent Projects</h2>
                  <span className='text-sm text-gray-500'>{projects.length} total</span>
                </div>
              </div>
              <div className='p-6'>
                <ProjectList
                  projects={projects}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  loading={loading}
                />
              </div>
            </div>

            {/* Analytics Section */}
            <div>
              <ProjectAnalytics projects={projects} loading={loading} />
            </div>
          </div>

          {/* Right Column - Quick Actions & GitHub Integration */}
          <div className='space-y-8'>
            {/* Quick Actions */}
            <div>
              <QuickActions
                onAddProject={handleAddProject}
                onAddDemoData={handleAddDemoData}
                projectCount={projects.length}
                loading={formLoading}
              />
            </div>
            
            {/* GitHub Integration */}
            <div>
              <GitHubIntegration />
            </div>
          </div>
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

      {/* Stripe Checkout Modal */}
      {showCheckout && selectedPlan && (
        <StripeCheckout
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
