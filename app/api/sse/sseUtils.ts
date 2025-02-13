let clients: any[] = [];

// Function to send events to all connected clients
export function sendNewOrderEvent(order: any) {
  const data = `data: ${JSON.stringify(order)}\n\n`;
  console.log('Sending new order event to clients:', data);
  clients.forEach(client => {
    try {
      client.controller.enqueue(new TextEncoder().encode(data));
    } catch (error) {
      console.error('Error sending event to client:', error);
    }
  });
}

export function addClient(client: any) {
  clients.push(client);
}

export function removeClient(clientId: number) {
  clients = clients.filter(client => client.id !== clientId);
}