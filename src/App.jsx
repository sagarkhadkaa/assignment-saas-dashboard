import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PricingPage from './components/PricingPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/pricing' element={<PrivateRoute />}>
              <Route index element={<PricingPage />} />
            </Route>
            <Route path='/dashboard' element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path='/' element={<Navigate to='/login' />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
