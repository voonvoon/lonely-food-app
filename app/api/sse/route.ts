import { NextResponse } from "next/server";
import { addClient, removeClient } from "./sseUtils";
import { MongoClient } from "mongodb";

export const config = {
  runtime: "edge",
};

// Set up MongoDB connection then listen for new orders
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

    changeStream.on("change", (next) => {
      if (next.operationType === "insert") {
        const newOrder = next.fullDocument;
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
    "Access-Control-Allow-Origin": "*",
  });
//ReadableStream:built-in web API represents readable stream of data.
  const stream = new ReadableStream({
    start(controller) { //controller: handles incoming requests and returns responses in a web application
      const clientId = Date.now();
      const newClient = { id: clientId, controller };
      addClient(newClient);

      console.log(`Client connected: ${clientId}`);

      // Watch for new orders in MongoDB
      watchOrders(controller);

      // Send a heartbeat every 30 seconds to keep the connection alive
      //prevent err:Vercel Runtime Timeout Error: Task timed out after 60 seconds
      const heartbeat = setInterval(() => {
        controller.enqueue(`data: {"type": "heartbeat"}\n\n`);
      }, 30000);

      // Clean up when the connection closes
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        removeClient(clientId);
        console.log(`Client disconnected: ${clientId}`);
      });

      // Error handling
      controller.error = (err) => {
        console.error(`Stream error: ${err}`);
      };
    },
  });

  //below to construct and return an HTTP(headers) response with a body (the stream) and headers
  return new Response(stream, { headers });
}



