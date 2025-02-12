let clients: any[] = [];

// Function to send events to all connected clients
export function sendNewOrderEvent(order: any) {
  const data = `data: ${JSON.stringify(order)}\n\n`;
  clients.forEach(client => client.controller.enqueue(new TextEncoder().encode(data)));
}

export function addClient(client: any) {
  clients.push(client);
}

export function removeClient(clientId: number) {
  clients = clients.filter(client => client.id !== clientId);
}