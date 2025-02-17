"use client";

import { useEffect, useRef, useState } from "react";
import { getOrders, deleteOrderById } from "@/actions/order";

export default function Orders() {
  const ordersRef = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);

  console.log("Orders:", orders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const newOrders = await getOrders(page);
        setOrders((prevOrders) => [...prevOrders, ...newOrders]);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [page]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectInterval: NodeJS.Timeout | null = null;

    const connectToSSE = () => {
      if (eventSource) {
        eventSource.close();
      }

      eventSource = new EventSource("/api/sse");

      eventSource.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);

        if (newOrder.type === "heartbeat") {
          return;
        }

        console.log("New order received:", newOrder);

        if (ordersRef.current) {
          const newOrderElement = document.createElement("li");
          newOrderElement.className =
            "p-2 my-2 bg-pink-300 flex justify-between items-center transition-opacity duration-500 ease-in-out opacity-0";
          newOrderElement.innerHTML = `
            <span class="font-light">🔊🔊🔊${newOrder.message}🔊🔊🔊</span>
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
      };

      eventSource.onerror = (err) => {
        console.error("SSE error:", err);
        eventSource?.close();

        setTimeout(() => {
          console.log("Reconnecting to SSE...");
          connectToSSE();
        }, 1000);
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
      setOrders((prevOrders) => prevOrders.filter(order => order.orderid !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const loadMoreOrders = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="p-4 flex justify-center items-center flex-col">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul ref={ordersRef} className="grid grid-cols-4 gap-4">
        {orders.map((order) => (
          <li key={order.orderid} className="p-4 bg-blue-200 rounded-lg shadow-md flex flex-col justify-center items-center">
            <span className="font-light"><strong>Order ID:</strong> {order.orderid}</span>
            <span className="font-light"><strong>Total Amount:</strong> {order.totalAmount}</span>
            <span className="font-light"><strong>Email:</strong> {order.email}</span>
            <span className="font-light"><strong>Phone:</strong> {order.phone}</span>
            <span className="font-light"><strong>Order By:</strong> {order.name}</span>
            <span className="font-light"><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</span>
            <ul className="mt-2">
              {order.orderItems.map((item: { title: string; price: number; number: number }) => (
                <li key={item.title} className="font-light">
                  <strong>Item:</strong> {item.title}, <strong>Price:</strong> {item.price}, <strong>Qty:</strong> {item.number}
                </li>
              ))}
            </ul>
            <button onClick={() => handleDeleteOrder(order.orderid)} className="mt-2 p-2 bg-red-500 text-white rounded">Delete Order</button>
          </li>
        ))}
      </ul>
      <button onClick={loadMoreOrders} className="mt-4 p-2 bg-blue-500 text-white rounded w-full max-w-md mx-auto">Load More</button>
    </div>
  );
}
