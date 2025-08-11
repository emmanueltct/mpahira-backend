interface FlutterwaveEvent {
  event: string;
  data: {
    tx_ref: string;
    status: string;
    amount: number;
    [key: string]: any;
  };
}

/**
 * Process Flutterwave payment webhook event data
 * @param event - webhook event payload
 */
export async function processPaymentEvent(event: FlutterwaveEvent) {
  if (event.event !== 'charge.completed') {
    console.log(`Unhandled event type: ${event.event}`);
    return;
  }

  const payment = event.data;

  console.log("-------------------------------------------",payment)

  console.log('Charge completed webhook received for:', payment.tx_ref);

  if (payment.status === 'successful') {
    // TODO: Mark order as paid in your database
    console.log(`Payment successful for ${payment.tx_ref}, amount: ${payment.amount}`);

  } else if (payment.status === 'failed') {
    // TODO: Mark order as failed or cancelled
    console.log(`Payment failed for ${payment.tx_ref}`);

  } else if (payment.status === 'cancelled') {
    // TODO: Handle cancelled payment (if applicable)
    console.log(`Payment cancelled for ${payment.tx_ref}`);

  } else {
    console.log(`Unhandled payment status '${payment.status}' for ${payment.tx_ref}`);
  }
}
