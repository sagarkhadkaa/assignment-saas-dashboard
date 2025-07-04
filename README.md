# SaaS Dashboard with Firebase Authentication

This project is a comprehensive React SaaS dashboard with Firebase authentication, project management, data visualization, GitHub API integration, and Stripe subscription management.

## System Requirements

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js**: `>= 18.0.0` (Recommended: `v18.x` or `v20.x` or `v22.x`)
  - This project is tested with Node.js `v22.11.0`
- **npm**: `>= 8.0.0` (comes with Node.js)
  - This project is tested with npm `v10.9.0`
- **Git**: Latest version for version control

### Compatible Operating Systems

- macOS 10.15 or later
- Windows 10 or later
- Linux (Ubuntu 18.04+, CentOS 7+, or similar)

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### External Services Required

- **Firebase Account**: For authentication and Firestore database
- **GitHub Account**: For API integration (optional, has rate limiting)
- **Stripe Account**: For payment processing (test mode available)

## Setup Instructions

### 1. Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Firebase configuration values:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   ```

### 2. Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Add a web app to your project
4. Register your app and get your Firebase configuration
5. Copy the configuration values to your `.env` file

### 3. Enable Firebase Services

1. **Authentication**: In the Firebase Console, go to "Authentication" > "Sign-in method" and enable the "Email/Password" sign-in provider
2. **Firestore Database**:
   - Go to "Firestore Database" in the Firebase Console
   - Click "Create database"
   - Choose "Start in test mode" for development (you can configure security rules later)
   - Select a location for your database

### 4. Running the Application

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173/)

## Security Notice

⚠️ **Important**: Never commit your `.env` file to version control. The `.env` file contains sensitive Firebase configuration that should not be shared publicly.

## Features

- User registration with email and password
- User login with email and password
- Protected dashboard route (only accessible to authenticated users)
- Logout functionality
- Environment variable configuration for security
- **Project Management CRUD Operations:**
  - Create new projects with title, description, and status
  - View all projects in a responsive list
  - Edit existing projects
  - Delete projects with confirmation
  - Real-time data synchronization with Firestore
  - Projects are user-specific (each user sees only their own projects)

## Project Structure

- `src/firebase/config.js`: Firebase configuration using environment variables
- `src/contexts/AuthContext.jsx`: Authentication context provider
- `src/hooks/useProjects.js`: Custom hook for project CRUD operations
- `src/components/Login.jsx`: Login component
- `src/components/Signup.jsx`: Signup component
- `src/components/Dashboard.jsx`: Main dashboard with project management
- `src/components/ProjectForm.jsx`: Modal form for creating/editing projects
- `src/components/ProjectList.jsx`: Component for displaying projects list
- `src/components/PrivateRoute.jsx`: Route component for protected routes

## Technologies Used

- React (Vite)
- React Router
- Firebase Authentication
- Tailwind CSS
