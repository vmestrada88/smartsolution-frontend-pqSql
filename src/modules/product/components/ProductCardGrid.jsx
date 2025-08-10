import React from 'react';
import Button from '../../../components/ui/Button';

export default function ProductCardGrid({ products, addToInvoice, getLaborCost, logo }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-200 flex"
        >
          <div className="flex-shrink-0">
            <img
              src={product.imageUrls?.[0] || logo}
              alt={product.name}
              className="w-32 h-32 object-cover bg-gray-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logo;
              }}
            />
          </div>
          <div className="p-4 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
              <p className="text-sm text-gray-600"><strong>Brand:</strong> {product.brand}</p>
              <p className="text-sm text-gray-600"><strong>Model:</strong> {product.model}</p>
              <p className="text-sm text-gray-600"><strong>Category:</strong> {product.category}</p>
              <p className="text-sm text-gray-600"><strong>Price:</strong> ${product.priceSell}</p>
              <p className="text-sm text-gray-600"><strong>Install:</strong> ${getLaborCost(product.category)}</p>
            </div>
            <Button
              onClick={() => addToInvoice(product)}
              
            >
              + Add
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
