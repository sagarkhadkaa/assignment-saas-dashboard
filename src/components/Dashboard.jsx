import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Navigate to='/login' />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 justify-between'>
            <div className='flex'>
              <div className='flex flex-shrink-0 items-center'>
                <span className='text-xl font-bold text-indigo-600'>
                  Dashboard
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

      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-lg leading-6 font-medium text-gray-900'>
              Welcome to your Dashboard
            </h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>
              You are now logged in.
            </p>
          </div>
          <div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
            <dl className='sm:divide-y sm:divide-gray-200'>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Email address
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {currentUser.email}
                </dd>
              </div>
              <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>User ID</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {currentUser.uid}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </main>
    </div>
  );
}
