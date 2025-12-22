export interface ShopProductAttributes {
 
id: string;
shopId?: string;
productId?: string;
subCategoryId:string;
// productUnit:string;
isExpires:boolean;
engLabel?:string;
kinyLabel?:string;
expireDate: string;
isAvailable:boolean;
productDescription:Text;
productProfile:string;
createdAt?: Date;
updatedAt?: Date;
}
