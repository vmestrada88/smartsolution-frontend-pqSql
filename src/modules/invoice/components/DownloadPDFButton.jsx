// components/DownloadPDFButton.jsx
import React from 'react';
import Button from '../../../components/ui/Button';

export default function DownloadPDFButton({ onClick }) {
  return (
    <div className="mt-6">
      <button
        onClick={onClick}
        className="px-4 py-2 bg-purple-600
           text-white rounded
            text-sm font-bold 
           hover:bg-purple-800"
        >

        Download PDF
      </button>
    </div>
  );
}
