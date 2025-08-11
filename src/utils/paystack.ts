import fetch from "node-fetch";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const CURRENCY = process.env.CURRENCY || "RWF";

export async function initializePaystackPayment(email: string, amount: number, phone?: string) {
  const payload = {
    email,
    amount: Math.round(amount * 100),
    currency: CURRENCY,
    channels: ["card", "mobile_money_rwanda"],
    callback_url: `${BASE_URL}/payment/callback`,
    metadata: { phone }
  };

  const resp = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return resp.json();
}

export async function verifyPaystackPayment(reference: string) {
  const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
  });
  return resp.json();
}
