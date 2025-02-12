import { NextResponse } from 'next/server';
import { addClient, removeClient } from './sseUtils';

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
      addClient(newClient);

      console.log(`Client connected: ${clientId}`);

      // Clean up when the connection closes
      req.signal.addEventListener('abort', () => {
        removeClient(clientId);
        console.log(`Client disconnected: ${clientId}`);
      });
    }
  });

  return new Response(stream, { headers });
}