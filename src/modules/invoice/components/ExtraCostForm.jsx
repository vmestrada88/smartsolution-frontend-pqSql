/**
 * ExtraCostForm component allows users to add an extra cost item with a description and amount.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Function} props.onAdd - Callback function called when a new extra cost is added. Receives an object with `name` (string) and `cost` (number).
 *
 * @example
 * <ExtraCostForm onAdd={(extra) => console.log(extra)} />
 *
 * @returns {JSX.Element} The rendered form for adding extra costs.
 */
import  { useState } from 'react';
import Button from '../../../components/ui/Button';

export default function ExtraCostForm({ onAdd }) {
  const [extra, setExtra] = useState({ name: '', cost: '' });

  const handleAdd = () => {
    if (extra.name && extra.cost) {
      onAdd({ ...extra, cost: parseFloat(extra.cost) });
      setExtra({ name: '', cost: '' });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Extra Cost:</h3>
      <input
        type="text"
        placeholder="Description"
        value={extra.name}
        onChange={(e) => setExtra({ ...extra, name: e.target.value })}
        className="border p-1 rounded mr-2"
      />
      <input
        type="number"
        placeholder="Cost"
        value={extra.cost}
        onChange={(e) => setExtra({ ...extra, cost: e.target.value })}
        className="border p-1 rounded mr-2 w-24"
      />
      <Button
        onClick={handleAdd}
      >
        + Add
      </Button>
    </div>
  );
}
