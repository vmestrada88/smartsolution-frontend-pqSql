import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../../store/cartSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message);
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      toast.success('Payment successful!');
      dispatch(clearCart());
      navigate('/orders');
    } else {
      setMessage('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {message && (
        <div className={`p-3 rounded-md text-sm ${
          message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <button
        disabled={!stripe || isProcessing}
        className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;