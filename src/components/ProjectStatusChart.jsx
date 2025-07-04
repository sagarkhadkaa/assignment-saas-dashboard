import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const statusColors = {
  Planning: '#8B5CF6', // violet-500
  'In Progress': '#F59E0B', // yellow-500
  Testing: '#3B82F6', // blue-500
  Completed: '#10B981', // green-500
  'On Hold': '#6B7280', // gray-500
  Cancelled: '#EF4444', // red-500
};

export default function ProjectStatusChart({
  projects,
  chartType = 'doughnut',
}) {
  // Calculate status distribution
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status || 'Not Started';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);

  const data = {
    labels: statuses,
    datasets: [
      {
        data: counts,
        backgroundColor: statuses.map(
          (status) => statusColors[status] || '#6B7280'
        ),
        borderColor: statuses.map(
          (status) => statusColors[status] || '#6B7280'
        ),
        borderWidth: chartType === 'bar' ? 0 : 2,
        hoverOffset: chartType === 'doughnut' ? 4 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartType === 'doughnut' ? 'bottom' : 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Project Status Distribution',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
        },
      },
    },
    ...(chartType === 'bar' && {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Number of Projects',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Status',
          },
        },
      },
    }),
  };

  if (projects.length === 0) {
    return (
      <div className='flex items-center justify-center h-64 bg-gray-50 rounded-lg'>
        <div className='text-center'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No projects
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Create your first project to see charts.
          </p>
        </div>
      </div>
    );
  }

  const ChartComponent = chartType === 'doughnut' ? Doughnut : Bar;

  return (
    <div className='h-64 relative'>
      <ChartComponent data={data} options={options} />
    </div>
  );
}
