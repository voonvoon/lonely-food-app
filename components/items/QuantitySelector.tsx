import React, { useState } from "react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, setQuantity }) => {
  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={decrement}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full"
      >
        -
      </button>
      <span className="text-lg">{quantity}</span>
      <button
        onClick={increment}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
