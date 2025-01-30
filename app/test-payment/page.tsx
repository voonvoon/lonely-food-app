"use client";

// import { useState } from "react";
 import { createPaymentLinkGet, createPaymentLinkPost,createPaymentData } from "@/actions/fiuu"; 

// const CreatePaymentLinkPage = () => { 
//   const handleCreatePaymentLink = async () => {
//     const data = await createPaymentLinkGet();
//     if (data) {
//       window.open(data, "_blank");
//     }

//     console.log("see what inside here--------------->", data);

//     // Open the Blob URL in a new tab

//     // const parsedData = JSON.parse(data);
//     // setResult(parsedData);
//     // if (parsedData.pymt_link) {
//     //     window.location.href = parsedData.pymt_link;
//     // }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen p-5 box-border overflow-y-auto">
//       <button
//         onClick={handleCreatePaymentLink}
//         className="px-5 py-2 text-lg cursor-pointer bg-blue-500 text-white border-none rounded max-w-full w-72"
//       >
//         Create Payment Link
//       </button>
//     </div>
//   );
// };

// export default CreatePaymentLinkPage;




const CreatePaymentLinkPage = () => {

  const metadata = JSON.stringify([
    { id: "1itemid", amount: "10.00", name: "fish and chips" },
    { id: "2item1id", amount: "20.50", name: "fried" },
    { id: "3item1id", amount: "15.75", name: "ice creame" },
    { id: "4item1id", amount: "30.00", name: "100 plus" },
    { id: "5item1id", amount: "25.25", name: "cake" }
  ])

  // const handleCreatePaymentLink = async () => {
  //   const data: { [key: string]: string | { [key: string]: string }[] } = await createPaymentData();
  //   // Create a new form element
  //   const form = document.createElement('form');
  //   // Set the form's method to POST
  //   form.method = 'POST';
  //   // Set the form's action to the URL where the POST request should be sent
  //   form.action = `https://sandbox.merchant.razer.com/RMS/pay/${data.merchant_id}/`;
  //   // Set the form's target to '_blank' to open the result in a new tab
  //   form.target = '_blank';

  //   // Loop through each key in the data object
  //   for (const key in data) {
  //     if (data.hasOwnProperty(key)) {
  //     // Create a hidden input element for each key-value pair
  //     const input = document.createElement('input');
  //     input.type = 'hidden';
  //     input.name = key;
  //     input.value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
  //     // Append the input element to the form
  //     form.appendChild(input);
  //     }
  //   }

  //   // Log the final data to the console
  //   console.log('Final data--------------------------------------------->:', data);

  //   // Append the form to the document body, make the form a part of the DOM so can display to user
  //   document.body.appendChild(form);
  //   // Submit the form, which sends the POST request and opens the result in a new tab
  //   form.submit();
  //   // Remove the form from the document body
  //   //After form is submitted,no longer needed in DOM. Rm it keep DOM clean & avoids potential conflicts/memory leaks.
  //   document.body.removeChild(form);
  // };


    const handleCreatePaymentLink = async () => {
      const data: { [key: string]: string | { [key: string]: string }[] } = await createPaymentData();
      // Create a new form element
      const form = document.createElement('form');
      // Set the form's method to POST
      form.method = 'POST';
      // Set the form's action to the URL where the POST request should be sent
      form.action = `https://sandbox.merchant.razer.com/RMS/pay/${data.merchant_id}/`;
      // Set the form's target to '_blank' to open the result in a new tab
      form.target = '_blank';
  
      // Loop through each key in the data object
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          // Create a hidden input element for each key-value pair
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
          // Append the input element to the form
          form.appendChild(input);
        }
      }
  
      // Create a hidden input element for the metadata JSON string
      const metadataInput = document.createElement('input');
      metadataInput.type = 'hidden';
      metadataInput.name = 'metadata';
      metadataInput.value = metadata;
  
      // Append the metadata input element to the form
      form.appendChild(metadataInput);
  
      // Log the final data to the console
      console.log('Final data--------------------------------------------->:', data);
      console.log('metadataInput----------------------------------------------->:', metadataInput);
      console.log('form----------------------------------------------->:', form);
      // Append the form to the document body, make the form a part of the DOM so can display to user
      document.body.appendChild(form);
      // Submit the form, which sends the POST request and opens the result in a new tab
      form.submit();
    };

  
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button
      onClick={handleCreatePaymentLink}
      className="px-5 py-2 text-lg cursor-pointer bg-blue-500 text-white border-none rounded"
      >
      Create Payment Link
      </button>
    </div>
  );
};

export default CreatePaymentLinkPage;