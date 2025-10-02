/**
 * Labor cost calculation utility.
 * 
 * @module util/LaborCost
 * @description Calculates labor cost based on product category.
 * @param {string} category - The product category (e.g., 'IP Camera', 'NVR', etc.)
 * @returns {number} The labor cost in USD for the specified category.
 */
export default function getLaborCost(category) {
  switch (category) {
  case 'IP Camera':
    return 120;
  case 'Coaxial Camera':
    return 150;
  case 'NVR':
    return 60;
  case 'DVR':
    return 90;
  case 'Hard Drive':
    return 0;
  default:
    return 0;
  }
}
// This function can be imported and used in other components to get the labor cost based on the product category.