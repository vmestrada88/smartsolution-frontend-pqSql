import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../../services/productsService';
import '../../../index.css';  
import ProductList from '../components/ProductList';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../../assets/logo.jpg';
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
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalData, setProposalData] = useState({
    name: '',
    contact: '',
    address: ''
  });

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
    toast.success('Updated quantity');
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
    toast.success('Product added');
  };

  const removeFromInvoice = (id) => {
    setSelectedItems(selectedItems.filter(item => item._id !== id));
  };

  const exportProductsPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    // Company Header
    if (logo) {
      doc.addImage(logo, 'JPEG', 14, y, 30, 30);
    }
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Smart Solution for Living LLC', 50, y + 8);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Security Systems, Smart Homes, & Networking Company', 50, y + 16);
    doc.text('Tel: +1 (786) 824-4191', 50, y + 24);
    doc.text('Email: comercial@smartsolutionfl.com', 50, y + 30);
    doc.text('Address: 2438 NE 184 St, North Miami Beach, FL 33160', 50, y + 36);

    y += 50;

    // Date and Time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US');
    const timeStr = now.toLocaleTimeString('en-US');
    doc.setFontSize(10);
    doc.text(`Date: ${dateStr}  Time: ${timeStr}`, 200, 12, { align: 'right' });

    // Cuerpo de la tabla igual que la flotante
    const productTable = selectedItems.map(item => [
      item.name,
      item.quantity,
      `${item.priceSell.toFixed(2)}\nx ${item.quantity} = ${(item.priceSell * item.quantity).toFixed(2)}`,
      `${getLaborCost(item.category).toFixed(2)}\nx ${item.quantity} = ${(getLaborCost(item.category) * item.quantity).toFixed(2)}`,
      `${(item.quantity * (item.priceSell + getLaborCost(item.category))).toFixed(2)}`
    ]);

    // Pie de la tabla igual que el tfoot flotante
    const tableFooter = [
      [
        'Total:',
        selectedItems.reduce((sum, item) => sum + item.quantity, 0),
        `$${selectedItems.reduce((sum, item) => sum + (item.priceSell * item.quantity), 0).toFixed(2)}`,
        `$${selectedItems.reduce((sum, item) => sum + (getLaborCost(item.category) * item.quantity), 0).toFixed(2)}`,
        `$${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}`
      ]
    ];

    autoTable(doc, {
      startY: y,
      head: [['Product', 'Qty', 'Unit Price', 'Install', 'Total']],
      body: productTable,
      foot: tableFooter,
      headStyles: { fillColor: [0, 128, 128], textColor: [255, 255, 255], fontStyle: 'bold' },
      footStyles: { fillColor: [220, 220, 220], textColor: 20, fontStyle: 'bold' },
      styles: { fontSize: 10 },
    });

    y = doc.lastAutoTable.finalY + 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(`Subtotal: $${totalLineCost.toFixed(2)}`, 200, y, { align: 'right' });
    y += 8;
    const tax = totalLineCost * 0.07;
    doc.text(`Tax (7%): $${tax.toFixed(2)}`, 200, y, { align: 'right' });
    y += 8;
    doc.text(`Total: $${(totalLineCost + tax).toFixed(2)}`, 200, y, { align: 'right' });
    y += 10;

    // Warranty Disclaimer
    const warrantyText = 
      'Warranty Disclaimer: ' +
      'The installed equipment is covered by a limited warranty for a period of one (1) year from the date of installation. ' +
      'Labor is warranted for six (6) months. No warranty is provided for any equipment not supplied directly by our company.</p>';

    const splitText = doc.splitTextToSize(warrantyText, 180);
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(splitText, 14, y);

    doc.save('proposal.pdf');
  };

  const totalLineCost = selectedItems.reduce(
    (sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))),
    0
  );

  return (
    
    <div className="p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-4">Our Catalog</h1>
      <h2 className="text-gray-600 mb-6">
        <strong>Browse our selection of high-quality products. Click on a product to add it to your invoice
        and view installation costs.</strong>
      </h2>

      {/*  Table Floating */}
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <div className={`overflow-x-auto ${selectedItems.length > 2 ? 'max-h-56 overflow-y-auto' : ''}`}>
          <table className="min-w-full border-collapse text-xs">
            <thead>
              <tr>
                <th className="border px-1 py-2">Product</th>
                <th className="border px-1 py-2">Qty</th>
                <th className="border px-1 py-2">Unit Price</th>
                <th className="border px-1 py-2">Install</th>
                <th className="border px-1 py-2">Total</th>
                <th className="border px-1 py-2 w-12">Del</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map(item => {
                const install = getLaborCost(item.category);
                return (
                  <tr key={item._id}>
                    <td className="border px-1 py-2">{item.name}</td>
                    <td className="border px-1 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
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
                    </td>
                    <td className="border px-1 py-2 text-right">
                      ${item.priceSell.toFixed(2)}<br />
                      <span className="text-xs text-gray-500">x {item.quantity} = ${(item.priceSell * item.quantity).toFixed(2)}</span>
                    </td>
                    <td className="border px-1 py-2 text-right">
                      ${install.toFixed(2)}<br />
                      <span className="text-xs text-gray-500">x {item.quantity} = ${(install * item.quantity).toFixed(2)}</span>
                    </td>
                    <td className="border px-1 py-2 text-right">
                      ${(item.quantity * (item.priceSell + install)).toFixed(2)}
                    </td>
                    <td className="border px-1 py-2 text-center w-12">
                      <button
                        onClick={() => removeFromInvoice(item._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        aria-label="Eliminar"
                        style={{ minWidth: '24px', minHeight: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table footer */}
            <tfoot>
              <tr className="bg-gray-200 font-bold">
                <td className="border px-2 py-2 sm:px-4 text-right">Total:</td>
                <td className="border px-2 py-2 sm:px-4 text-center">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                </td>
                <td className="border px-2 py-2 sm:px-4 text-right">
                  ${selectedItems.reduce((sum, item) => sum + (item.priceSell * item.quantity), 0).toFixed(2)}
                </td>
                <td className="border px-2 py-2 sm:px-4 text-right">
                  ${selectedItems.reduce((sum, item) => sum + (getLaborCost(item.category) * item.quantity), 0).toFixed(2)}
                </td>
                <td className="border px-2 py-2 sm:px-4 text-right">
                  ${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}
                </td>
                <td className="border px-2 py-2 sm:px-4"></td>
              </tr>
              {/* Buttons */}
              <tr>
                <td colSpan={6} className="border px-2 py-2 sm:px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={exportProductsPDF}
                      className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700"
                    >
                      Save PDF Proposal
                    </button>
                    <button
                      onClick={() => setShowProposalForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                    >
                      Send Proposal
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>


      {/* Product List */}
      <ProductList
        products={products}
        addToInvoice={addToInvoice}
      />

    </div>
  );
}



export default Products;

