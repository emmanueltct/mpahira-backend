export interface InitPaymentRequest {
  email: string;
  amount: number;
  phone?: string;
}

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    reference: string;
  };
}
