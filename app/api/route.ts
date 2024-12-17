import { NextResponse } from "next/server"; // is a way to bring in a built-in helper from Next.js to handle HTTP responses in API routes.
import dbConnect from "@/utils/dbConnect";
//import { auth } from "@/auth";
//import { checkAuth } from "@/utils/checkAuth";

// export const config = {
//   runtime: "experimental-edge",
// };

export async function GET(req: Request) {
  //const isAuthenticated = await checkAuth();
  //   if (!isAuthenticated) {
  //     return NextResponse.json({
  //       message: "unauthorized!",
  //       status: "Failed",
  //       time: new Date().toLocaleString(),
  //     });
  //   }

  //   return NextResponse.json({
  //     message: "API is working fine!",
  //     status: "success",
  //     time: new Date().toLocaleString(),
  //   });
  try {
    await dbConnect(); // Try connecting to the database
    return NextResponse.json({ message: "Connection successful yeah!" });
  } catch (error: unknown) {
    // Check if the error is an instance of Error to safely access error.message
    if (error instanceof Error) {
      return NextResponse.json({
        message: "Connection failed",
        error: error.message,
      });
    }
  }
}
