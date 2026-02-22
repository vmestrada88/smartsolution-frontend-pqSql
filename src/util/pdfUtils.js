import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { addWarrantyDisclaimer } from './warrantyUtils';

/**
 * Generates a complete PDF proposal document
 * @param {Array} selectedItems - Array of selected products with quantities
 * @param {number} totalLineCost - Total cost before tax
 * @param {string} logo - Base64 encoded logo image
 * @param {Function} getLaborCost - Function to get labor cost by category
 */
export const generateProposalPDF = (selectedItems, totalLineCost, logo, getLaborCost) => {
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

  // Create filename with date
  const fileName = `SSFL Install Proposal  ${dateStr.replace(/\//g, '-')}.pdf`;
  doc.setFontSize(10);
  doc.text(`Date: ${dateStr}  Time: ${timeStr}`, 200, 12, { align: 'right' });

  // Table body same as floating table
  const productTable = selectedItems.map(item => [
    item.name,
    item.quantity,
    `${item.priceSell.toFixed(2)}\nx ${item.quantity} = ${(item.priceSell * item.quantity).toFixed(2)}`,
    `${getLaborCost(item.category).toFixed(2)}\nx ${item.quantity} = ${(getLaborCost(item.category) * item.quantity).toFixed(2)}`,
    `${(item.quantity * (item.priceSell + getLaborCost(item.category))).toFixed(2)}`
  ]);

  // Table footer same as floating tfoot
  const tableFooter = [
    [
      'Total:',
      selectedItems.reduce((sum, item) => sum + item.quantity, 0),
      `$${selectedItems.reduce((sum, item) => sum + (item.priceSell * item.quantity), 0).toFixed(2)}`,
      `$${selectedItems.reduce((sum, item) => sum + (getLaborCost(item.category) * item.quantity), 0).toFixed(2)}`,
      `$${selectedItems.reduce((sum, item) => sum + (item.quantity * (item.priceSell + getLaborCost(item.category))), 0).toFixed(2)}`
    ]
  ];

  doc.autoTable({
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

  // Add warranty disclaimer to PDF
  y = addWarrantyDisclaimer(doc, y);

  doc.save(fileName);
};

/**
 * Example usage of addWarrantyDisclaimer with custom options:
 *
 * // Basic usage (uses default configuration)
 * y = addWarrantyDisclaimer(doc, y);
 *
 * // Custom styling
 * y = addWarrantyDisclaimer(doc, y, {
 *   fontSize: 8,
 *   fontStyle: 'italic',
 *   maxWidth: 150,
 *   xPosition: 20,
 *   color: [100, 100, 100] // Gray color
 * });
 *
 * // Custom warranty text
 * y = addWarrantyDisclaimer(doc, y, {
 *   customText: 'Custom warranty terms here...'
 * });
 */