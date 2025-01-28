import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";

export async function POST(req: NextRequest) {
    const sec_key = "428356ca6c81dfbfa2181bcdc1def2f6"; // Replace xxxxxxxxxx with Secret_Key

    try {
        const data = await req.json();
        data.treq = 1; // Additional parameter for IPN. Value always set to 1.

        let {
            nbcb, tranID, orderid, status, domain, amount, currency, appcode, paydate, skey
        } = data;

        // Verify the data integrity
        const key0 = CryptoJS.MD5(tranID + orderid + status + domain + amount + currency).toString();
        const key1 = CryptoJS.MD5(paydate + domain + key0 + appcode + sec_key).toString();

        if (skey !== key1) {
            status = "-1"; // Invalid transaction
        }

        if (status === "00") {
            if (checkCartAmount(orderid, amount)) {
                // Write your script here for successful transaction
                console.log("Transaction successful yeah woo!!!! i am the best !!");
            }
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


// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const data = await req.json();

//         // Process the received data here
//         console.log("Received data:", data);

//         // Respond with a success message
//         return NextResponse.json(
//             { message: "Payment status received successfully" },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error("Error processing payment status:", error);
//         return NextResponse.json(
//             { error: "Internal Server Error" },
//             { status: 500 }
//         );
//     }
// }

// //https://lonely-food-app.vercel.app/api/fiuu-webhook


