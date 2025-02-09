//purpose:is redirect the user to the frontend page after the payment is completed.
//The route is called by the payment gateway after the payment is completed --return url
//but this return url is POST method, so we need to create a POST route to handle the request.
//redirect the user to the frontend page after the payment is completed.
//303 status code indicates that the client should perform a GET request to the new URL instead of original POST.

// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         // Construct the absolute URL for redirection .
//         const url = new URL(`/order-summary`, req.nextUrl.origin); //req.nextUrl.origin gives you the base URL of the incoming request,

//         // Redirect to the frontend page without passing any data
//         return NextResponse.redirect(url.toString(), 303); //The 303 makes client to perform a GET request to the new URL.
//     } catch (error) {
//         console.error('Error processing request:', error);
//         return new NextResponse('Internal Server Error', { status: 500 });
//     }
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Read the request body as text
        const bodyText = await req.text();
        let body;

        // Try to parse the body text as JSON
        try {
            body = JSON.parse(bodyText);
        } catch (error) {
            console.error('Invalid JSON:', bodyText);
            return new NextResponse('Bad Request: Invalid JSON', { status: 400 });
        }

        console.log('Received parameters backend---------------------------->>:', body);

        // Convert the body to a JSON string and encode it
        const data = encodeURIComponent(JSON.stringify(body));

        // Construct the absolute URL for redirection with the data parameter
        const url = new URL(`/order-summary?data=${data}`, req.nextUrl.origin); // req.nextUrl.origin gives you the base URL of the incoming request

        // Redirect to the frontend page with the data as a query parameter
        return NextResponse.redirect(url.toString(), 303); // The 303 makes client to perform a GET request to the new URL
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
