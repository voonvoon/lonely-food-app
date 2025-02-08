//import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    // Process the payment data here
    const paymentData = req.body;

    // Redirect to the frontend page with payment data
    return NextResponse.redirect(`/order-summary?status=success&data=${encodeURIComponent(JSON.stringify(paymentData))}`, 307);
}
