# SaaS Dashboard with Firebase Authentication

This project is a React SaaS dashboard with Firebase authentication integration. It includes login and signup functionality.

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

### 3. Enable Email/Password Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the "Email/Password" sign-in provider

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

## Project Structure

- `src/firebase/config.js`: Firebase configuration using environment variables
- `src/contexts/AuthContext.jsx`: Authentication context provider
- `src/components/Login.jsx`: Login component
- `src/components/Signup.jsx`: Signup component
- `src/components/Dashboard.jsx`: Dashboard component (protected route)
- `src/components/PrivateRoute.jsx`: Route component for protected routes

## Technologies Used

- React (Vite)
- React Router
- Firebase Authentication
- Tailwind CSS
