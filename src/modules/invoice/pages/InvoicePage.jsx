
/**
 * InvoicePage component for generating invoices or proposals.
 *
 * This page allows users to:
 * - Select products to add to an invoice or proposal.
 * - Specify labor hours and hourly rate.
 * - Add extra costs and discounts.
 * - Select a client from a list.
 * - Add custom notes to the document.
 * - View a summary of the invoice/proposal including subtotal, tax, and total.
 * - Download the invoice/proposal as a PDF.
 *
 * State:
 * - products: Array of available products.
 * - selectedItems: Array of products added to the invoice/proposal.
 * - laborHours: Number of labor hours.
 * - hourlyRate: Rate per labor hour.
 * - extraCosts: Array of additional costs.
 * - discount: Array of discounts applied.
 * - documentType: Type of document ("invoice" or "proposal").
 * - notes: Additional notes for the document.
 * - selectedClient: The client selected for the invoice/proposal.
 *
 * @component
 * @returns {JSX.Element} The rendered InvoicePage component.
 */
import { useEffect, useState, useRef } from 'react';
import { fetchProducts } from '../../../services/productsService';
import getLaborCost from '../../../util/LaborCost';
import '../../../index.css';
import DiscountForm from '../components/DiscountForm';
import ExtraCostForm from '../components/ExtraCostForm';
import InvoiceSummary from '../components/InvoiceSummary';
import ProductList from '../../product/components/ProductList';
import DownloadPDFButton from '../components/DownloadPDFButton';
import ClientSelect from '../../clients/components/ClientSelect';
import BasicInvoicePDF from '../../invoice/components/BasicInvoicePDF';

const TAX_RATE = 0.07;

export const InvoicePage = () => {
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  /** @type {number} Labor hours for calculation */
  const [laborHours, setLaborHours] = useState(0);
  /** @type {number} Hourly rate for labor calculation */
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
      // Normalize id field for UI components expecting _id
      const normalized = Array.isArray(data)
        ? data.map(p => ({ ...p, _id: p._id ?? p.id }))
        : [];
      setProducts(normalized);
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
      laborHours: laborHours,
      hourlyRate: hourlyRate,
      extraCosts,
      discount,
      documentType,
      notes,
    });

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

      <ProductList
        products={products}
        addToInvoice={addToInvoice}
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

      <ClientSelect onSelectClient={setSelectedClient} />
      
      {/* Labor Hours and Rate Section */}
      <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Labor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Labor Hours</label>
            <input
              type="number"
              value={laborHours}
              onChange={(e) => setLaborHours(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="0.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min="0"
              step="5"
            />
          </div>
        </div>
      </div>

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
