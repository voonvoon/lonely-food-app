//import { NextApiRequest, NextApiResponse } from 'next';
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     // Process the payment data here
//     const paymentData = req.body;

//     // Redirect to the frontend page with payment data
//     return NextResponse.redirect(`/order-summary?status=success&data=${encodeURIComponent(JSON.stringify(paymentData))}`, 307);
// }

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Construct the absolute URL for redirection .
        const url = new URL(`/order-summary?status=success`, req.nextUrl.origin);

        // Redirect to the frontend page without passing any data
        return NextResponse.redirect(url.toString(), 307);
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

