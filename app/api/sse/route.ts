import { NextResponse } from "next/server";
import { addClient, removeClient } from "./sseUtils";
import { MongoClient } from "mongodb";

export const config = {
  runtime: "edge",
};

const uri = process.env.DATABASE_URL;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}
const client = new MongoClient(uri);

async function watchOrders(controller: ReadableStreamDefaultController) {
  try {
    await client.connect();
    const database = client.db("mydata");
    const orders = database.collection("Order");

    const changeStream = orders.watch();

    // changeStream.on("change", (next) => {
    //   if (next.operationType === "insert") {
    //     controller.enqueue(
    //       `data: ${JSON.stringify({ message:"you have a new order!" })}\n\n`
    //     );
    //   }
    // });

    changeStream.on("change", (next) => {
      if (next.operationType === "insert") {
      const newOrder = next.fullDocument;//next:next document in the stream and fullDocument contains the entire document that was changed
      const msg = {
        message: "Congrat! You have a new order!",
        orderId: newOrder.orderid,
        totalAmount: newOrder.totalAmount,
        name: newOrder.name,
      };
      controller.enqueue(`data: ${JSON.stringify(msg)}\n\n`);
      }
    });
  } catch (err) {
    console.error(`Failed to set up change stream: ${err}`);
  }
}

export function GET(req: Request) {
  // Set headers for SSE
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*", // Add CORS header if needed
  });

  const stream = new ReadableStream({
    start(controller) {
      const clientId = Date.now();
      const newClient = { id: clientId, controller };
      addClient(newClient);

      console.log(`Client connected: ${clientId}`);

      // Watch for new orders in MongoDB
      watchOrders(controller);

      // Clean up when the connection closes
      req.signal.addEventListener("abort", () => {
        removeClient(clientId);
        console.log(`Client disconnected: ${clientId}`);
      });

      // Error handling
      controller.error = (err) => {
        console.error(`Stream error: ${err}`);
      };
    },
  });

  return new Response(stream, { headers });
}



