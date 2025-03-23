import axios from "axios";

const PRINTNODE_API_KEY = process.env.NEXT_PUBLIC_PRINTNODE_API_KEY; 

export const printReceipt = async (printerId: number, base64PDF: string) => {
  try {
    const response = await axios.post(
      "https://api.printnode.com/printjobs",
      {
        printerId,
        title: "Order Receipt",
        //contentType: "pdf_base64",
        contentType: "raw_base64",
        content: base64PDF, // Must be a base64-encoded PDF
        source: "Next.js App",
      },
      {
        auth: {
          username: PRINTNODE_API_KEY!,
          password: "", // PrintNode uses basic auth, but only the API key is needed, it stay to satisfy ts
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Printing error:", error);
    throw error;
  }
};

// import { Printer, USB } from 'escpos';

// export const printReceipt = async (printerId: number, receiptContent: string) => {
//   try {
//     // Initialize USB connection to the printer
//     const device = new USB(); // Use the USB adapter provided by escpos
//     const printer = new Printer(device);

//     device.open(() => {
//       printer
//         .text(receiptContent) // Print the receipt content
//         .cut() // Cut the paper
//         .close(); // Close the connection
//     });
//   } catch (error) {
//     console.error("Printing error:", error);
//     throw error;
//   }
// };
