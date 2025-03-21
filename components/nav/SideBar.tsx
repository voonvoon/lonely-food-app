import React, { useEffect, useContext } from "react";
import { OrderContext } from "@/context/order";
import { createPaymentLinkPost } from "@/actions/fiuu";
import { createOrderForTable } from "@/actions/tableOrder";
import Cookies from "js-cookie";

const Sidebar: React.FC = () => {
  const { cartItems, setCartItems, isSidebarOpen, setIsSidebarOpen } =
    useContext(OrderContext);

  const dineInUser = Cookies.get("dineInUser");
  const tableNo = Cookies.get("tableNo");
  const cardNo = Cookies.get("cardNo");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      const sidebarElement = document.getElementById("sidebar");
      if (sidebarElement && !sidebarElement.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsSidebarOpen]);

  return (
    <div
      id="sidebar"
      className={`fixed top-0 right-0 h-full p-8 bg-white shadow-lg transform ${
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <button
        className="absolute top-4 right-4 text-gray-600"
        onClick={() => setIsSidebarOpen(false)}
      >
        Close
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold p-1">
          Items Added {dineInUser ? `|Table: ${tableNo}` : ""}
        </h2>
        {dineInUser && (
          <small className="text-gray-500">Dine-In ID: {dineInUser}</small>
        )}
        {cardNo && <small className="text-gray-500">Card No: {cardNo}</small>}
      </div>
      <ul className="p-4">
        {cartItems.map((item: any) => (
          <li
            key={item.id}
            className="border-b py-2 flex flex-col items-center justify-center"
          >
            <div className="flex  items-center mb-1">
              <span className="p-1 font-light ">{item.title}</span>
              <span className="p-1">
                ${item.price} x {item.number}
              </span>
            </div>
            <div className="flex items-center">
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => {
                  const updatedCartItems = cartItems
                    .map((cartItem: any) =>
                      cartItem.id === item.id
                        ? { ...cartItem, number: cartItem.number - 1 }
                        : cartItem
                    )
                    .filter((cartItem: any) => cartItem.number > 0); // remove item if number is 0
                  setCartItems(updatedCartItems);
                  localStorage.setItem(
                    "cartItems",
                    JSON.stringify(updatedCartItems)
                  );
                }}
              >
                -
              </button>
              <span className="px-2">{item.number}</span>
              <button
                className="px-2 py-1 bg-gray-200 rounded"
                onClick={() => {
                  const updatedCartItems = cartItems.map((cartItem: any) =>
                    cartItem.id === item.id
                      ? { ...cartItem, number: cartItem.number + 1 }
                      : cartItem
                  );
                  setCartItems(updatedCartItems);
                  localStorage.setItem(
                    "cartItems",
                    JSON.stringify(updatedCartItems)
                  );
                }}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 border-t">
        <h3 className="text-lg font-semibold">Total Amount</h3>
        <p className="text-xl">
          $
          {cartItems
            .reduce(
              (total: number, item: { price: number; number: number }) =>
                total + item.price * item.number,
              0
            )
            .toFixed(2)}
        </p>
      </div>

      {dineInUser && tableNo && cardNo ? (
        <button
          onClick={async () => {
            const handlePlaceOrder = async () => {
              try {
                await createOrderForTable(
                  cartItems,
                  cardNo,
                  Number(tableNo),
                  dineInUser
                );
                alert("Order placed successfully!");
                setCartItems([]);
                localStorage.removeItem("cartItems");
              } catch (error) {
                console.error("Error placing order:", error);
                alert("Failed to place order. Please try again.");
              }
            };

            handlePlaceOrder();
          }}
          className="w-full px-5 py-2 text-lg cursor-pointer bg-green-500 text-white border-none rounded mt-4"
        >
          Place Order (For Dine-In)
        </button>
      ) : (
        <button
          onClick={async () => {
            const response = await createPaymentLinkPost(cartItems);

            const { url, data } = response;

            // Create a new form element
            const form = document.createElement("form");
            console.log(
              "form ----------------------------------------------->:",
              form
            );
            // Set the form's method to POST
            form.method = "POST";
            // Set the form's action to the URL where the POST request should be sent
            form.action = url;
            // Set the form's target to '_blank' to open the result in a new tab
            form.target = "_blank";

            // Loop through each key in the data object
            for (const key in data) {
              if (data.hasOwnProperty(key)) {
                // Create a hidden input element for each key-value pair
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = data[key];
                // Append the input element to the form
                form.appendChild(input);
              }
            }

            // Append the form to the document body
            document.body.appendChild(form);
            // Submit the form, which sends the POST request and opens the result in a new tab
            form.submit();
            // Remove the form from the document body
            document.body.removeChild(form);
          }}
          className="w-full px-5 py-2 text-lg cursor-pointer bg-pink-500 text-white border-none rounded mt-4"
        >
          Make Payment
        </button>
      )}
    </div>
  );
};

export default Sidebar;
