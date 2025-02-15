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

    changeStream.on("change", (next) => {
      if (next.operationType === "insert") {
        controller.enqueue(
          `data: ${JSON.stringify({ message:"you have a new order!" })}\n\n`
        );
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


// import { NextResponse } from "next/server";
// import { addClient, removeClient } from "./sseUtils";
// import { getCurrentMessage } from "./webhookHandler";

// export const config = {
//   runtime: "edge",
// };

// export function GET(req: Request) {
//   // Set headers for SSE
//   const headers = new Headers({
//     "Content-Type": "text/event-stream",
//     "Cache-Control": "no-cache",
//     Connection: "keep-alive",
//     "Access-Control-Allow-Origin": "*", // Add CORS header if needed
//   });

//   const stream = new ReadableStream({
//     start(controller) {
//       const clientId = Date.now();
//       const newClient = { id: clientId, controller };
//       addClient(newClient);

//       console.log(`Client connected: ${clientId}`);

//       // Send an initial message to the client
//       //controller.enqueue(`data: ${JSON.stringify({ message: 'awaiting new order' })}\n\n`);
//       //controller.enqueue(`data: ${JSON.stringify({ message: getCurrentMessage() })}\n\n`);
//       // let counter = 0;

//       // // Send a message to the client every second with an incrementing number
//       // const intervalId = setInterval(() => {
//       //   controller.enqueue(`data: ${JSON.stringify({ number: counter })}\n\n`);
//       //   counter++;
//       // }, 1000);

//       // Send a heartbeat every 30 seconds to keep the connection alive
//       const heartbeatInterval = setInterval(() => {
//         controller.enqueue(
//           `data: ${JSON.stringify({ message: getCurrentMessage() })}\n\n`
//         );
//       }, 1000);

//       // Clean up when the connection closes
//       req.signal.addEventListener("abort", () => {
//         clearInterval(heartbeatInterval);
//         //clearInterval(intervalId);
//         removeClient(clientId);
//         console.log(`Client disconnected: ${clientId}`);
//       });

//       // Error handling
//       controller.error = (err) => {
//         console.error(`Stream error: ${err}`);
//       };
//     },
//   });

//   return new Response(stream, { headers });
// }
