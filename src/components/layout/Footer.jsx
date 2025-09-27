/**
 * Footer component for displaying copyright information.
 * @module components/layout/Footer
 * @description Renders the application footer with company copyright.
 * @returns {JSX.Element} Footer element.
 */
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center p-4 bg-gray-100 text-sm text-gray-600">
      © {year} Smart Solution for Living LLC. All rights reserved.
    </footer>
  );
};

export default Footer;
