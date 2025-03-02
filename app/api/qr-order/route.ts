import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { encrypt } from "@/utils/encryption"; 

export async function GET(req: NextRequest) {
    try {
        // Extract the orderId from the query parameters
        const vid = req.nextUrl.searchParams.get('vid');
        
        if (!vid) {
            return new NextResponse('Bad Request: Missing orderId', { status: 400 });
        }

        const table = await db.tableActive.findUnique({
            where: { tableId: vid },
        });

        if (!table) {
            return new NextResponse('Not Found: No matching table', { status: 404 });
        }

        // Construct the absolute URL for redirection with the orderId
        const url = new URL(`/menu?tableno=${table?.table}&cardno=${table?.id}&checkid=${generateRandomCheckIn()}`, req.nextUrl.origin);

        // Redirect to the frontend page without passing any data
        return NextResponse.redirect(url.toString(), 303); // The 303 makes client to perform a GET request to the new URL.
    } catch (error) {
        console.error('Error processing request:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

const generateRandomCheckIn = (): string => {
    const now = new Date();
    const currentTimeInSeconds = Math.floor(now.getTime() / 1000);
    //console.log("currentTimeInSeconds------------->>", currentTimeInSeconds);
    const encryptedCheckinId = encrypt(currentTimeInSeconds.toString());
    const checkinId = `${encryptedCheckinId}`;
   
  
    return checkinId;
  };