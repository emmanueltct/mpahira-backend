export interface ShopProductAttributes {
 
id: string;
shopId?: string;
productId?: string;
isExpires:boolean;
expireDate: string;
isAvailable:boolean;
productDescription:Text;
productProfile:string;
createdAt?: Date;
updatedAt?: Date;
}
