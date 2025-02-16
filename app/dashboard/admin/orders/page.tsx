"use client";

import { useEffect, useRef } from "react";

export default function Orders() {
  const ordersRef = useRef<HTMLUListElement>(null);

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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul ref={ordersRef}>{/* Orders will be injected here */}</ul>
    </div>
  );
}
