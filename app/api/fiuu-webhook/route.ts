import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import querystring from "querystring";

export async function POST(req: NextRequest) {
  const sec_key = "428356ca6c81dfbfa2181bcdc1def2f6"; // Replace xxxxxxxxxx with Secret_Key

  try {
    let data;
    const contentType = req.headers.get("content-type");

    if (contentType === "application/x-www-form-urlencoded") {
      const text = await req.text();
      data = querystring.parse(text);
    } else {
      data = await req.json();
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
      ExtraP
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

    //this won't log anything
    console.log(
      "Received data before check status------------------------------------------------>>:",
      data
    );

    // {
    //     nbcb: "2",
    //     tranID: "30937377",
    //     orderid: "DEMO3388",
    //     status: "00",
    //     error_desc: "",
    //     error_code: "",
    //     domain: "SB_pelicanwebdev",
    //     amount: "3.88",
    //     currency: "RM",
    //     appcode: "",
    //     paydate: "2025-01-29 14:28:30",
    //     skey: "cb1658912bc7e18e65791666b7c61f65",
    //     channel: "cimb",
    //     treq: 1,
    //   }
      

    if (status === "00") {
      if (checkCartAmount(orderid, amount)) {
        // Write your script here for successful transaction
        console.log("Transaction successful yeah woo!!!! i am the best !!");
      }
      console.log(
        "Received data status === 00------------------------------------------------>>:",
        data
      );

      console.log("ExtraP------------------------------------------------>>:", ExtraP);
    } else {
      // Failure action
      console.log("Transaction failed");
    }

    // Respond with a success message
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
