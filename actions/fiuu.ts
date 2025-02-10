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
export const createPaymentLinkPost = async (items: any): Promise<string> => {
  const totalAmount = items
    .reduce((total: number, item: any) => {
      return total + parseFloat(item.price) * item.number;
    }, 0)
    .toFixed(2);

    const generateRandomOrderId = (): string => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();
      return `test${randomDigits}`;
    };

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
    orderid: generateRandomOrderId(),
    bill_name: "RMS Demo",
    bill_email: "demo@RMS.com",
    bill_mobile: "55218438",
    bill_desc: "testing by RMS",
    returnurl:"https://lonely-food-app.vercel.app/api/return-url",
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

  return JSON.stringify({ url, data });
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
