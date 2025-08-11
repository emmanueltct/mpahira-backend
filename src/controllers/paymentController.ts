import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { URLSearchParams } from 'url';

import { generateFlutterwaveSignature, isValidFlutterwaveWebhook } from '../utils/flutterwaveUtils';
import { processPaymentEvent } from '../service/flutterwaveService';


const CLIENT_ID = '00b9b23f-6fa9-4805-8f34-e0fe3e41b3eb';
const CLIENT_SECRET = 'qjKW3OMRTeaeoLpr0PwhQV2wBmkyLQ3H';
const ENCRYPTION_KEY ="Cw76osrF7rZWD1PdsXWaJVye24yavsJjzivkdwvwSwk=";


async function getAccessToken(): Promise<string> {
  const url = 'https://idp.flutterwave.com/realms/flutterwave/protocol/openid-connect/token';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  try {
    const resp = await axios.post(url, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return resp.data.access_token;
  } catch (err: any) {
    console.error('Error fetching access token:', err.response?.data || err.message);
    throw err;
  }
}

function encryptPayload(payload: object): string {
  const key = Buffer.from(ENCRYPTION_KEY, 'base64');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let enc = cipher.update(JSON.stringify(payload), 'utf8', 'base64');
  enc += cipher.final('base64');
  return iv.toString('base64') + ':' + enc;
}

const generateReference = () => {
  return 'REF' + Date.now(); // e.g., REF1723298883772
};



// async function createCustomer() {
//   const  accessToken = await getAccessToken();
//   const url = 'https://api.flutterwave.cloud/developersandbox/customers';

//  const customerPayload = {
//   email: "emmanuel114@gmail.com",
//   name: {
//     first: "Munezero",
//     middle: "Emmanuel",
//     last: "LeBron"
//   },
//   phone: {
//     country_code: "250",
//     number: "0787031937"
//   },
//   address: {
//     city: "New York",
//     country: "US",
//     line1: "123 Main Street",
//     line2: "Apt 4B",
//     postal_code: "10001",
//     state: "New York"
//   },
//   meta: {
//     additionalProp: "string"
//   }
// };


//   try {
//     const response = await axios.post(url, customerPayload, {
//       headers: {
//         'accept': 'application/json',
//         'content-type': 'application/json',
//         'Authorization': `Bearer ${accessToken}`
//       }
//     });
//     console.log('Customer created:', response.data);
//     return response.data.data.id
//   } catch (error:any) {
//     if (error.response) {
//       console.log('API error:', error.response.data.error);
//     } else {
//       console.error('Error:', error.message);
//     }
//   }
// }


async function createPayment() {
  const  accessToken = await getAccessToken();
  const url = 'https://api.flutterwave.cloud/developersandbox/payment-methods';

 const customerPayload = {
   "type": "mobile_money",
   "mobile_money": {
       "country_code": "250",
       "network": "MTN",
       "phone_number": "787031933"
   }
};

 const traceId = uuidv4();
 

  try {
    const response = await axios.post(url, customerPayload, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Trace-Id':traceId,
       'X-Idempotency-Key': traceId
      }
    });
    console.log('Customer created:', response.data);
    return response.data.data.id
  } catch (error:any) {
    if (error.response) {
      console.log('API error for mobile money:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}


export const initiateMobileMoneyAuthRedirect = async (req: Request, res: Response) => {
  const { amount, phone } = req.body;

  if (!amount || !phone) {
    res.status(400).json({ error: "amount and phone required" });
    return;
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken(); // already working for you
    console.log("Access Token:", accessToken);
  } catch {
    res.status(500).json({ error: "Failed to get access token" });
    return;
  }

  //const customerId = await createCustomer();
  const paymentId=await  createPayment()

  //console.log("customer id", )

  const traceId = uuidv4();

  const payload = {
    
    reference:  generateReference() , // Unique per transaction
     customer_id: "cus_T8Giu443Mz",
     //payment_method_id: "pm_mobilemoneyrwanda",      // Retrieved from customer creation API or DB
    payment_method_id:paymentId,  // Retrieved from payment methods list
    amount: amount,
    currency: "RWF",
    payment_options: "card,mobilemoney",
    payment_type: "mobilemoneyrwanda",
    redirect_url: `https://mpahira.vercel.app/payment-result`,
    customer: {
      email: "customer@example.com",
      phonenumber: phone,
      name: "Customer Name",
    },
    customizations: {
      title: "Mpahira Payment",
      description: "Payment for Mpahira",
      logo: "https://res.cloudinary.com/dbbv6uvfu/image/upload/v1753119559/products/profile/binance%20referral.png.png",
    },
    meta: {},
  };

  try {
    const response = await axios.post(
      "https://api.flutterwave.cloud/developersandbox/charges?type=mobile_money_rwanda",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Trace-Id": traceId,
          "X-Scenario-Key": "scenario:auth_redirect",
        },
      }
    );

    res.json(response.data);
  } catch (err: any) {
    console.log(
      "---------Payment initiation error:",
      err.response?.data.error
    );
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};


export async function verifyPayment(transactionId: string) {
  const  accessToken = await getAccessToken()
   const traceId = uuidv4();
  const res = await axios.get(`https://api.flutterwave.cloud/developersandbox/charges/${transactionId}`, {
     headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Trace-Id':traceId,
      }
  });
  res.data;
  return
}


export const manualVerifyPayment = async (req: Request, res: Response) => {
  try {
    const { transaction_id } = req.params;
    console.log(transaction_id )
    const result = await verifyPayment(transaction_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error});
  }
};



// flutterwaveController.ts00000000000000000000000000000000000000000000000000000000

 


export async function generateflutterwaveWebhookHandler(req: any, res: Response) {
  //const flutterwaveSignature = req.headers['flutterwave-signature'] as string | undefined;
  console.log(req.body)
 const payloadString = JSON.stringify(req.body);
   const signature = generateFlutterwaveSignature('Mpahira7XSu9Tj7Kh+VhEkIWYnkYHLup9YMe/t0OyUTq0DsD+k=Testcc',req.rawBody );

    res.status(200).send({signature });
     return
}




export async function flutterwaveWebhookHandler(req: any, res: Response) {
  const flutterwaveSignature = req.headers['flutterwave-signature'] as string | undefined;

  if (!flutterwaveSignature) {
    res.status(401).send('Missing signature header');
     return
  }

  const secretHash ='Mpahira7XSu9Tj7Kh+VhEkIWYnkYHLup9YMe/t0OyUTq0DsD+k=Testcc';

  console.log(req.rawBody)
  

if(!req.rawBody || typeof flutterwaveSignature !== 'string')  {
  res.status(401).send('Missing or invalid signature');
   return
}

if (!isValidFlutterwaveWebhook(req.rawBody, flutterwaveSignature, secretHash)) {
     res.status(401).send('Invalid signature');
     return
  }

  try {
    await processPaymentEvent(req.body);
  } catch (err) {
    console.error('Error processing webhook event:', err);
     res.status(500).send('Internal server error');
     return
  }

  // Always respond 200 for valid webhook
  res.sendStatus(200);
}


