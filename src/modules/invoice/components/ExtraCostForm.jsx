// src/components/ExtraCostForm.jsx
import React, { useState } from 'react';
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
