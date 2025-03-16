import React, { useState } from "react";

interface OrderSummaryModalProps {
  selectedTable: any;
  onClose: () => void;

  updateFinalOrders: (
    orderId: string,
    updatedFinalOrders: {
      id: string;
      title: string;
      price: number;
      number: number;
    }[]
  ) => Promise<{ success: boolean; message: string }>;
}

const EditOrderAfterFinalized: React.FC<OrderSummaryModalProps> = ({
  selectedTable,
  onClose,

  updateFinalOrders,
}) => {
  const [orders, setOrders] = useState(selectedTable.finalOrders);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedOrders = [...orders];
    updatedOrders[index] = { ...updatedOrders[index], [field]: value };
    setOrders(updatedOrders);
  };

  const handleAddNewItem = () => {
    setOrders([...orders, { id: "", title: "", price: 0, number: 0 }]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedOrders = orders.filter((_: any, i: number) => i !== index);
    setOrders(updatedOrders);
  };

  const handleUpdate = async () => {
    try {
      const response = await updateFinalOrders(selectedTable.id, orders);
      if (response.success) {
        onClose();
        window.location.reload();
      } else {
        alert("Failed to update order. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order. Please try again.");
    }
  };

  const totalAmount = orders.reduce(
    (total: number, order: any) => total + order.price * order.number,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Order Edit</h2>

        <div>
          {orders.map((order: any, index: any) => (
            <div key={index} className="flex text-sm mb-2">
              <div className="flex items-center mb-2">
                <label className="w-24">Item:</label>
                <input
                  type="text"
                  value={order.title}
                  onChange={(e) =>
                    handleInputChange(index, "title", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div className="flex items-center mb-2">
                <label className="w-24">Qty:</label>
                <input
                  type="number"
                  value={order.number || ""}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "number",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div className="flex items-center mb-2">
                <label className="w-24">Price (RM):</label>
                <input
                  type="number"
                  value={order.price || ""}
                  onChange={(e) =>
                    handleInputChange(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border px-2 py-1 rounded w-full"
                />
              </div>
              <div className="flex items-center mb-2">
                <button
                  onClick={() => handleDeleteItem(index)}
                  className="text-red-500 text-xs m-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddNewItem}
              className="text-blue-500 underline"
            >
              Add New Item
            </button>
          </div>
          <div className="font-bold text-xl mt-4">
            Total Amount: RM {totalAmount.toFixed(2)}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="mr-2 p-2 bg-gray-500 text-white rounded m-1"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="p-2 bg-blue-500 text-white rounded m-1"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrderAfterFinalized;
