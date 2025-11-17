/**
 * ContactModal component displays a modal dialog with contact information.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 *
 * @returns {JSX.Element|null} The modal element if open, otherwise null.
 *
 * // Import icons from lucide-react for UI elements (close, mail, phone)
 * // Import PropTypes for prop type validation
 * // If the modal is not open, render nothing (null)
 * // Modal overlay: covers the screen with a semi-transparent background
 * // Modal content: centered box with white background and padding
 * // Close button: top-right, calls onClose when clicked
 * // Modal title: "Contact Us", centered and bold
 * // Modal description: short message, centered
 * // Contact options: phone and email, each with icon and clickable link
 * // Phone: tel: link, teal icon, hover effect
 * // Email: mailto: link, teal icon, hover effect
 * // PropTypes: enforce isOpen as boolean and onClose as function
 */
import { X, Mail, Phone } from 'lucide-react';
import PropTypes from 'prop-types';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div data-cy="contact-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            <a href="mailto:sales@smartsolutionfl.com" className="text-lg text-gray-800 hover:text-teal-600 transition">
              sales@smartsolutionfl.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  
}

ContactModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
