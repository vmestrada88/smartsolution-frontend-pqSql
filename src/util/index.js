/**
 * Utility functions index file.
 * 
 * @module util
 * @description Central export point for all utility functions used throughout the application.
 * Includes functions for calculating labor costs, generating PDF proposals, and adding warranty disclaimers.
 */

// Barrel exports for utility functions
export { default as getLaborCost } from './LaborCost';
export { generateProposalPDF } from './pdfUtils';
export { addWarrantyDisclaimer } from './warrantyUtils';