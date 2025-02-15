'use client';

import { useEffect, useRef } from 'react';

export default function Orders() {
  const ordersRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let eventSource: EventSource;

    const connectToSSE = () => {
      eventSource = new EventSource('/api/sse');

      eventSource.onmessage = (event) => {
        const newOrder = JSON.parse(event.data);

        // Ignore heartbeat messages
        if (newOrder.type === 'heartbeat') {
          return;
        }

        console.log('New order received:', newOrder);

        if (ordersRef.current) {
          const newOrderElement = document.createElement('li');
          newOrderElement.className = 'border p-2 my-2 rounded bg-yellow-200 flex justify-between items-center';
          newOrderElement.innerHTML = `
            <span class="font-light"><strong>Status:</strong> ${newOrder.message}</span>
            <span class="font-light"><strong>Order ID:</strong> ${newOrder.orderId}</span>
            <span class="font-light"><strong>Total Amount:</strong> ${newOrder.totalAmount}</span>
            <span class="font-light"><strong>Order By:</strong> ${newOrder.name}</span>
          `;
          ordersRef.current.prepend(newOrderElement);

          // Remove the order element after 10 seconds
          setTimeout(() => {
            if (ordersRef.current && ordersRef.current.contains(newOrderElement)) {
              ordersRef.current.removeChild(newOrderElement);
            }
          }, 10000);
        }

        printOrderSlip(newOrder);
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        console.error('EventSource readyState:', eventSource.readyState);
        console.error('EventSource URL:', eventSource.url);
        eventSource.close();

        // Retry connection after 1 second
        setTimeout(() => {
          console.log('Reconnecting to SSE...');
          connectToSSE();
        }, 1000);
      };
    };

    connectToSSE();

    return () => {
      eventSource.close();
    };
  }, []);

  const printOrderSlip = (order: any) => {
    console.log('Printing order:', order);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul ref={ordersRef}>
        {/* Orders will be injected here */}
      </ul>
    </div>
  );
}