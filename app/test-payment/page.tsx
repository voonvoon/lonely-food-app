"use client";

import { useContext } from "react";
import { OrderContext } from "@/context/order";
import {
  createPaymentLinkGet,
  createPaymentLinkPost,
  createPaymentData,
} from "@/actions/fiuu";



const CreatePaymentLinkPage = () => {

  const { cartItems } = useContext(OrderContext);


  const metadata = JSON.stringify([
    { id: "1itemid", amount: "15.00", name: "fish and chips" },
    { id: "2item1id", amount: "20.50", name: "fried" },
    { id: "3item1id", amount: "15.75", name: "ice creame" },
    { id: "4item1id", amount: "30.00", name: "100 plus" },
    { id: "5item1id", amount: "25.25", name: "cake" },
  ]);

  const handleCreatePaymentLink = async () => {
    const data: { [key: string]: string | { [key: string]: string }[] } =
      await createPaymentData();
    // Create a new form element
    const form = document.createElement("form");
    // Set the form's method to POST
    form.method = "POST";
    // Set the form's action to the URL where the POST request should be sent
    // form.action = `https://sandbox.merchant.razer.com/RMS/pay/${data.merchant_id}/`;
    form.action = `https://pay.fiuu.com/RMS/pay/${data.merchant_id}/`;

    // Set the form's target to '_blank' to open the result in a new tab
    form.target = "_blank";

    // Loop through each key in the data object
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Create a hidden input element for each key-value pair
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value =
          typeof data[key] === "string" ? data[key] : JSON.stringify(data[key]);
        // Append the input element to the form
        form.appendChild(input);
      }
    }

    const input2 = document.createElement("input");
    input2.type = "hidden";
    input2.name = "metadata";
    input2.value = metadata;
    form.appendChild(input2);

    // Log the final data to the console
    console.log(
      "Final data--------------------------------------------->:",
      data
    );
    console.log("form----------------------------------------------->:", form);

    // Append the form to the document body, make the form a part of the DOM so can display to user
    document.body.appendChild(form);
    // Submit the form, which sends the POST request and opens the result in a new tab
    form.submit();
    // Remove the form from the document body
    //After form is submitted,no longer needed in DOM. Rm it keep DOM clean & avoids potential conflicts/memory leaks.
    document.body.removeChild(form);
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
        onClick={handleCreatePaymentLink}
        className="px-5 py-2 text-lg cursor-pointer bg-blue-500 text-white border-none rounded"
      >
        Create Payment Link
      </button>

      <button
        onClick={async () => {
          const response = await createPaymentLinkPost(cartItems);
          // const { url, data } = JSON.parse(response);
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
        className="px-5 py-2 text-lg cursor-pointer bg-pink-500 text-white border-none rounded mt-4"
      >
        Create Payment Link (POST)
      </button>
    </div>
  );
};

export default CreatePaymentLinkPage;
