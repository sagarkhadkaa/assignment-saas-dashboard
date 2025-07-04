import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SubscriptionContext = createContext();

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'GitHub integration (limited)',
      'Community support'
    ],
    limits: {
      projects: 3,
      githubRequests: 10,
      analyticsHistory: 7, // days
    },
    buttonText: 'Current Plan',
    popular: false,
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 19,
    interval: 'month',
    stripePrice: 'price_1234567890', // This would be your actual Stripe price ID
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Full GitHub integration',
      'Priority support',
      'Export data',
      'Team collaboration'
    ],
    limits: {
      projects: -1, // unlimited
      githubRequests: 100,
      analyticsHistory: 30, // days
    },
    buttonText: 'Upgrade to Pro',
    popular: true,
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 49,
    interval: 'month',
    stripePrice: 'price_0987654321', // This would be your actual Stripe price ID
    features: [
      'Everything in Pro',
      'Advanced security',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise deployment'
    ],
    limits: {
      projects: -1, // unlimited
      githubRequests: 1000,
      analyticsHistory: 365, // days
    },
    buttonText: 'Contact Sales',
    popular: false,
  },
};

export function SubscriptionProvider({ children }) {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // In a real app, this would fetch from your backend/Firestore
  const fetchSubscription = async () => {
    if (!currentUser) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      // Mock subscription data - in real app, fetch from your backend
      const mockSubscription = {
        id: 'sub_mock123',
        userId: currentUser.uid,
        planId: 'free', // Default to free plan
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdAt: new Date(),
      };

      // Try to get saved subscription from localStorage (for demo purposes)
      const savedSubscription = localStorage.getItem(`subscription_${currentUser.uid}`);
      if (savedSubscription) {
        setSubscription(JSON.parse(savedSubscription));
      } else {
        setSubscription(mockSubscription);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // Update subscription (mock implementation)
  const updateSubscription = async (planId) => {
    if (!currentUser) return;

    const updatedSubscription = {
      ...subscription,
      planId,
      updatedAt: new Date(),
    };

    setSubscription(updatedSubscription);
    localStorage.setItem(`subscription_${currentUser.uid}`, JSON.stringify(updatedSubscription));
  };

  // Get current plan details
  const getCurrentPlan = () => {
    if (!subscription) return SUBSCRIPTION_PLANS.FREE;
    return SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()] || SUBSCRIPTION_PLANS.FREE;
  };

  // Check if user can perform an action based on their plan
  const canPerformAction = (action, count = 0) => {
    const currentPlan = getCurrentPlan();
    
    switch (action) {
      case 'createProject':
        if (currentPlan.limits.projects === -1) return true;
        return count < currentPlan.limits.projects;
      
      case 'githubRequest':
        return count < currentPlan.limits.githubRequests;
      
      case 'viewAnalytics':
        return true; // All plans can view analytics
      
      case 'exportData':
        return currentPlan.id !== 'free';
      
      case 'teamCollaboration':
        return currentPlan.id === 'pro' || currentPlan.id === 'enterprise';
      
      default:
        return true;
    }
  };

  // Get usage limits for current plan
  const getUsageLimits = () => {
    const currentPlan = getCurrentPlan();
    return currentPlan.limits;
  };

  // Check if subscription is active
  const isSubscriptionActive = () => {
    if (!subscription) return false;
    if (subscription.planId === 'free') return true;
    return subscription.status === 'active' && new Date() < new Date(subscription.currentPeriodEnd);
  };

  useEffect(() => {
    fetchSubscription();
  }, [currentUser]);

  const value = {
    subscription,
    loading,
    getCurrentPlan,
    canPerformAction,
    getUsageLimits,
    isSubscriptionActive,
    updateSubscription,
    plans: SUBSCRIPTION_PLANS,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
