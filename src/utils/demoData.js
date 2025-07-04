// Sample data and demo utilities for the SaaS Dashboard
export const sampleProjects = [
  {
    id: 'demo-1',
    title: 'React Dashboard',
    description:
      'A modern dashboard built with React and Firebase for project management.',
    status: 'In Progress',
    githubUrl: 'https://github.com/facebook/react',
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'demo-2',
    title: 'API Integration Suite',
    description:
      'Comprehensive API integration examples including GitHub, weather, and news APIs.',
    status: 'Completed',
    githubUrl: 'https://github.com/microsoft/vscode',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'demo-3',
    title: 'Chart Analytics',
    description:
      'Data visualization components using Chart.js for project analytics and reporting.',
    status: 'Testing',
    githubUrl: 'https://github.com/chartjs/Chart.js',
    createdAt: new Date('2024-12-15'),
  },
  {
    id: 'demo-4',
    title: 'Firebase Authentication',
    description:
      'Secure user authentication system with email/password and social login options.',
    status: 'Completed',
    githubUrl: 'https://github.com/firebase/firebase-js-sdk',
    createdAt: new Date('2024-10-20'),
  },
  {
    id: 'demo-5',
    title: 'Responsive Design System',
    description:
      'Tailwind CSS-based component library with responsive design patterns.',
    status: 'Planning',
    githubUrl: 'https://github.com/tailwindlabs/tailwindcss',
    createdAt: new Date('2024-12-20'),
  },
];

export const getDemoLanguageStats = () => ({
  JavaScript: 2450000,
  TypeScript: 1820000,
  Python: 1560000,
  Java: 1230000,
  'C++': 980000,
  Go: 750000,
  Rust: 620000,
  PHP: 580000,
});

export const getDemoTrendingRepos = () => [
  {
    id: 1,
    name: 'awesome-react',
    full_name: 'enaqx/awesome-react',
    description: 'A collection of awesome things regarding React ecosystem',
    language: 'JavaScript',
    stargazers_count: 58420,
    forks_count: 7240,
    updated_at: '2024-12-20T10:30:00Z',
    html_url: 'https://github.com/enaqx/awesome-react',
  },
  {
    id: 2,
    name: 'next.js',
    full_name: 'vercel/next.js',
    description: 'The React Framework for the Web',
    language: 'TypeScript',
    stargazers_count: 125000,
    forks_count: 26800,
    updated_at: '2024-12-21T15:45:00Z',
    html_url: 'https://github.com/vercel/next.js',
  },
  {
    id: 3,
    name: 'tailwindcss',
    full_name: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development',
    language: 'CSS',
    stargazers_count: 82100,
    forks_count: 4150,
    updated_at: '2024-12-21T09:20:00Z',
    html_url: 'https://github.com/tailwindlabs/tailwindcss',
  },
  {
    id: 4,
    name: 'vite',
    full_name: 'vitejs/vite',
    description:
      'Next generation frontend tooling. Fast development build tool',
    language: 'TypeScript',
    stargazers_count: 67200,
    forks_count: 6050,
    updated_at: '2024-12-20T20:15:00Z',
    html_url: 'https://github.com/vitejs/vite',
  },
  {
    id: 5,
    name: 'firebase-js-sdk',
    full_name: 'firebase/firebase-js-sdk',
    description: 'Firebase Javascript SDK',
    language: 'TypeScript',
    stargazers_count: 5890,
    forks_count: 1420,
    updated_at: '2024-12-21T11:30:00Z',
    html_url: 'https://github.com/firebase/firebase-js-sdk',
  },
];

export const getDemoUserProfile = () => ({
  login: 'octocat',
  name: 'The Octocat',
  avatar_url: 'https://github.com/images/error/octocat_happy.gif',
  bio: 'A great new project manager and developer',
  followers: 8420,
  public_repos: 42,
  created_at: '2011-01-25T18:44:36Z',
  html_url: 'https://github.com/octocat',
});

export const getProjectStatusDistribution = (projects) => {
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status || 'Planning';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return statusCounts;
};

export const getProjectTimeline = (projects) => {
  const monthCounts = {};

  projects.forEach((project) => {
    const date = project.createdAt ? new Date(project.createdAt) : new Date();
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;
    monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
  });

  return Object.entries(monthCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));
};

// Utility function to add demo data to Firestore (for testing)
export const addDemoDataToFirestore = async (addProjectFunction) => {
  try {
    for (const project of sampleProjects) {
      const { id, ...projectData } = project; // Remove id as Firestore will generate one
      await addProjectFunction(projectData);
    }
    console.log('Demo data added successfully');
  } catch (error) {
    console.error('Error adding demo data:', error);
  }
};
