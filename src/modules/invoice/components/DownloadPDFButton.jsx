/**
 * DownloadPDFButton component renders a styled button for downloading a PDF.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} props.onClick - Callback function to handle the button click event.
 * @returns {JSX.Element} A button wrapped in a div, styled for PDF download action.
 */
import Button from '../../../components/ui/Button';

export default function DownloadPDFButton({ onClick }) {
  return (
    <div className="mt-6">
      
      <Button
        onClick={onClick}
        className="px-4 py-2 bg-purple-600
           text-white rounded
            text-sm font-bold 
           hover:bg-purple-800"
      >
        Download PDF
      </Button>
    </div>
    
  );
}
