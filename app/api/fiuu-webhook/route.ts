import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import querystring from "querystring";
import { printReceipt } from "@/utils/printNode";

import { db } from "@/db";

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

      // Ensure amount is converted to a number
      const amount = parseFloat(data.amount);

      const itemsText = data.extraP.metadata.item
        .map(
          (item: { title: string; number: number; price: number }) =>
            `${item.title.padEnd(12)} ${item.number
              .toString()
              .padStart(3)}   $${item.price.toFixed(2)}`
        )
        .join("\n");

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const formattedTime = currentDate.toTimeString().split(" ")[0]; // Format as HH:MM:SS

      const textToPrint = `
      \x1B\x40                
      \x1B\x61\x01            
      \x1B\x45\x01            
      \x1B\x21\x10            
      The Lonely Food Store
      \x1B\x21\x00            
      \x1B\x45\x00            
      123 Food Street, Foodtown
      Suite 456, Food Plaza
      Phone: +123 456 7890
      Email: contact@lonelyfoodstore.com
      Website: www.lonelyfoodstore.com
      ------------------------
      \x1D\x21\x00           
      \x1B\x61\x01            
      Item         Qty   Price
      ------------------------
      ${itemsText}
      ------------------------
      Subtotal:            $${amount.toFixed(2)}
      Tax (5%):            $${(amount * 0.05).toFixed(2)}
      ------------------------
      Total:              $${(amount * 1.05).toFixed(2)}
      ------------------------
      Thank you for visiting!
      \x1D\x21\x00            
      \x1B\x61\x00           
      Date: ${formattedDate}   Time: ${formattedTime}
      Receipt #: ${data.orderid}
      \x1B\x61\x01            
      \x1B\x69                
      `;
      const base64Text = Buffer.from(textToPrint).toString("base64");

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
