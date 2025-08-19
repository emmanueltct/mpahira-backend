export interface ShopProductAttributes {
 
id: string;
shopId?: string;
productId?: string;
marketUnitPrice:string;
systemUnitPrice:string;
productUnit:string;
isExpires:boolean;
engLabel?:string;
kinyLabel?:string;
productDiscount?:string;
expireDate: string;
isAvailable:boolean;
productDescription:Text;
productProfile:string;
createdAt?: Date;
updatedAt?: Date;
}
