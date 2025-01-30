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
    // b_addr1: "1234",
    // b_addr2: "jln 123",
    // b_zipcode: "12345",
    // b_city:'KL',
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

export const createPaymentLinkPost = async (): Promise<string> => {
  const data = {
    merchant_id: merchantID,
    amount: "3.33",
    orderid: "DEMO5179",
    bill_name: "RMS+Demo",
    bill_email: "demo@RMS.com",
    bill_mobile: "55218438",
    bill_desc: "testing+by+RMS",
    vcode: "a5e2d4ed5e16859a2acfb28c7707f09c",
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

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const result = await response.text();
  console.log("result------------------------------->", result);
  return result;
};

export async function createPaymentData() {

  //receive params from client side [{id:..., number:...},...]
  //fetch data from database and do own calculation and return the total amount from here.

  const data: {
    merchant_id: string;
    amount: string;
    orderid: string;
    bill_name: string;
    bill_email: string;
    bill_mobile: string;
    bill_desc: any;
    vcode?: string;
    b_addr1?: string;
    b_addr2?: string;
    b_zipcode?: string;
    b_city?: string;
    b_state?: string;
    country?: string;
    metadata?: { id: string; amount: string; name: string }[];
  } = {
    merchant_id: merchantID,
    amount: "3.77",
    orderid: "DEMO3388",
    bill_name: "Peter Zai",
    bill_email: "wonghv@gmail.com",
    bill_mobile: "+0166307168",
    bill_desc: "gong xi fatt chai 3!",
    b_addr1: "A-16-13a, menara prima avenue",
    b_addr2: "jln 123",
    b_zipcode: "12345",
    b_city: "KL",
    b_state: "Selangor",
    country: "MY",
    metadata: [
      { id: "1itemid", amount: "10.00", name: "fish and chips" },
      { id: "2item1id", amount: "20.50", name: "fried" },
      { id: "3item1id", amount: "15.75", name: "ice creame" },
      { id: "4item1id", amount: "30.00", name: "100 plus" },
      { id: "5item1id", amount: "25.25", name: "cake" }
    ]
  };

  

  const vcode = getMD5HashData(
    `${data.amount}${merchantID}${data.orderid}${vkey}`
  );

  data.vcode = vcode;

  return data;
}

// "use server";

// //checksum is a value used to verify the integrity of a file or a data transfer.

// import CryptoJS from "crypto-js";

// const merchantID = "SB_pelicanwebdev";
// const vkey = "f4a57aba46a55e217dd8b597bfdfad2b";

// const orderid = "demoINV0123"; // Replace with your actual order ID

// // Generate MsgID using a secret key and unique data
// const secretKey = "your_secret_key"; // Replace with your actual secret key
// const hash = CryptoJS.MD5(merchantID + orderid + secretKey).toString(CryptoJS.enc.Hex);

// //takes a string as input and returns its MD5 hash as a string,
// //typically used for data integrity checks or storing hashed values securely.
// const getMD5HashData = (data: string) => {
//   return CryptoJS.MD5(data).toString();
// };

// //takes a string input and returns its SHA-1 hash as a string using the CryptoJS library.
// //purposes like data integrity verification or secure storage.
// const getSHA1HashData = (data: string) => {
//   return CryptoJS.SHA1(data).toString();
// };

// const createPaymentLink = async () => {
//   const md5_vkey = getMD5HashData(vkey);

//   console.log(
//     "MD5 Vkey-------------------------------------------------->: ",
//     md5_vkey
//   );

//   const data = {
//     merchant_id: merchantID,
//     orderid: orderid,
//     bill_name: "peter",
//     bill_email: "wonghv@gmail.com",
//     amount: 2.2,
//     currency: "MYR",
//     remark: "Product 1",
//     email_subject: "Payment to RMS",
//     MsgID: hash,
//     mobile_number: "+60166307168",
//     item: [
//       { descr: "ITEM 1", totalcost: 1.1 },
//       { descr: "ITEM 2", totalcost: 1.1 },
//     ],
//   };

//   const data_parms = JSON.stringify(data);

//   console.log(
//     "Data Params-------------------------------------------------->: ",
//     data_parms
//   );

//   const checksum = getMD5HashData(data_parms + getSHA1HashData(md5_vkey));

//   console.log(
//     "Checksum-------------------------------------------------->: ",
//     checksum
//   );

//   const params = new URLSearchParams();
//   params.append("params", data_parms);
//   params.append("checksum", checksum);
//   const now = new Date();
//   const formattedDateTime = now
//     .toISOString()
//     .replace("T", " ")
//     .substring(0, 19);
//   params.append("datetime", formattedDateTime);

//   console.log(
//     "Params-------------------------------------------------->: ",
//     params
//   );

//   //https://sandbox.merchant.razer.com/RMS/API/Invoice/index.php?op=AddInvoice
//   //https://api.fiuu.com/RMS/API/Invoice/index.php?op=AddInvoice
//   //https://sandbox.fiuu.com/RMS/API/Invoice/index.php?op=AddInvoice
//   const url =
//     "https://sandbox.merchant.razer.com/RMS/pay/SB_pelicanwebdev/";

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: params.toString(),
//   });

//   const result = await response.text();
//   console.log(result);
//   return result;
// };

// export default createPaymentLink;
