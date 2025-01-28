import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = {
    merchant_id: body.merchant_id || "merchantID",
    amount: body.amount || "1.15",
    orderid: body.orderid || "DEMO5179",
    bill_name: body.bill_name || "RMS+Demo",
    bill_email: body.bill_email || "demo@RMS.com",
    bill_mobile: body.bill_mobile || "55218438",
    bill_desc: body.bill_desc || "testing+by+RMS",
    vcode: body.vcode || "a5e2d4ed5e16859a2acfb28c7707f09c",
  };

  const data_parms = JSON.stringify(data);

  console.log(
    "Data Params-------------------------------------------------->: ",
    data_parms
  );

  const url = "https://sandbox.merchant.razer.com/RMS/pay/SB_pelicanwebdev/";

  const formData = new FormData();
  const parsedData = JSON.parse(data_parms);
  for (const key in parsedData) {
    if (parsedData.hasOwnProperty(key)) {
      formData.append(key, parsedData[key]);
    }
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData as any, // Type assertion to avoid TypeScript errors
    });

    const result = await response.text();
    console.log("result------------------------------->", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.error();
  }
}
