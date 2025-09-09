import { Request, Response, NextFunction } from 'express';
import { productSchema } from "../validations/productValidation"
import Product from "../models/productModel"
import { FavauriteMarket } from '../models/FavauriteMarket';
import ShopProduct from '../models/shopProductModel';
import Shop from '../models/shopModel';
import Market from '../models/marketModel';

export const isValidCartOption = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
        const buyerId = (req as any).user.id;
   
    const market = await  FavauriteMarket.findOne({where:{buyerId}})

    const item=req.body
    
    const product=await ShopProduct.findOne({where:{id:item.items.productId},include:[
                {
                model: Shop,
                as: "shopName",
               }
        ]})

    if(!market?.marketId){
        await FavauriteMarket.create({ buyerId, marketId:product?.shopName.marketId })
        next()
        return
    }

    if(market?.marketId !==product?.shopName.marketId){
       res.status(500).json({ message: 'You can only add products from your favourite market or from the same market as your previous items.' });
       return 
    }

    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during validation', error: err });
  }
};
