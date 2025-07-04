import { useState } from 'react';

const PROJECT_STATUSES = [
  'Planning',
  'In Progress',
  'Testing',
  'Completed',
  'On Hold',
  'Cancelled',
];

export default function ProjectForm({
  project,
  onSubmit,
  onCancel,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    status: project?.status || 'Planning',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <div className='mt-3'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='title'
                className='block text-sm font-medium text-gray-700'
              >
                Title
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Enter project title'
              />
              {errors.title && (
                <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Enter project description'
              />
              {errors.description && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='status'
                className='block text-sm font-medium text-gray-700'
              >
                Status
              </label>
              <select
                id='status'
                name='status'
                value={formData.status}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.status ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className='mt-1 text-sm text-red-600'>{errors.status}</p>
              )}
            </div>

            <div className='flex justify-end space-x-3 pt-4'>
              <button
                type='button'
                onClick={onCancel}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isLoading}
                className='px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'
              >
                {isLoading ? 'Saving...' : project ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
