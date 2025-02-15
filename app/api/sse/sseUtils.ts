let clients: any[] = [];

// Function to send events to all connected clients
// export function sendNewOrderEvent(order: { newOrder: boolean }) {
//   const data = `data: ${JSON.stringify(order)}\n\n`;
//   console.log('Sending new order event to clients:', data);
//   clients.forEach(client => {
//     try {
//       //client.controller.enqueue(new TextEncoder().encode(data));
//       client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
//     } catch (error) {
//       console.error('Error sending event to client:', error);
//     }
//   });
// }

export function addClient(client: any) {
  clients.push(client);
  console.log('Client added:', client);
  console.log('Current clients:', clients);
}

export function removeClient(clientId: number) {
  clients = clients.filter(client => client.id !== clientId);
  console.log('Client removed with ID:', clientId);
  console.log('Current clients:', clients);
}