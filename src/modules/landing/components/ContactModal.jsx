import React from 'react'
import { X, Mail, Phone } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Contact Us</h2>
        <p className="text-gray-600 mb-6 text-center">
          We’d love to hear from you. Reach us via:
        </p>

        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Phone className="text-teal-500" />
            <a href="tel:7868244191" className="text-lg text-gray-800 hover:text-teal-600 transition">
              (786) 824-4191
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Mail className="text-teal-500" />
            <a href="mailto:smartsolutionforliving@gmail.com" className="text-lg text-gray-800 hover:text-teal-600 transition">
              smartsolutionforliving@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

