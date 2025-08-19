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
          ? data.map(p => ({ ...p, _id: p.id ?? p.id }))
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
      {/* Encabezado */}
      <h1 className="text-2xl font-bold mb-4">Our Catalog</h1>
      <h2 className="text-gray-600 mb-6">
        <strong>Browse our selection of high-quality products. Click on a product to add it to your invoice
        and view installation costs.</strong>
      </h2>

      {/* Tabla desktop */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full mb-4 border-collapse text-sm">
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
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border px-4 py-2 text-right">${item.priceSell.toFixed(2)}</td>
                  <td className="border px-4 py-2 text-right">${install.toFixed(2)}</td>
                  <td className="border px-4 py-2 text-right">
                    ${(item.quantity * (item.priceSell + install)).toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button onClick={() => removeFromInvoice(item._id)} className="text-red-500 hover:text-red-700">✕</button>
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
      </div>

      {/* Lista de tarjetas móvil */}
      <div className="sm:hidden space-y-4">
        {selectedItems.map(item => {
          const install = getLaborCost(item.category);
          return (
            <div key={item._id} className="bg-white rounded shadow p-3 border">
              <div className="font-bold text-gray-800 mb-1">{item.name}</div>
              <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-2 items-center">
                <span>Cantidad:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="min-w-[30px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                  >+</button>
                </div>
                <span>Unit: ${item.priceSell.toFixed(2)}</span>
                <span>Install: ${install.toFixed(2)}</span>
                <span>Total: ${(item.quantity * (item.priceSell + install)).toFixed(2)}</span>
              </div>
              <button onClick={() => removeFromInvoice(item._id)} className="text-red-500 hover:text-red-700 text-xs">Eliminar</button>
            </div>
          );
        })}
      </div>

      {/* Tarjeta de totales generales */}
      {selectedItems.length > 0 && (
        <div className="bg-teal-50 rounded shadow p-4 border mt-4 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-2 text-teal-700">Totales Generales</h3>
          <div className="space-y-1 text-gray-800 text-sm">
            <div>
              <span className="font-semibold">Cantidad total:</span> {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div>
              <span className="font-semibold">Precio total:</span> ${selectedItems.reduce((sum, item) => sum + item.priceSell, 0).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Instalación total:</span> ${selectedItems.reduce((sum, item) => sum + getLaborCost(item.category), 0).toFixed(2)}
            </div>
            <div>
              <span className="font-semibold">Total general:</span> ${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Lista de productos para agregar */}
      <ProductList
        products={products}
        addToInvoice={addToInvoice}
      />
    </div>
  );
}



export default Products;

