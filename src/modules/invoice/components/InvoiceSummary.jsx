import React from 'react';

export default function InvoiceSummary({
  selectedItems,
  extraCosts = [],
  discount = [],
  subtotal,
  tax,
  total,
  removeFromInvoice,
  updateQuantity,
  removeExtraCost,
  removeDiscount,
  getLaborCost,
  invoiceRef,
  notes,
}) {
  return (
    <div ref={invoiceRef} className="bg-white p-6 rounded shadow w-full max-w-[800px] mx-auto">
      <h3 className="text-xl font-semibold mb-4">Invoice Summary</h3>

      {/* PRODUCTOS */}
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
              <tr key={item._id}>
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

      {/* EXTRA COSTS */}
      {extraCosts.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Other Charges</h4>
          <ul className="list-disc list-inside space-y-1">
            {extraCosts.map((extra, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div className="flex-1">{extra.name}</div>
                <div className="flex items-center gap-2">
                  <span>${extra.cost.toFixed(2)}</span>
                  <button
                    onClick={() => removeExtraCost(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DISCOUNTS */}
      {Array.isArray(discount) && discount.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Discounts</h4>
          <ul className="list-disc list-inside space-y-1">
            {discount.map((d, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <div className="flex-1">{d.name}</div>
                <div className="flex items-center gap-2">
                  <span>-${d.dCost.toFixed(2)}</span>
                  <button
                    onClick={() => removeDiscount(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* TOTAL */}
      <div className="text-right space-y-1">
        <p>
          Subtotal: <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </p>
        <p>
          Tax (7%): <span className="font-semibold">${tax.toFixed(2)}</span>
        </p>
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      </div>

      {/* NOTES SECTION */}
      {notes && notes.trim() && (
        <div className="mt-6 pt-4 border-t border-gray-300">
          <h4 className="text-lg font-semibold mb-2">Notes:</h4>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-gray-700 whitespace-pre-wrap">{notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}


