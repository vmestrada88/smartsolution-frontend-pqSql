import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { API_CONFIG, fetchConfig } from '../services/api';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY');

const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...fetchConfig.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Payment Form Component
 */
function CheckoutForm({ amount, invoiceId, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        onError?.(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Notify backend
        const res = await fetch(`${API_CONFIG.BASE_URL}/payments/process`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            invoiceId,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
      onError?.(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Amount to pay:</span>
          <span className="text-2xl font-bold text-blue-600">
            ${amount.toFixed(2)}
          </span>
        </div>
      </div>

      <PaymentElement />

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          isProcessing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        Secured by Stripe. Your payment information is encrypted.
      </div>
    </form>
  );
}

/**
 * Payment Modal Component
 */
export default function StripePayment({ amount, invoiceId, onSuccess, onError, onCancel }) {
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Create payment intent on mount
    const createPaymentIntent = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/payments/create-intent`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({
            amount,
            invoiceId,
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setClientSecret(data.clientSecret);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        setIsLoading(false);
        onError?.(err);
      }
    };

    createPaymentIntent();
  }, [amount, invoiceId, onError]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Payment</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Preparing payment...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm
              amount={amount}
              invoiceId={invoiceId}
              onSuccess={onSuccess}
              onError={onError}
            />
          </Elements>
        ) : null}
      </div>
    </div>
  );
}
