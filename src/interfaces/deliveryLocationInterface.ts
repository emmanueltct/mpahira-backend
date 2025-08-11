

export interface  DeliveryLocationAttributes{
    id?: string;
    buyerId?: string;
    locationLongitude?:string;
    locationLatitude?:string;
    googleMapCoordinate?:string;
    streetNumber?:string;
    nearestLandmark?:string;
    locationDescription?:Text;
    createdAt?: Date;
    updatedAt?: Date;

}