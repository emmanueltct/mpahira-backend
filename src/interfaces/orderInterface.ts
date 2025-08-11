
export interface OrderItem {
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  generalStatus:"Available"|"Not available";
  processingStatus:"pending"|"Picked"|"Cancelled";
  agentComment?:string;
  buyerComment?:string

}

export interface OrderAttributes {
    id?: string;
    items: OrderItem[];
    buyerId:string;
    agentId?:string;
    driverId?:string;
    totalAmount:number;
    paidAmount:number;
    refundAmount:number;
    transportCost:number;    
    serviceCost:number;
    agentCommission:number;
    generalTotal:number;
    paymentTransaction?:string;
    paymentStatus:'Pending'|'Verification'|'Paid'|'Rejected';
    orderProcessingStatus:'Pending'| 'Assigned to Agent'|'Shopping'|'Shipping'|'Delivered';
    agentComment?:Text;
    buyerComment?:Text;
    serviceRating?:string;
    deliverylocationId?:string;
    deliveryDistance:string;
}