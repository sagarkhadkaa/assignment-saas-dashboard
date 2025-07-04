import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function ProjectTimelineChart({ projects }) {
  // Group projects by month and count them
  const getProjectsByMonth = () => {
    const monthCounts = {};
    const cumulativeCounts = {};

    projects.forEach((project) => {
      const date = project.createdAt ? new Date(project.createdAt) : new Date();
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    // Sort months and create cumulative data
    const sortedMonths = Object.keys(monthCounts).sort();
    let cumulative = 0;

    const monthlyData = sortedMonths.map((month) => {
      cumulative += monthCounts[month];
      const [year, monthNum] = month.split('-');
      return {
        month: `${year}-${monthNum}`,
        count: monthCounts[month],
        cumulative: cumulative,
        date: new Date(parseInt(year), parseInt(monthNum) - 1, 1),
      };
    });

    return monthlyData;
  };

  const timelineData = getProjectsByMonth();

  // Prepare data for the chart
  const labels = timelineData.map((item) =>
    item.date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Projects Created',
        data: timelineData.map((item) => item.count),
        borderColor: '#3B82F6', // blue-500
        backgroundColor: '#3B82F680', // blue-500 with opacity
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Total Projects',
        data: timelineData.map((item) => item.cumulative),
        borderColor: '#10B981', // green-500
        backgroundColor: '#10B98180', // green-500 with opacity
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Project Creation Timeline',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time Period',
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Number of Projects',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
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
              d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4h4a2 2 0 012 2v6a2 2 0 01-2 2h-4v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4H5a2 2 0 01-2-2V9a2 2 0 012-2h3z'
            />
          </svg>
          <h3 className='mt-2 text-sm font-medium text-gray-900'>
            No timeline data
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Create projects to see timeline trends.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='h-64 relative'>
      <Line data={data} options={options} />
    </div>
  );
}
