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
  
    return;
  }

  const payment = event.data;

  if (payment.status === 'successful') {
    // TODO: Mark order as paid in your database


  } else if (payment.status === 'failed') {
    // TODO: Mark order as failed or cancelled


  } else if (payment.status === 'cancelled') {
    // TODO: Handle cancelled payment (if applicable)
    // console.log(`Payment cancelled for ${payment.tx_ref}`);

  } else {
   
  }
}
