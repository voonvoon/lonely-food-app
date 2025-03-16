import React from "react";

interface Order {
  id: string;
  title: string;
  number: number;
  price: number;
}

interface OrderSummaryModalProps {
  selectedTable:any
  onClose: () => void;
  onConfirm: () => void;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  selectedTable,
  onClose,
  onConfirm,
}) => {
  const totalAmount = selectedTable?.finalOrders.reduce(
    (total: number, order: any) => total + order.price * order.number,
    0
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>

        <div>
          {selectedTable?.finalOrders.map((order: any, index: any) => (
            <div key={index} className="text-sm">
              <table className="table-auto w-full text-left">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Item</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">Price (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={index}>
                    <td className="border px-4 py-2">{order.title}</td>
                    <td className="border px-4 py-2">{order.number}</td>
                    <td className="border px-4 py-2">{order.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
          <div className="font-bold text-xl mt-4">
            Total Amount: RM {totalAmount.toFixed(2)}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="mr-2 p-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;
