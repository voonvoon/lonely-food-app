"use server";

//checksum is a value used to verify the integrity of a file or a data transfer.

import CryptoJS from "crypto-js";

const merchantID = process.env.FIUU_MERCHANT_ID || "defaultMerchantID";
const vkey = process.env.FIUU_VERIFY_KEY || "defaultVkey";

const getMD5HashData = (data: string) => {
  return CryptoJS.MD5(data).toString();
};

export const createPaymentLinkGet = async (): Promise<string> => {
  const data = {
    merchant_id: merchantID,
    amount: "4.35",
    orderid: "DEMO5123",
    bill_name: "peter wong",
    bill_email: "wonghv@gmail.com",
    bill_mobile: "+0166307168",
    bill_desc: "test webhook!",
  };

  const queryString = new URLSearchParams(data).toString();
  console.log(
    "queryString---------------------------------------->",
    queryString
  );

  const vcode = getMD5HashData(
    `${data.amount}${merchantID}${data.orderid}${vkey}`
  );

  //const url = `https://sandbox.merchant.razer.com/RMS/pay/${merchantID}/?merchant_id=${merchantID}&amount=${data.amount}&orderid=${data.orderid}&vcode=${vcode}`
  const url = `https://sandbox.merchant.razer.com/RMS/pay/${merchantID}/?${queryString}&vcode=${vcode}`;

  console.log("URL---------------------------------------->", url);
  return url;
};

//below is testing code for post method
export const createPaymentLinkPost = async (items: any): Promise<{ url: string; data: any; }> => {
  const totalAmount = items
    .reduce((total: number, item: any) => {
      return total + parseFloat(item.price) * item.number;
    }, 0)
    .toFixed(2);


    const generateRandomOrderId = (): string => {
      const now = new Date();
      const dateString = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14); // Remove unwanted characters and limit to 14 characters
      const uniqueSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Ensure uniqueness with exactly 4 digits
      const orderId = `oi${dateString}${uniqueSuffix}`;
      console.log("Generated Order ID:", orderId, "Length:", orderId.length);
    
      return orderId;
    };

    let orderId = generateRandomOrderId();


 //merchant allow pass metadata as JSON string only
  const metadata = JSON.stringify({
    item: items,
    // item: [
    //   { id: "1itemid", amount: "15.00", name: "fish and chips" },
    //   { id: "2item1id", amount: "20.50", name: "fried" },
    //   { id: "3item1id", amount: "15.75", name: "ice cream" },
    //   { id: "4item1id", amount: "30.00", name: "100 plus" },
    //   { id: "5item1id", amount: "25.25", name: "cake" },
    // ],
    others: {
      phone: "016-6307168",
      email:"wonghv@gmail.com",
      b_addr1: "A-16-13a, menara prima avenue",
      b_addr2: "jln 123",
      b_zipcode: "12345",
      b_city: "KL",
      b_state: "Selangor",
      country: "MY",
      s_name: "peter zai",
      s_addr1: "jln success 123",
    },
  });

  

  const data = {
    merchant_id: merchantID,
    amount: totalAmount,
    orderid: orderId,
    bill_name: "RMS Demo",
    bill_email: "demo@RMS.com",
    bill_mobile: "55218438",
    bill_desc: "testing by RMS",
    returnurl: `https://lonely-food-app.vercel.app/api/return-url?id=${orderId}`,
    b_addr1: "A-16-13a, menara prima avenue",
    b_addr2: "jln 123",
    b_zipcode: "12345",
    b_city: "KL",
    b_state: "Selangor",
    country: "MY",
    s_name: "peter zai",
    s_addr1: "jln successs 123",
    vcode: "",
    metadata: metadata,
  };

  const vcode = getMD5HashData(
    `${data.amount}${merchantID}${data.orderid}${vkey}`
  );

  data.vcode = vcode;

  //const url = `https://sandbox.merchant.razer.com/RMS/pay/${merchantID}/`;
  // const url = `https://sandbox.fiuu.com/RMS/pay/${merchantID}/`
  const url = `https://pay.fiuu.com/RMS/pay/${merchantID}/`;

  return { url, data };
};

export async function createPaymentData() {
  //receive params from client side [{id:..., number:...},...]
  //fetch data from database and do own calculation and return the total amount from here.

  const data = {
    merchant_id: merchantID,
    amount: "4.98",
    orderid: "DEMO3030",
    bill_name: "Peter Zai",
    bill_email: "wonghv@gmail.com",
    bill_mobile: "+0166307168",
    bill_desc: "chor 4 alone!",
    b_addr1: "A-16-13a, menara prima avenue",
    b_addr2: "jln 123",
    b_zipcode: "12345",
    b_city: "KL",
    b_state: "Selangor",
    country: "MY",
    vcode: "",
    metadata: JSON.stringify([
      { id: "1itemid", amount: "15.00", name: "fish and chips" },
      { id: "2item1id", amount: "20.50", name: "fried" },
      { id: "3item1id", amount: "15.75", name: "ice creame" },
      { id: "4item1id", amount: "30.00", name: "100 plus" },
      { id: "5item1id", amount: "25.25", name: "cake" },
    ]),
  };

  const vcode = getMD5HashData(
    `${data.amount}${merchantID}${data.orderid}${vkey}`
  );

  data.vcode = vcode;

  return data;
}


