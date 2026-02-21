/**
 * Shop.jsx - Online store page component
 * Displays products in a grid with search, filtering, and add to cart functionality
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../../services/productsService';
import { addToCartAsync } from '../../../store/cartSlice';
import { fetchCart } from '../../../store/cartSlice';
import { Search, ShoppingCart, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import FloatingCart from '../components/FloatingCart';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  useEffect(() => {
    loadProducts();
    dispatch(fetchCart()); // Load cart when component mounts
  }, [dispatch]);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addToCartAsync({ productId: product.id, product })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Error adding to cart');
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="text-teal-600" />
          Online Shop
        </h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex">
            <div className="w-28 h-28 bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {product.image_url || (product.imageUrls && product.imageUrls[0]) ? (
                <img
                  src={product.image_url || product.imageUrls?.[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                  {product.name}
                </h3>
                <p className="text-teal-600 font-bold text-base">
                  ${product.priceSell?.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.quantity === 0}
                className="w-[72px] h-[36px] bg-blue-800 text-white rounded text-sm font-bold items-center space-x-2 hover:bg-blue-400 transition inline-flex gap-1 justify-center disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
              >
                <ShoppingCart className="h-4 w-4" />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
      
      {/* Floating Cart */}
      <FloatingCart />
    </div>
  );
};

export default Shop;