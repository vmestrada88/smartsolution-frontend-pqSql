/**
 * Warranty disclaimer text content
 */
const WARRANTY_TEXT = 'Warranty Disclaimer: ' +
  'The installed equipment is covered by a limited warranty for a period of one (1) year from the date of installation. ' +
  'Labor is warranted for six (6) months. No warranty is provided for any equipment not supplied directly by our company.';

/**
 * Default configuration for warranty disclaimer
 */
const WARRANTY_CONFIG = {
  fontSize: 9,
  fontStyle: 'normal',
  maxWidth: 180,
  xPosition: 14,
  color: [0, 0, 0] // Black color
};

/**
 * Adds warranty disclaimer to the PDF document with customizable options
 * @param {jsPDF} doc - The PDF document instance
 * @param {number} y - The current Y position on the page
 * @param {Object} options - Optional configuration overrides
 * @param {number} options.fontSize - Font size for the disclaimer (default: 9)
 * @param {string} options.fontStyle - Font style (default: 'normal')
 * @param {number} options.maxWidth - Maximum width for text wrapping (default: 180)
 * @param {number} options.xPosition - X position for the text (default: 14)
 * @param {Array} options.color - RGB color array (default: [0, 0, 0])
 * @param {string} options.customText - Custom warranty text to override default
 */
export const addWarrantyDisclaimer = (doc, y, options = {}) => {
  // Merge default config with provided options
  const config = { ...WARRANTY_CONFIG, ...options };

  // Use custom text if provided, otherwise use default
  const warrantyText = config.customText || WARRANTY_TEXT;

  // Set initial font properties
  doc.setFontSize(config.fontSize);
  doc.setFont(undefined, config.fontStyle);

  // Set text color if specified
  if (config.color && config.color.length === 3) {
    doc.setTextColor(config.color[0], config.color[1], config.color[2]);
  }

  // Split the text into parts: bold title and normal content
  const boldText = 'Warranty Disclaimer: ';
  const normalText = warrantyText.replace(boldText, '');

  // Add bold text
  doc.setFont(undefined, 'bold');
  const boldWidth = doc.getTextWidth(boldText);
  doc.text(boldText, config.xPosition, y);

  // Add normal text after the bold text
  doc.setFont(undefined, 'normal');
  const remainingWidth = config.maxWidth - boldWidth;

  if (remainingWidth > 0) {
    // Try to fit remaining text on the same line
    const normalSplit = doc.splitTextToSize(normalText, remainingWidth);
    if (normalSplit.length > 0) {
      doc.text(normalSplit[0], config.xPosition + boldWidth, y);

      // If there's more text that doesn't fit, add it on new lines
      if (normalSplit.length > 1) {
        for (let i = 1; i < normalSplit.length; i++) {
          y += config.fontSize * 0.4;
          doc.text(normalSplit[i], config.xPosition, y);
        }
      }
    }
  } else {
    // If bold text takes full width, put normal text on next line
    y += config.fontSize * 0.4;
    const splitText = doc.splitTextToSize(normalText, config.maxWidth);
    doc.text(splitText, config.xPosition, y);
    y += (splitText.length - 1) * config.fontSize * 0.4;
  }

  // Reset text color to black for subsequent content
  doc.setTextColor(0, 0, 0);

  // Return the new Y position after adding the disclaimer
  return y + config.fontSize * 0.4;
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