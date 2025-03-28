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


// \x1B\x40                # Initialize printer
// \x1B\x61\x01            # Center alignment
// \x1B\x45\x01            # Bold text on
// The Lonely Food Store\n
// \x1B\x45\x00            # Bold text off
// \x1D\x21\x00            # Standard font size
// \x1B\x21\x01            # Small text
// 123 Food Street, Foodtown\n
// Phone: +123 456 7890\n
// ------------------------\n
// \x1D\x21\x00            # Smaller font for details
// \x1B\x61\x00            # Left alignment
// Item         Qty   Price\n
// ------------------------\n
// Burger        2     $10.00\n
// Fries         1      $3.00\n
// Drink         2      $4.00\n
// Salad         1      $5.00\n
// Ice Cream     1      $2.50\n
// ------------------------\n
// Subtotal:            $24.50\n
// Tax (5%):            $1.23\n
// ------------------------\n
// Total:              $25.73\n
// ------------------------\n
// \x1B\x61\x01            # Center alignment
// \x1B\x21\x01            # Smaller text for thank you message
// Thank you for visiting!\n
// \x1B\x21\x00            # Normal text size
// \x1B\x61\x00            # Left alignment
// Date: 2025-03-24   Time: 14:30\n
// Receipt #: 12345678\n
// \x1B\x61\x01            # Center alignment
// \x1B\x69                # Full cut
