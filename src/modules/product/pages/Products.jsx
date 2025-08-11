
import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../services/productsService';
import '../../../index.css';  
import ProductList from '../components/ProductList';
import getLaborCost from '../../../util/LaborCost';



function Products() {

  useEffect(() => {
      const loadProducts = async () => {
        const data = await fetchProducts();
        const normalized = Array.isArray(data)
          ? data.map(p => ({ ...p, _id: p._id ?? p.id }))
          : [];
        setProducts(normalized);
      };
      loadProducts();
    }, []);
  
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromInvoice(id);
      return;
    }
    setSelectedItems(
      selectedItems.map(item =>
        (item._id === id ? { ...item, quantity: newQuantity } : item)
      )
    );
  };

  const addToInvoice = (product) => {
    const existing = selectedItems.find(item => item._id === product._id);
    if (existing) {
      setSelectedItems(
        selectedItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromInvoice = (id) => {
    setSelectedItems(selectedItems.filter(item => item._id !== id));
  };

  return (
    
    <div className="p-4"> 
 
      <h1 className="text-2xl font-bold mb-4">Our Catalog</h1>
               <h2 className="text-gray-600 mb-6">
        <strong>Browse our selection of high-quality products. Click on a product to add it to your invoice
        and view installation costs.</strong>
      </h2>
          <table className="w-full mb-4 border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Unit Price</th>
            <th className="border px-4 py-2">Install</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
      {selectedItems.map(item => {
            const install = getLaborCost(item.category);
            return (
        <tr key={item._id || item.id || `${item.brand}-${item.model}`}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      -
                    </button>
                    <span className="min-w-[30px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="border px-4 py-2 text-right">${item.priceSell.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right">${install.toFixed(2)}</td>
                <td className="border px-4 py-2 text-right">
                  ${(item.quantity * (item.priceSell + install)).toFixed(2)}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => removeFromInvoice(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="bg-gray-200 font-bold">
            <td className="border px-4 py-2 text-right">Totals:</td>
            <td className="border px-4 py-2 text-center">
              {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
            </td>
            <td className="border px-4 py-2 text-right">
              ${selectedItems.reduce((sum, item) => sum + item.priceSell, 0).toFixed(2)}
            </td>
            <td className="border px-4 py-2 text-right">
              ${selectedItems.reduce((sum, item) => sum + getLaborCost(item.category), 0).toFixed(2)}
            </td>
            <td className="border px-4 py-2 text-right">
              ${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}
            </td>
            <td className="border px-4 py-2"></td>
          </tr>
        </tfoot>
      </table>
      <p className="text-gray-600 mt-4 mb-6" >
        <strong>Note:</strong> Prices are subject to change based on installation requirements and additional services.<br />  
         Applicable taxes will be added as required by law.
      </p>
  
            <ProductList
              products={products}
              addToInvoice={addToInvoice}
            />
      


      



    </div>
  );
}



export default Products;

