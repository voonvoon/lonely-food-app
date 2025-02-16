//keep track all active client connections to send updates or events to them. 
//This is why you maintain a list of clients.
//when a client(frontend) connects to the server, you add the client to the list of clients.

let clients: any[] = [];

export function addClient(client: any) {
  clients.push(client);
  console.log("Client added:", client);
  console.log("Current clients:", clients);
}

export function removeClient(clientId: number) {
  clients = clients.filter((client) => client.id !== clientId);
  console.log("Client removed with ID:", clientId);
  console.log("Current clients:", clients);
}
