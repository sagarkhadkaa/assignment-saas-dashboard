import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (use your publishable key)
const stripePromise = loadStripe('pk_test_51234567890abcdef'); // Replace with your actual publishable key

// Card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function CheckoutForm({ planId, planName, planPrice, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    // In a real implementation, you would:
    // 1. Create a payment intent on your server
    // 2. Confirm the payment with Stripe
    // 3. Handle the response and update subscription

    try {
      // Mock successful payment for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success
      const mockPaymentResult = {
        paymentIntent: {
          id: 'pi_mock123',
          status: 'succeeded',
        }
      };

      if (mockPaymentResult.paymentIntent.status === 'succeeded') {
        onSuccess(planId);
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Subscribe to {planName}
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-lg">
              ${planPrice}/month
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Subscribe for $${planPrice}/month`
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
      </div>

      <div className="text-xs text-gray-500">
        <p>Your payment information is secure and encrypted.</p>
        <p className="mt-1">
          This is a demo implementation. No actual charges will be made.
        </p>
      </div>
    </form>
  );
}

export default function StripeCheckout({ 
  isOpen, 
  onClose, 
  planId, 
  planName, 
  planPrice, 
  onSuccess 
}) {
  if (!isOpen) return null;

  const handleSuccess = (completedPlanId) => {
    onSuccess(completedPlanId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Checkout
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                planId={planId}
                planName={planName}
                planPrice={planPrice}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
}
