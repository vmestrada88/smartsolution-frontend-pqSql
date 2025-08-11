import React from 'react';
import getLaborCost from '../../../util/LaborCost';
import Button from '../../../components/ui/Button';
import logo from '../../../assets/logo.jpg';

// Removed invalid laborCost declaration; laborCost is set per product inside the map callback.


export default function ProductList({ products, addToInvoice }) {

  return (
    <div className="mb-6">
      <h4 className="text-xl font-semibold mb-2 text-gray-700">Select Products</h4>
        <ul className="space-y-3">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((p) => {
            const laborCost = getLaborCost(p.category);
            const subtotalProducts = p.priceSell + laborCost;

            return (
                <li
                  key={p._id || p.id || `${p.brand}-${p.model}`}
                  className="flex items-center justify-between bg-white shadow-sm px-4 py-3 rounded-md border"
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
                        <span><strong>Category:</strong> {p.category}</span>
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
          })
        ) : (
          <p className="text-red-600">There are no products available.</p>
        )}
      </ul>
    </div>
  );
}
