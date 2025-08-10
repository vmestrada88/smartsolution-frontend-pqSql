import React from 'react';
import getLaborCost from '../../../util/LaborCost';

// Removed invalid laborCost declaration; laborCost is set per product inside the map callback.


export default function ProductList({ products, addToInvoice }) {

  return (
    <div className="mb-6">
      <h4 className="text-xl font-semibold mb-2 text-gray-700">Select Products</h4>
      <ul className="space-y-2">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => {
            const laborCost = getLaborCost(p.category);
            const subtotalProducts = p.priceSell + laborCost;

            return (
              <li
                key={p._id}
                className="flex items-center justify-between bg-white shadow-sm px-4 py-2 rounded-md"
              >
                <span>
                  {p.name} <br /> 
                  Price: ${p.priceSell} <br /> 
                  Labor: ${laborCost}<br /> 
                  Subtotal: ${subtotalProducts}                  
                </span>
                <button
                  onClick={() => addToInvoice(p)}
                  className="bg-tial-600 text-white px-3 py-1 rounded hover:bg-tial-700 text-sm"
                >
                  Add
                </button>
              </li>
            );
          })
        ) : (
          <p className="text-red-600">There are no products available.</p>
        )}
      </ul>
    </div>
  );
}
