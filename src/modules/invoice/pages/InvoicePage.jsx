
import React, { useEffect, useState, useRef } from 'react';
import { fetchProducts } from '../../../services/productsService';

import getLaborCost from '../../../util/LaborCost';
import '../../../index.css';

import logo from '../../../assets/logo.jpg';

import DiscountForm from '../components/DiscountForm';
import ExtraCostForm from '../components/ExtraCostForm';
import InvoiceSummary from '../components/InvoiceSummary';
import ProductCardGrid from '../../product/components/ProductCardGrid';
import DownloadPDFButton from '../components/DownloadPDFButton';
import ClientSelect from '../../clients/components/ClientSelect';
import BasicInvoicePDF from '../../invoice/components/BasicInvoicePDF';

const TAX_RATE = 0.07;

export const InvoicePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [laborHours, setLaborHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(100);
  const [extraCosts, setExtraCosts] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [documentType, setDocumentType] = useState('invoice'); // "invoice" or "proposal"
  const [notes, setNotes] = useState(''); // Notes for the invoice

  const invoiceRef = useRef();
  const [selectedClient, setSelectedClient] = useState(null);
  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

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

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromInvoice(id);
      return;
    }
    setSelectedItems(
      selectedItems.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };


  const subtotalProducts = selectedItems.reduce(
    (sum, item) => sum + item.quantity * (item.priceSell + getLaborCost(item.category)),
    0
  );

  const totalLabor = laborHours * hourlyRate;
  const totalExtras = extraCosts.reduce((acc, cur) => acc + cur.cost, 0);
  const totalDiscount = discount.reduce((acc, cur) => acc + cur.dCost, 0);
  const subtotal = subtotalProducts + totalLabor + totalExtras - totalDiscount;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;



  const exportPDF = () => {
    const { generatePDF } = BasicInvoicePDF({

      clientName: selectedClient ? (selectedClient.companyName || selectedClient.name) : 'Not selected',
      clientAddress: selectedClient ? (selectedClient.companyAddress || selectedClient.address) : 'Not selected',
      clientCity: selectedClient ? (selectedClient.city || selectedClient.city) : 'Not selected',
      clientState: selectedClient ? (selectedClient.state || selectedClient.state) : 'Not selected',
      clientZip: selectedClient ? (selectedClient.zip || selectedClient.zip) : 'Not selected',
      selectedItems,
      laborHours,
      hourlyRate,
      extraCosts,
      discount,
      documentType,
      notes,
    },
      console.log(selectedClient));

    generatePDF();
  };
  const removeExtraCost = (index) => {
    setExtraCosts(extraCosts.filter((_, i) => i !== index));
  };

  const removeDiscount = (index) => {
    setDiscount(discount.filter((_, i) => i !== index));
  };



  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Invoice or Propousal Generator</h2>

      <ProductCardGrid
        products={products}
        addToInvoice={addToInvoice}
        getLaborCost={getLaborCost}
        logo={logo}
      />

      <div className="mb-4">
        <label className="mr-4 font-semibold">Document Type:</label>
        <label className="mr-4">
          <input
            type="radio"
            value="invoice"
            checked={documentType === 'invoice'}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mr-1"
          />
          Invoice
        </label>
        <label>
          <input
            type="radio"
            value="proposal"
            checked={documentType === 'proposal'}
            onChange={(e) => setDocumentType(e.target.value)}
            className="mr-1"
          />
          Proposal
        </label>
      </div>
      {console.log(documentType)}

      <ClientSelect onSelectClient={setSelectedClient} />

      <ExtraCostForm onAdd={(cost) => setExtraCosts([...extraCosts, cost])} />

      <DiscountForm onAdd={(dcount) => setDiscount([...discount, dcount])} />

      {/* Notes Section */}
      <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes for this invoice/proposal..."
          className="w-full p-3 border border-gray-300 rounded-md resize-vertical min-h-[100px] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          rows={4}
        />
        <p className="text-sm text-gray-500 mt-2">
          These notes will appear at the bottom of your {documentType || 'document'}.
        </p>
      </div>





      <InvoiceSummary
        selectedItems={selectedItems}
        extraCosts={extraCosts}
        discount={discount}
        subtotal={subtotal}
        tax={tax}
        total={total}
        removeFromInvoice={removeFromInvoice}
        updateQuantity={updateQuantity}
        removeExtraCost={removeExtraCost}
        removeDiscount={removeDiscount}
        getLaborCost={getLaborCost}
        invoiceRef={invoiceRef}
        clientName={selectedClient ? (selectedClient.companyName || selectedClient.name) : 'Not selected'}
        documentType={documentType}
        notes={notes}

      />


      <DownloadPDFButton onClick={exportPDF} />

    </div>
  );
};

export default InvoicePage;
