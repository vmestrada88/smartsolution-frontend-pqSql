// src/components/DiscountForm.jsx
import React, { useState } from 'react';
import Button from '../../../components/ui/Button';

export default function DiscountForm({ onAdd }) {
  const [discount, setDiscount] = useState({ name: '', dCost: '' });

  const handleAdd = () => {
    if (discount.name && discount.dCost) {
      onAdd({ ...discount, dCost: parseFloat(discount.dCost) });
      setDiscount({ name: '', dCost: '' });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Add Discount:</h3>
      <input
        type="text"
        placeholder="Description"
        value={discount.name}
        onChange={(e) => setDiscount({ ...discount, name: e.target.value })}
        className="border p-1 rounded mr-2"
      />
      <input
        type="number"
        placeholder="Amount"
        value={discount.dCost}
        onChange={(e) => setDiscount({ ...discount, dCost: e.target.value })}
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
