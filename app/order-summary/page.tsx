"use client";

import React, { useEffect, useState } from "react";

const OrderSummary: React.FC = () => {
  const [showCartItems, setShowCartItems] = useState<any[]>([]);

  // useEffect(() => {
  //   const sa = "pelicanwebdev_Dev";
  //   const m = document.createElement("IFRAME");
  //   m.setAttribute(
  //     "src",
  //     "https://www.onlinepayment.com.my/MOLPay/API/chkstat/returnipn.php?treq=0&sa=" +
  //       sa
  //   );
  //   m.setAttribute("seamless", "seamless");
  //   m.setAttribute("width", "0");
  //   m.setAttribute("height", "0");
  //   m.setAttribute("frameborder", "0");
  //   m.setAttribute("scrolling", "no");
  //   m.setAttribute("style", "border:none !important;");
  //   document.body.appendChild(m);
  // }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setShowCartItems(items);
    localStorage.setItem("cartItems", "");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <p className="text-gray-700 mb-4">
          Thank you for your purchase! Your payment has been successfully
          processed.
        </p>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold mb-2">Order Details</h3>
          <ul className="list-disc list-inside text-gray-700">
            {showCartItems &&
              showCartItems.map((item, index) => (
                <li key={index}>
                  {item.title} (Qty: {item.qty}): ${item.price}
                </li>
              ))}
          </ul>
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Total: $
            {showCartItems &&
              showCartItems
                .reduce((total, item) => total + item.price, 0)
                .toFixed(2)}
          </h3>
        </div>
        <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Back to home
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;



