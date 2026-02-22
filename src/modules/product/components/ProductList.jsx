/**
 * ProductList component renders a list of products with pricing and add-to-invoice functionality.
 * 
 * @component
 * @description Displays products in a list format with name, description, pricing details,
 *              and an "Add to Invoice" button for each product.
 * @param {Object} props - Component props
 * @param {Array} [props.products=[]] - Array of product objects to display
 * @param {Function} [props.addToInvoice=()=>{}] - Callback function when a product is added to invoice
 * @returns {JSX.Element} The product list component
 */
import getLaborCost from '../../../util/LaborCost';
import Button from '../../../components/ui/Button';
import logo from '../../../assets/logo.jpg';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ProductList({ products = [], addToInvoice = () => {} }) {
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  // State for accordion open/close
  const [accordionOpen, setAccordionOpen] = useState({});

  const toggleAccordion = (category) => {
    setAccordionOpen(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return (
    <div className="mb-6">
      <h4 className="text-xl font-semibold mb-2 text-gray-700">Select Products</h4>
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((category) => (
          <div key={category} className="bg-white shadow-sm rounded-md border mb-3">
            <button
              onClick={() => toggleAccordion(category)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <h5 className="text-lg font-medium text-gray-800">{category} ({groupedProducts[category].length} products)</h5>
              <svg
                className={`w-6 h-6 transform transition-transform ${accordionOpen[category] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {accordionOpen[category] && (
              <ul className="px-4 pb-4 space-y-3">
                {groupedProducts[category].map((p) => {
                  const laborCost = getLaborCost(p.category);
                  const subtotalProducts = p.priceSell + laborCost;

                  return (
                    <li
                      key={p._id || p.id || `${p.brand}-${p.model}`}
                      className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-md border"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={p.imageUrls?.[0] || logo}
                          alt={p.name}
                          className="w-16 h-16 object-cover rounded bg-gray-100"
                          onError={(e) => { e.currentTarget.src = logo; }}
                        />
                        <div className="leading-tight">
                          <div className="font-semibold text-gray-800">{p.name}</div>
                          <div className="text-sm text-gray-600">
                            <span className="mr-3"><strong>Brand:</strong> {p.brand}</span>
                            <span className="mr-3"><strong>Model:</strong> {p.model}</span>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">
                            <span className="mr-3"><strong>Price:</strong> ${p.priceSell}</span>
                            <span className="mr-3"><strong>Install:</strong> ${laborCost}</span>
                            <span><strong>Subtotal:</strong> ${subtotalProducts}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Button onClick={() => addToInvoice(p)}>+ Add</Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p className="text-red-600">There are no products available.</p>
      )}
    </div>
  );
  
}

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
  addToInvoice: PropTypes.func
};