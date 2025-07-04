import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription, SUBSCRIPTION_PLANS } from '../contexts/SubscriptionContext';
import { Navigate } from 'react-router-dom';
import StripeCheckout from './StripeCheckout';

export default function PricingPage() {
  const { currentUser } = useAuth();
  const { getCurrentPlan, updateSubscription } = useSubscription();
  const [loading, setLoading] = useState({});
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const currentPlan = getCurrentPlan();

  const handlePlanSelection = async (planId) => {
    if (planId === currentPlan.id) return;

    setLoading({ ...loading, [planId]: true });

    try {
      if (planId === 'free') {
        // Downgrade to free
        await updateSubscription('free');
      } else if (planId === 'enterprise') {
        // Enterprise plan - contact sales
        alert('Thank you for your interest in our Enterprise plan! Our sales team will contact you soon.');
      } else {
        // Open Stripe checkout for Pro plan
        const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()];
        setSelectedPlan({
          id: planId,
          name: plan.name,
          price: plan.price
        });
        setShowCheckout(true);
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      alert('Failed to process plan selection. Please try again.');
    } finally {
      setLoading({ ...loading, [planId]: false });
    }
  };

  const handleCheckoutSuccess = async (completedPlanId) => {
    try {
      await updateSubscription(completedPlanId);
      alert(`Successfully upgraded to ${SUBSCRIPTION_PLANS[completedPlanId.toUpperCase()].name} plan!`);
      setShowCheckout(false);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Payment successful, but failed to update subscription. Please contact support.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Select the perfect plan for your project management needs
          </p>
        </div>

        {/* Current Plan Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2"></span>
            Current Plan: {currentPlan.name}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
            const isCurrentPlan = plan.id === currentPlan.id;
            const isPopular = plan.popular;
            
            return (
              <div
                key={plan.id}
                className={`relative rounded-lg shadow-lg divide-y divide-gray-200 ${
                  isPopular
                    ? 'border-2 border-indigo-500 transform scale-105'
                    : 'border border-gray-200'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Current
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-base font-medium text-gray-500">
                      /{plan.interval}
                    </span>
                  </p>
                  
                  {/* Features List */}
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex">
                        <svg
                          className="flex-shrink-0 w-5 h-5 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Usage Limits */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Plan Limits</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Projects:</span>
                        <span className="font-medium">
                          {plan.limits.projects === -1 ? 'Unlimited' : plan.limits.projects}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>GitHub API calls:</span>
                        <span className="font-medium">{plan.limits.githubRequests}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Analytics history:</span>
                        <span className="font-medium">{plan.limits.analyticsHistory} days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="p-6">
                  <button
                    onClick={() => handlePlanSelection(plan.id)}
                    disabled={isCurrentPlan || loading[plan.id]}
                    className={`w-full py-3 px-4 border border-transparent rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.id === 'enterprise'
                        ? 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                    } ${loading[plan.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading[plan.id] ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'enterprise' ? (
                      'Contact Sales'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-medium text-gray-900 mb-2">
                Can I change my plan anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and you'll be charged or credited on a prorated basis.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-medium text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h4>
              <p className="text-gray-600">
                When you reach your plan limits, certain features will be restricted. You'll be notified
                and given the option to upgrade to a higher plan.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow">
              <h4 className="font-medium text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                Our Free plan gives you access to core features. You can upgrade to paid plans anytime
                to unlock advanced features and higher limits.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </a>
        </div>

        {/* Stripe Checkout Modal */}
        {showCheckout && selectedPlan && (
          <StripeCheckout
            isOpen={showCheckout}
            onClose={() => setShowCheckout(false)}
            planId={selectedPlan.id}
            planName={selectedPlan.name}
            planPrice={selectedPlan.price}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </div>
    </div>
  );
}
