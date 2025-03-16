"use client";

import {
  getAllTableActive,
  getTableOrderById,
  completeOrder,
  summarizeAllOrderAndSave,
  updateFinalOrders,
} from "@/actions/tableOrder";
import { useEffect, useState } from "react";
import EditOrderAfterFinalized from "@/components/EditOrderAfterFinalized";

// Define the expected structure of orderItems
interface OrderItem {
  allOrders: any;
  dineInUser: any;
}

interface Table {
  tableActive: boolean;
  id: string;
  table: number;
  tableId: string;
  checkinId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SelectedTable {
  tableId: string;
  tableNo: number;
  orderItems: OrderItem[];
}

export default function DineIn() {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTableFinalized, setSelectedTableFinalized] =
    useState<any>(null); // after finalized
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  useEffect(() => {
    async function fetchTables() {
      const activeTables = await getAllTableActive();
      setTables(activeTables);
    }

    fetchTables();
  }, [selectedTableFinalized]);

  const handleTableClick = async (tableId: string) => {
    const tableDetails = await getTableOrderById(tableId);

    // Ensure tableDetails matches the SelectedTable type,hence format it here.necessary??? doubt!
    if (tableDetails) {
      const formattedTableDetails: SelectedTable = {
        tableId: tableDetails.tableId,
        tableNo: tableDetails.tableNo,
        orderItems: Array.isArray(tableDetails.orderItems)
          ? tableDetails.orderItems.map((item: any) => ({
              allOrders: item.allOrders,
              dineInUser: item.dineInUser,
            }))
          : [],
      };

      // Array.isArray method is used to check if a given value is an array.
      //if tableDetails.finalOrders is not empty, then it means the order has been finalized so use it.
      if (
        Array.isArray(tableDetails.finalOrders) &&
        tableDetails.finalOrders.length > 0
      ) {
        setSelectedTableFinalized(tableDetails);
      } else {
        reformatAndSaveOrder(formattedTableDetails); // else reformat it and save it to db
      }
    }
  };

  const handleConfirmOrder = async () => {
    if (selectedTableFinalized) {
      try {
        const userConfirmed = window.confirm(
          "Are you sure you want to complete the order?"
        );
        if (userConfirmed) {
          await completeOrder(selectedTableFinalized.tableId);
          alert("Order completed successfully!");
          setIsEditModalOpen(false);
          setSelectedTableFinalized(null);
        }
      } catch (error) {
        console.error("Failed to complete order:", error);
        alert("Failed to complete order. Please try again.");
      }
    }
  };

  function calculateTotalAmount(order: any): number {
    return order.finalOrders.reduce(
      (total: number, order: any) => total + order.price * order.number,
      0
    );
  }

  //when click complete order: reformat it by join it/ + qty(if same id) and save to db
  async function reformatAndSaveOrder(selectedTable: SelectedTable) {
    const mergedOrders: { [key: string]: any } = {};

    selectedTable.orderItems.forEach((item) => {
      item.allOrders.forEach((order: any) => {
        if (mergedOrders[order.id]) {
          mergedOrders[order.id].number += order.number;
        } else {
          mergedOrders[order.id] = { ...order };
        }
      });
    });

    //example of mergedOrders(after 2 iterations):
    // {
    //   "1": { "id": "1", "title": "Pizza", "number": 3, "price": 10 },
    //   "2": { "id": "2", "title": "Burger", "number": 1, "price": 5 },
    //   "3": { "id": "3", "title": "Pasta", "number": 1, "price": 7 }
    // }

    // Convert mergedOrders object to an array of order objects
    const finalOrders = Object.values(mergedOrders);

    //example of finalOrders:
    // [
    //   { "id": "1", "title": "Pizza", "number": 3, "price": 10 },
    //   { "id": "2", "title": "Burger", "number": 1, "price": 5 },
    //   { "id": "3", "title": "Pasta", "number": 1, "price": 7 }
    // ]

    const totalAmount = finalOrders.reduce(
      (total, order) => total + order.number * order.price,
      0
    );

    try {
      const updatedTable: any = await summarizeAllOrderAndSave(
        selectedTable.tableId,
        finalOrders,
        totalAmount
      );

      setSelectedTableFinalized(updatedTable);
    } catch (error) {
      console.error("Failed to save summarized order:", error);
      alert("Failed to save summarized order. Please try again.");
    }
  }



  return (
    <div className="flex justify-center flex-col ">
      <h1 className="text-2xl font-bold mb-4 text-center">Dine In Tables</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table.id)}
            className={`w-24 h-24 flex items-center justify-center rounded-full ${
              table.tableActive ? "bg-green-500" : "bg-red-500"
            } text-white text-xl font-bold cursor-pointer`}
          >
            {table.table}
          </div>
        ))}
      </div>

      {selectedTableFinalized && (
        <div className="mt-4 p-4 border rounded shadow flex justify-center items-center flex-col">
          <h2 className="text-xl font-bold mb-2">Finalized Order Details</h2>

          <div>
            <p className="font-bold text-2xl mt-2 text-red-600 text-center">
              Total Amount: RM{" "}
              {calculateTotalAmount(selectedTableFinalized).toFixed(2)}
            </p>
            <h3 className="text-lg font-semibold mb-2">Order Items:</h3>
            {selectedTableFinalized.finalOrders.length > 0 ? (
              <div className="list-disc pl-5 p-4">
                <table className="table-auto w-full text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Item</th>
                      <th className="px-4 py-2">Qty</th>
                      <th className="px-4 py-2">Price (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTableFinalized.finalOrders.map(
                      (order: any, orderIndex: number) => (
                        <tr key={orderIndex}>
                          <td className="border px-4 py-2">{order.title}</td>
                          <td className="border px-4 py-2">{order.number}</td>
                          <td className="border px-4 py-2">{order.price}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleConfirmOrder}
                    className="p-4 bg-red-500 text-white rounded m-1"
                  >
                    Confirm Payment
                  </button>

                  {selectedTableFinalized && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-4 bg-blue-500 text-white rounded m-1"
                    >
                      Edit Order
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm">No order items available.</p>
            )}
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <EditOrderAfterFinalized
          selectedTable={selectedTableFinalized}
          onClose={() => setIsEditModalOpen(false)}
          updateFinalOrders={updateFinalOrders}
        />
      )}
    </div>
  );
}
