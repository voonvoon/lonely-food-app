import { NextResponse } from "next/server";
import { addClient, removeClient } from "./sseUtils";
import { getCurrentMessage } from "./webhookHandler";

export const config = {
  runtime: "edge",
};

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

      // Send an initial message to the client
      //controller.enqueue(`data: ${JSON.stringify({ message: 'awaiting new order' })}\n\n`);
      //controller.enqueue(`data: ${JSON.stringify({ message: getCurrentMessage() })}\n\n`);
      // let counter = 0;

      // // Send a message to the client every second with an incrementing number
      // const intervalId = setInterval(() => {
      //   controller.enqueue(`data: ${JSON.stringify({ number: counter })}\n\n`);
      //   counter++;
      // }, 1000);

      // Send a heartbeat every 30 seconds to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        controller.enqueue(
          `data: ${JSON.stringify({ message: getCurrentMessage() })}\n\n`
        );
      }, 10000);

      // Clean up when the connection closes
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatInterval);
        //clearInterval(intervalId);
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
