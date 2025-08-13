import crypto from 'crypto';

/**
 * Verify Flutterwave webhook signature
 * @param rawBody - raw request body as string
 * @param signature - flutterwave-signature header value
 * @param secretHash - your webhook secret from env
 * @returns boolean
 */
export function isValidFlutterwaveWebhook(rawBody: string, signature: string, secretHash: string): boolean {
  const hash = crypto
    .createHmac('sha256', secretHash)
    .update(rawBody)
    .digest('base64');
    
  return hash === signature;
}


export function generateFlutterwaveSignature( secretHash: string,rawBody: string,): string {
 
  return crypto
    .createHmac('sha256', secretHash)
    .update(rawBody)
    .digest('base64');
}