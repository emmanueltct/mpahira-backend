export interface MarketAttributes {
  id: string;
  marketName: string;
  province: string;
  district:string;
  sector:string;
  marketThumbnail?: string;
  classification: 'shared' | 'owner'|'store';
  locationLongitude:string;
  locationLatitude:string;
  googleMapCoordinate?:string;
  createdAt?: Date;
  updatedAt?: Date;
}
