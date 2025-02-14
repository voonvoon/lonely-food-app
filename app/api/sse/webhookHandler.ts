let currentMessage = 'awaiting new order';

export function handleWebhook(event: any) {
  // Update the message based on the webhook event data
  currentMessage = event.message || 'awaiting new order';
}

export function getCurrentMessage() {
  return currentMessage;
}