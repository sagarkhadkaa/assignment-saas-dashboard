import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password should be at least 6 characters long');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError(
          'Email/password authentication is not enabled in Firebase console'
        );
      } else {
        setError(
          `Failed to create an account: ${
            err.message || err.code || 'Unknown error'
          }`
        );
        console.error(err);
      }
    }
    setLoading(false);
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
            Create a new account
          </h2>
        </div>
        {error && (
          <div className='rounded-md bg-red-50 p-4'>
            <div className='text-sm text-red-700'>{error}</div>
          </div>
        )}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4 rounded-md shadow-sm'>
            <div>
              <label htmlFor='email-address' className='sr-only'>
                Email address
              </label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                placeholder='Email address'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                placeholder='Password'
              />
            </div>
            <div>
              <label htmlFor='confirm-password' className='sr-only'>
                Confirm Password
              </label>
              <input
                id='confirm-password'
                name='confirm-password'
                type='password'
                autoComplete='new-password'
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500'
                placeholder='Confirm Password'
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className='text-sm text-center mt-4'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
