let currentMessage = '';

export function handleWebhook(event: any) {
  // Update the message based on the webhook event data
  currentMessage = event.message;
  console.log('Webhook event received--------------->:', currentMessage);
}

export function getCurrentMessage() {
  return currentMessage;
}