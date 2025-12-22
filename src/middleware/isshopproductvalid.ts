import { Request, Response, NextFunction } from 'express';
import { shopProductSchema } from '../validations/shopProductValidation';
import ShopProduct from '../models/shopProductModel';
import Shop from '../models/shopModel';
import { isSeller } from './isAuthenticated';

export const validateShopProductInput = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = shopProductSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { productName,shopId} = parsed.data;
  const user = (req as any).user;
  try {

    if(productName !=null){
            const existingProduct = await ShopProduct.findOne({ where: {engLabel:productName, shopId } });
            if (existingProduct) {
            res.status(409).json({ message: 'Product already exists in thus shop' });
            return;
         }
    }
   
     const isShopOwner = await Shop.findOne({ where: {id:shopId, sellerId:user.id } });
    if (!isShopOwner) {
      res.status(409).json({ message: 'This shop belongs to another person shop. It is only allowed to add products in your own shops' });
      return;
    }
    req.body = parsed.data; // update request with parsed/validated data
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during validation', error: err });
  }
};
