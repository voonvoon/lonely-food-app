import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import querystring from "querystring";
import { printReceipt } from "@/utils/printNode";
import iconv from "iconv-lite"; // For encoding text in GB2312(Chinese) format. use it with  \x1B\x52\x15 command

import { db } from "@/db";
import stringWidth from "string-width"; //accurately calculates the visual width of a string
import QRCode from "qrcode";
// create a function to create order
async function createOrder(data: any) {
  try {
    const orderData = {
      name: data.extraP.metadata.others.s_name,
      orderItems: data.extraP.metadata.item,
      email: data.extraP.metadata.others.email,
      totalAmount: parseFloat(data.amount),
      phone: data.extraP.metadata.others.phone,
      tranID: data.tranID,
      orderid: data.orderid,
    };

    const order = await db.order.create({
      data: orderData,
    });

    // Order created successfully, no need to return anything
  } catch (error) {
    console.error("Error creating order:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  const sec_key = process.env.FIUU_SECRET_KEY;

  try {
    let data;
    const contentType = req.headers.get("content-type");

    if (contentType === "application/x-www-form-urlencoded") {
      const text = await req.text();
      data = querystring.parse(text); //for parsing URL query strings.
    } else {
      data = await req.json();
    }

    //// Parse extraP if it is a JSON encoded string by payment gateway so parse it here ///
    ///  metadatd also being passed as JSON string, so need to parse again in order to use here as jvs obj ///
    if (typeof data.extraP === "string") {
      data.extraP = JSON.parse(data.extraP);
    }
    // Parse extraP.metadata if it is a JSON encoded string
    // i guess because when i pass metadata as JSON string, so this need parse again.
    if (typeof data.extraP.metadata === "string") {
      data.extraP.metadata = JSON.parse(data.extraP.metadata);
    }

    data.treq = 1; // Additional parameter for IPN. Value always set to 1.

    let {
      nbcb,
      tranID,
      orderid,
      status,
      domain,
      amount,
      currency,
      appcode,
      paydate,
      skey,
      extraP,
    } = data;

    // Verify the data integrity
    const key0 = CryptoJS.MD5(
      tranID + orderid + status + domain + amount + currency
    ).toString();
    const key1 = CryptoJS.MD5(
      paydate + domain + key0 + appcode + sec_key
    ).toString();

    if (skey !== key1) {
      status = "-1"; // Invalid transaction
    }

    if (status === "00") {
      await createOrder(data);
      //console.log("data--------------------------->>>>>", data);
      console.log("extraP--------------------------->>>>>", extraP);

      // Generate QR code for www.google.com
      const qrCodeText = "www.google.com";
      const qrCodeBitmap = await QRCode.toString(qrCodeText, {
        type: "terminal", // Generates a text-based QR code for testing
      });

      const qrCodeCommand = `
      \x1B\x61\x01
      QR Code:
      ${qrCodeBitmap}
      `;

      // Ensure amount is converted to a number
      const amount = parseFloat(data.amount);
      const itemsText = [
        `\x1B\x61\x00Item         Qty Price(RM)`, // Header row
        `\x1B\x61\x01------------------------`, // Separator line
        ...data.extraP.metadata.item.map(
          (item: { title: string; number: number; price: number }) => {
            const titleWidth = 20; // Desired width for the title column
            const qtyWidth = 2; // Width for the quantity column
            const priceWidth = 6; // Width for the price column

            //accurately calculates the visual width of a string cuz chinese character has different width
            const actualTitleWidth = stringWidth(item.title);

            // Adjust padding dynamically based on the actual width
            const title =
              actualTitleWidth > titleWidth
                ? item.title.substring(0, titleWidth - 1) + "" // Truncate if too long
                : item.title + " ".repeat(titleWidth - actualTitleWidth); // Pad with spaces

            // Format quantity and price with fixed widths
            const qty = `${item.number}`.padStart(qtyWidth);
            const price = `${item.price.toFixed(2)}`.padStart(priceWidth);

            // Combine columns into a single row
            return `\x1B\x61\x01${title}${qty}${price}`;
          }
        ),
      ].join("\n"); // Add a newline after each row

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(" ")[0]; // Format as HH:MM:SS

      const textToPrint = `
      \x1B\x40
      \x1B\x52\x15               
      \x1B\x61\x01           
      \x1B\x45\x01                      
      The Lonely Food Store          
      \x1B\x45\x00            
      \x1D\x21\x00            
      123 Food Street, Foodtown
      Suite 456, Food Plaza
      \x1B\x4D\x01
      Phone: +123 456 7890
      Email:contact@lonelyfoodstore.com
      Website:www.lonelyfoodstore.com
      测试中文打印
      \x1B\x4D\x00
      ------------------------  
      \x1B\x21\x10           
      Name: ${data.extraP.metadata.others.s_name}
      Email: ${data.extraP.metadata.others.email}
      \x1B\x21\x00            
      ------------------------           
      ${itemsText}
      ------------------------
      Subtotal:          RM${amount.toFixed(2)}
      Tax (5%):          RM${(amount * 0.05).toFixed(2)}
      ------------------------
      Total:            RM${(amount * 1.05).toFixed(2)}
      ------------------------
      \x1D\x21\x00            
      \x1B\x61\x01            
      Date: ${formattedDate}   
      Time: ${formattedTime}
      Receipt #:
      ${data.orderid}
      ------------------------
  QR Code Test:
  ${qrCodeCommand}
  ------------------------
      Thank you for visiting!
      \x1B\x61\x01            
      \x1B\x69                
      `;

      //const base64Text = Buffer.from(textToPrint).toString("base64");
      //const base64Text = Buffer.from(textToPrint, "utf8").toString("base64"); //use utf8 so can interpret in chinese character

      // Encode the text in GB2312
      //both english and chinese character can be printed
      const gb2312Buffer = iconv.encode(textToPrint, "gb2312"); // Encode the text in GB2312
      const base64Text = gb2312Buffer.toString("base64"); // Convert the encoded text to base64
      // Test the print function with a dummy printer ID (replace with actual printer ID in production)
      const printerId = 74207414; // Replace with your actual printer ID
      try {
        await printReceipt(printerId, base64Text);
        console.log("Print job sent successfully!");
      } catch (error) {
        console.error("Error sending print job:", error);
      }
    } else {
      console.log("Transaction failed");
    }

    return NextResponse.json(
      { message: "Payment status received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing payment status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
