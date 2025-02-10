import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import querystring from "querystring";

import { db } from "@/db";

// create a function to create order
async function createOrder(data: any) {
  try {
    const orderData = {
      //...data,
      name: data.extraP.metadata.others.s_name,
      orderItems: data.extraP.metadata.item,
      email: data.extraP.metadata.others.email,
      totalAmount: data.amount,
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
  const sec_key = "07c2547513b28bb9a671f5b925653ca9"; // Replace xxxxxxxxxx with Secret_Key

  try {
    let data;
    const contentType = req.headers.get("content-type");

    if (contentType === "application/x-www-form-urlencoded") {
      const text = await req.text();
      data = querystring.parse(text);
    } else {
      data = await req.json();
    }

    //  // Parse extraP if it is a JSON encoded string
    //  if (typeof data.extraP === "string") {
    //   data.extraP = JSON.parse(data.extraP);
    // }

    // // Parse extraP.metadata if it is a JSON encoded string
    // if (typeof data.extraP.metadata === "string") {
    //   data.extraP.metadata = JSON.parse(data.extraP.metadata);
    // }

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
      // if (checkCartAmount(orderid, amount)) {
      //   console.log("Transaction successful yeah woo!!!! i am the best !!");
      // }
      // console.log("data--------------------------->>>>>", data);
      // console.log("extraP--------------------------->>>>>", extraP);

      await createOrder(data);
      console.log("data--------------------------->>>>>", data);
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

// Dummy function to check cart amount
function checkCartAmount(orderid: string, amount: string): boolean {
  // Implement your logic to check the cart amount
  return true;
}

// //https://lonely-food-app.vercel.app/api/fiuu-webhook
