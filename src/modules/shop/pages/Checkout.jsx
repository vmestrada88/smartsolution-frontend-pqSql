/**
 * Checkout.jsx - Checkout page with shipping form and Stripe payment
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchCart } from '../../../store/cartSlice';
import { createOrder } from '../../../services/shopService';
import CheckoutForm from '../components/CheckoutForm';
import { CreditCard, MapPin, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(state => state.cart);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        shippingAddress,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      const response = await createOrder(orderData);
      setClientSecret(response.clientSecret);
      toast.success('Order created successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-teal-600 hover:text-teal-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="text-teal-600" />
              Shipping Address
            </h2>
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.address}
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary & Payment */}
        <div>
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          {clientSecret && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="text-teal-600" />
                Payment
              </h2>
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;