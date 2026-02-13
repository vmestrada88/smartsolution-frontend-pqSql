/**
 * InvoiceViewExample.jsx - Example component showing how to integrate Stripe payments
 * 
 * This is a REFERENCE component showing how to use StripePayment component
 * in your invoice viewing page. Copy the relevant parts to your actual invoice view.
 * 
 * @example
 * // In your invoice list or detail page:
 * import StripePayment from '../components/StripePayment';
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../../services';
import StripePayment from '../../../components/StripePayment';
import toast from 'react-hot-toast';

/**
 * Example component showing how to display an invoice and handle payment
 */
export default function InvoiceViewExample() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${invoiceId}`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    toast.success('Payment successful!');
    setShowPaymentModal(false);
    
    // Refresh invoice to show updated payment status
    await fetchInvoice();
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          Invoice not found
        </div>
      </div>
    );
  }

  const isPaid = invoice.stripePaymentId != null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoice #{invoice.id}</h1>
            <p className="text-gray-600 mt-2">
              Date: {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>
          
          {/* Payment Status Badge */}
          <div>
            {isPaid ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Pending Payment
              </span>
            )}
          </div>
        </div>

        {/* Client Information */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Bill To:</h2>
          <p className="text-gray-600">{invoice.client?.companyName || invoice.client?.name}</p>
          <p className="text-gray-600">{invoice.client?.address}</p>
          <p className="text-gray-600">
            {invoice.client?.city}, {invoice.client?.state} {invoice.client?.zip}
          </p>
        </div>

        {/* Invoice Items */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Items:</h2>
          <div className="space-y-2">
            {invoice.items?.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-gray-800">${item.total?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Labor ({invoice.laborHours} hrs × ${invoice.laborRate}/hr):</span>
            <span className="font-medium">${(invoice.laborHours * invoice.laborRate).toFixed(2)}</span>
          </div>
          
          {!invoice.taxExempt && (
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
              <span className="font-medium">${((invoice.totalAmount || 0) * invoice.taxRate).toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xl font-bold text-gray-800 mt-4 pt-4 border-t-2 border-gray-300">
            <span>Total:</span>
            <span className="text-blue-600">${invoice.totalAmount?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      {!isPaid && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Ready to pay?</h3>
              <p className="text-gray-600 mt-1">
                Secure payment processed by Stripe
              </p>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Pay ${invoice.totalAmount?.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation (if paid) */}
      {isPaid && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Received</h3>
              <p className="text-green-700 text-sm mt-1">
                Payment ID: {invoice.stripePaymentId}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Payment Modal */}
      {showPaymentModal && (
        <StripePayment
          amount={invoice.totalAmount}
          invoiceId={invoice.id}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}
