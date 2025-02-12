// app/api/sse/route.ts
import { NextResponse } from 'next/server';

// This will act as a simple in-memory store to hold the response objects
let clients: any[] = [];

export function GET(req: Request) {
  // Set headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      const clientId = Date.now();
      const newClient = { id: clientId, controller };
      clients.push(newClient);

      console.log(`Client connected: ${clientId}`);

      // Clean up when the connection closes
      req.signal.addEventListener('abort', () => {
        clients = clients.filter(client => client.id !== clientId);
        console.log(`Client disconnected: ${clientId}`);
      });
    }
  });

  return new Response(stream, { headers });
}

// Function to send events to all connected clients
export function sendNewOrderEvent(order: any) {
  const data = `data: ${JSON.stringify(order)}\n\n`;
  clients.forEach(client => client.controller.enqueue(new TextEncoder().encode(data)));
}
