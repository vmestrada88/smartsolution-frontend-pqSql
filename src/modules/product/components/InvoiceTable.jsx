import getLaborCost from '../../../util/LaborCost';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

/**
 * InvoiceTable component displays the floating table of selected items for the invoice.
 * It shows product details, quantities, prices, installation costs, and totals.
 * Provides functionality to adjust quantities, remove items, and export/save proposals.
 *
 * @param {Array} selectedItems - Array of selected products with quantities
 * @param {Function} updateQuantity - Function to update item quantity
 * @param {Function} removeFromInvoice - Function to remove item from invoice
 * @param {Function} exportProductsPDF - Function to export invoice as PDF
 * @param {Function} setShowProposalForm - Function to show proposal form modal
 */
const InvoiceTable = ({
  selectedItems,
  updateQuantity,
  removeFromInvoice,
  exportProductsPDF,
  setShowProposalForm
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Vista móvil: Cards
    return (
      <div className="sticky top-0 z-30 bg-white shadow-md">
        <div className={`${selectedItems.length > 1 ? 'max-h-[30vh] overflow-y-auto' : ''} p-2`}>
          {selectedItems.map(item => {
            const install = getLaborCost(item.category);
            const itemTotal = item.quantity * (item.priceSell + install);
            return (
              <div key={item._id} className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm flex-1">{item.name}</h3>
                  <button
                    onClick={() => removeFromInvoice(item._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 ml-2"
                    aria-label="Eliminar"
                  >✕</button>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600">Quantity:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="min-w-[30px] text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >+</button>
                  </div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unit Price:</span>
                    <span>${item.priceSell.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Install/Unit:</span>
                    <span>${install.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-1 border-t">
                    <span>Total:</span>
                    <span className="text-green-600">${itemTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="bg-gray-200 p-3 font-bold text-sm">
          <div className="flex justify-between">
            <span>Grand Total:</span>
            <span className="text-green-600">
              ${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex flex-row gap-2 p-2.5">
          <button
            onClick={exportProductsPDF}
            className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 text-sm w-full"
          >
            Save PDF Proposal
          </button>
          <button
            onClick={() => setShowProposalForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm w-full"
          >
            Send Proposal
          </button>
        </div>
      </div>
    );
  }

  // Vista desktop: Tabla
  return (
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
          </tfoot>
        </table>
      </div>
      <div className="flex flex-row justify-end gap-2 p-2.5">
        <button
          onClick={exportProductsPDF}
          className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 text-sm"
        >
          Save PDF Proposal
        </button>
        <button
          onClick={() => setShowProposalForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 text-sm"
        >
          Send Proposal
        </button>
      </div>
    </div>
  );
};

InvoiceTable.propTypes = {
  selectedItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateQuantity: PropTypes.func.isRequired,
  removeFromInvoice: PropTypes.func.isRequired,
  exportProductsPDF: PropTypes.func.isRequired,
  setShowProposalForm: PropTypes.func.isRequired
};

export default InvoiceTable;