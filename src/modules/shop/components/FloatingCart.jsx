import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { updateCartItemAsync, removeCartItemAsync } from '../../../store/cartSlice';
import toast from 'react-hot-toast';

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.cart);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = items.reduce((total, item) => total + (item.product?.priceSell * item.quantity), 0);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItemAsync({ id, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error('Error updating quantity');
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await dispatch(removeCartItemAsync(id)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Error removing item');
    }
  };

  if (totalItems === 0) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-gray-200 text-gray-500 p-4 rounded-full shadow-lg cursor-not-allowed">
          <ShoppingCart className="w-6 h-6" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        </button>
      </div>

      {/* Cart Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
          <div className="bg-white rounded-t-3xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Shopping Cart ({totalItems})
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 max-h-96">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        {item.product?.imageUrls?.[0] ? (
                          <img
                            src={item.product.imageUrls[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                          {item.product?.name}
                        </h3>
                        <p className="text-teal-600 font-bold">
                          ${item.product?.priceSell?.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>

                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center transition-colors ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-teal-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <Link
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-center"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;