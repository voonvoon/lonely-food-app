 "use client";
import Link from "next/link";

import React, { useEffect, useState } from "react";

const OrderSummary: React.FC = () => {
  const [showCartItems, setShowCartItems] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setShowCartItems(items);
    setTimeout(() => {
      localStorage.setItem("cartItems", "");
    }, 100); // Delay to allow state update
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
        <Link href="/">
          <div className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center">
            Back to home
          </div>
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;


// "use client";
// import Link from "next/link";
// import React, { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";

// const OrderSummaryContent: React.FC = () => {
//   const [showCartItems, setShowCartItems] = useState<any[]>([]);
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     // Retrieve the data parameter from the URL
//     const data = searchParams.get("data");

//     if (data) {
//       // Decode and parse the data parameter
//       const parsedData = JSON.parse(decodeURIComponent(data));
//       console.log(
//         "Received data frontend----------------------->>>:",
//         parsedData
//       );
//     }

//     const items = JSON.parse(localStorage.getItem("cartItems") || "[]");
//     setShowCartItems(items);
//     localStorage.setItem("cartItems", "");
//   }, [searchParams]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
//         <p className="text-gray-700 mb-4">
//           Thank you for your purchase! Your payment has been successfully
//           processed.
//         </p>
//         <div className="border-t border-gray-200 pt-4">
//           <h3 className="text-lg font-semibold mb-2">Order Details</h3>
//           <ul className="list-disc list-inside text-gray-700">
//             {showCartItems &&
//               showCartItems.map((item, index) => (
//                 <li key={index}>
//                   {item.title} (Qty: {item.qty}): ${item.price}
//                 </li>
//               ))}
//           </ul>
//         </div>
//         <div className="border-t border-gray-200 pt-4 mt-4">
//           <h3 className="text-lg font-semibold mb-2">
//             Total: $
//             {showCartItems &&
//               showCartItems
//                 .reduce((total, item) => total + item.price, 0)
//                 .toFixed(2)}
//           </h3>
//         </div>
//         <Link href="/">
//           <div className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-center">
//             Back to home
//           </div>
//         </Link>
//       </div>
//     </div>
//   );
// };

// const OrderSummary: React.FC = () => {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <OrderSummaryContent />
//     </Suspense>
//   );
// };

// export default OrderSummary;

