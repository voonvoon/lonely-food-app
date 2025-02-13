'use client';

import { useEffect, useState } from 'react';

export default function Orders() {
const [orders, setOrders] = useState<any>({});

  useEffect(() => {
    // Connect to the SSE endpoint
    const eventSource = new EventSource('/api/sse');

    // Listen for new order events
    eventSource.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      console.log('New order received:', newOrder);

      // Update the orders state
      setOrders((prevOrders: any) => [newOrder, ...prevOrders]);

      // Trigger the printer (assuming you have a print function)
      printOrderSlip(newOrder);
    };

     // Handle errors or connection close
     eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      console.error('EventSource readyState:', eventSource.readyState);
      console.error('EventSource URL:', eventSource.url);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Clean up when the component unmounts
    };
  }, []);

  // Your function to send data to the printer
  const printOrderSlip = (order: any) => {
    console.log('Printing order:', order);
    // Here you can call your printer logic, e.g., via a local API or library
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      <ul>
        {/* {orders.map((order) => (
          <li key={order.id} className="border p-2 my-2 rounded bg-gray-100">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Amount:</strong> ${(order.amount / 100).toFixed(2)}</p>
          </li>
        ))} */}
        <pre>{JSON.stringify(orders, null, 2)}</pre>
      </ul>
    </div>
  );
}