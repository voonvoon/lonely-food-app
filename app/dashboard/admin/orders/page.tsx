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
            newOrderElement.className = 'border p-2 my-2 rounded bg-pink-200 flex justify-between items-center transition-opacity duration-500 ease-in-out opacity-0';
            newOrderElement.innerHTML = `
            <span class="font-light"><strong>Status:</strong> ${newOrder.message} 🔊🔊🔊</span>
            <span class="font-light"><strong>Order ID:</strong> ${newOrder.orderId}</span>
            <span class="font-light"><strong>Total Amount:</strong> ${newOrder.totalAmount}</span>
            <span class="font-light"><strong>Order By:</strong> ${newOrder.name}</span>
            `;
            ordersRef.current.prepend(newOrderElement);

            // Fade in the new order element
            requestAnimationFrame(() => {
            newOrderElement.classList.remove('opacity-0');
            newOrderElement.classList.add('opacity-100');
            });

            // Remove the order element after 15 seconds with fade out
            setTimeout(() => {
            if (ordersRef.current && ordersRef.current.contains(newOrderElement)) {
              newOrderElement.classList.remove('opacity-100');
              newOrderElement.classList.add('opacity-0');
              //remove the element after the fade-out transition
              setTimeout(() => {
              if (ordersRef.current && ordersRef.current.contains(newOrderElement)) {
                ordersRef.current.removeChild(newOrderElement);
              }
              }, 500); // Match the duration of the fade-out transition
            }
            }, 15000);

          // // Remove the order element after 15 seconds
          // setTimeout(() => {
          //   if (ordersRef.current && ordersRef.current.contains(newOrderElement)) {
          //     ordersRef.current.removeChild(newOrderElement);
          //   }
          // }, 15000);
        }

        printOrderSlip(newOrder);
      };

      eventSource.onerror = (err) => {
        // Only log the error if it's not related to the connection being closed due to the timeout
        // else err show every 60 sec due to timeout(max 60 sec) in vercel
        if (eventSource.readyState !== EventSource.CLOSED) {
          console.error('SSE error:', err);
        }
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
      <ul ref={ordersRef}>
        {/* Orders will be injected here */}
      </ul>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      
    </div>
  );
}