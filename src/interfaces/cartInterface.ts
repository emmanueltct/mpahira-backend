
export interface CartItem {
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CartAttributes {
  id?: string;
  userId: string;
  deliverylocationId?:string | undefined;
  items:string;
  totalAmount: number;
  transportCost : number;
  deliveryDistance:string,
  serviceCost : number;
  generalTotal : number;
}