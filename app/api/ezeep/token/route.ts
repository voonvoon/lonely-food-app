import { NextResponse } from "next/server";
import { getAccessToken } from "@/actions/ezeep"; // Adjust the import path if necessary

export async function GET() {
  try {
    const accessToken = await getAccessToken(); // Call the server-side function
    return NextResponse.json({ accessToken }); // Return the token as JSON
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch access token" },
      { status: 500 }
    );
  }
}