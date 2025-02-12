import { NextResponse } from 'next/server';
import { addClient, removeClient } from './sseUtils';

export function GET(req: Request) {
  // Set headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*', // Add CORS header if needed
  });

  const stream = new ReadableStream({
    start(controller) {
      const clientId = Date.now();
      const newClient = { id: clientId, controller };
      addClient(newClient);

      console.log(`Client connected: ${clientId}`);

      // Send a heartbeat every 30 seconds to keep the connection alive
      const heartbeatInterval = setInterval(() => {
        controller.enqueue(`data: heartbeat\n\n`);
      }, 30000);

      // Clean up when the connection closes
      req.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        removeClient(clientId);
        console.log(`Client disconnected: ${clientId}`);
      });

      // Error handling
      controller.error = (err) => {
        console.error(`Stream error: ${err}`);
      };
    }
  });

  return new Response(stream, { headers });
}