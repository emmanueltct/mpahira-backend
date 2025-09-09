export interface ProductPricingAttributes {
  id: string;
  productId: string;
  unitId: string;
  subUnitId: string;
  unitPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  isDefaultSelection: boolean;
}
