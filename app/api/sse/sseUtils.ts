let clients: any[] = [];

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