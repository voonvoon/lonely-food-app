"use client";

import { useEffect, useRef, useState } from "react";
import { getOrders, deleteOrderById } from "@/actions/order";

export default function Orders() {
  const ordersRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false); // State for connection status

  const fetchOrders = async (page: number) => {
    try {
      const newOrders = await getOrders(page);
      setOrders((prevOrders) =>
        page === 1 ? newOrders : [...prevOrders, ...newOrders]
      );
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectInterval: NodeJS.Timeout | null = null;
    let reconnectAttempts = 0;

    const connectToSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource("/api/sse");

      eventSource.onopen = () => {
        setIsConnected(true); // Set connection status to true when connected
      };

      eventSource.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);

        if (newOrder.type === "heartbeat") {
          return;
        }

        console.log("New order received:", newOrder);

        if (ordersRef.current) {
          const newOrderElement = document.createElement("li");
          newOrderElement.className =
            "p-2 my-2 flex justify-between items-center transition-opacity duration-500 ease-in-out opacity-0";
          newOrderElement.innerHTML = `
            <span class="font-light">${newOrder.message}🔊🔊🔊</span>
            <span class="font-light"><strong>Order ID:</strong> ${newOrder.orderId}</span>
            <span class="font-light"><strong>Total Amount:</strong> ${newOrder.totalAmount}</span>
            <span class="font-light"><strong>Order By:</strong> ${newOrder.name}</span>
            `;
          ordersRef.current.prepend(newOrderElement);

          requestAnimationFrame(() => {
            newOrderElement.classList.remove("opacity-0");
            newOrderElement.classList.add("opacity-100");
          });

          setTimeout(() => {
            if (
              ordersRef.current &&
              ordersRef.current.contains(newOrderElement)
            ) {
              newOrderElement.classList.remove("opacity-100");
              newOrderElement.classList.add("opacity-0");
              setTimeout(() => {
                if (
                  ordersRef.current &&
                  ordersRef.current.contains(newOrderElement)
                ) {
                  ordersRef.current.removeChild(newOrderElement);
                }
              }, 500);
            }
          }, 15000);
        }

        printOrderSlip(newOrder);

        // Re-fetch orders for the first page when new order is received
        setPage(1);
        fetchOrders(1); // put 1 cuz can't rely on setPage to finish updating the state
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource?.close();
        setIsConnected(false); // Set connection status to false when an error occurs

        // The exponential backoff strategy ++ delay between reconnection attempts.
        // starting from 1 sec and doubling each time up to a max of 30 sec to avoid overwhelming the server with frequent requests.
        reconnectAttempts += 1;
        const reconnectDelay = Math.min(1000 * reconnectAttempts, 30000); // Exponential backoff with a max delay of 30 seconds
        console.log("reconnectAttempts:", reconnectAttempts);
        console.log("reconnectDelay:", reconnectDelay);

        setTimeout(() => {
          console.log("Reconnecting to SSE...");
          connectToSSE();
        }, reconnectDelay);
      };

      if (!reconnectInterval) {
        reconnectInterval = setInterval(() => {
          console.log("Proactively reconnecting to SSE...");
          if (eventSource) {
            eventSource.close();
          }
          connectToSSE();
        }, 55000);
      }
    };

    connectToSSE();

    return () => {
      eventSource?.close();
      if (reconnectInterval) {
        clearInterval(reconnectInterval);
      }
    };
  }, []);

  const printOrderSlip = (order: any) => {
    console.log("Printing order:", order);
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderById(orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderid !== orderId)
      );
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const loadMoreOrders = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="p-4 flex justify-center items-center flex-col">
      <span
        ref={ordersRef}
        className="flex justify-center items-center bg-blue-500 text-white rounded p-2"
      ></span>
      <div
        className={`mb-2 p-1 rounded ${
          isConnected ? "bg-green-500" : "bg-red-500"
        } text-white`}
      >
        {isConnected ? "live" : "offline"}
      </div>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 text-left">Order ID</th>
            <th className="py-2 text-left">Total Amount</th>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-left">Phone</th>
            <th className="py-2 text-left">Order By</th>
            <th className="py-2 text-left">Date</th>
            <th className="py-2 text-left">Items</th>
            <th className="py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderid} className="border-t">
              <td className="py-2 ">{order.orderid}</td>
              <td className="py-2">{order.totalAmount}</td>
              <td className="py-2">{order.email}</td>
              <td className="py-2">{order.phone}</td>
              <td className="py-2">{order.name}</td>
              <td className="py-2">
                {new Date(order.createdAt).toLocaleString()}
              </td>
              <td className="py-2">
                <ul>
                  {order.orderItems.map(
                    (item: {
                      title: string;
                      price: number;
                      number: number;
                    }) => (
                      <li key={item.title} className="flex justify-between">
                        <span>
                          <strong>Item:</strong> {item.title}
                        </span>
                        <span>
                          <strong>Price:</strong> {item.price}
                        </span>
                        <span>
                          <strong>Qty:</strong> {item.number}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleDeleteOrder(order.orderid)}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={loadMoreOrders}
        className="mt-4 p-2 bg-blue-500 text-white rounded w-full max-w-md mx-auto"
      >
        Load More
      </button>
    </div>
  );
}
