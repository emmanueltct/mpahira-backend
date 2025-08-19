import Router from 'express';
import upload from '../config/multer'
import {
  createShopProduct,
  getShopProducts,
  getShopProductById,
  updateShopProduct,
  deleteShopProduct,
} from "../controllers/shopProductControllers"

import { isAdmin, isAuthenticated, isSeller, optionalAuth } from '../middleware/isAuthenticated';
import { validateShopProductInput } from '../middleware/isshopproductvalid';

const shopProductRouter = Router();

shopProductRouter.post('/', upload.single('productProfile'), isAuthenticated, isSeller, validateShopProductInput, createShopProduct);
shopProductRouter.get('/',optionalAuth , getShopProducts);
shopProductRouter.get('/:id', getShopProductById);
shopProductRouter.patch('/:id', updateShopProduct);
shopProductRouter.delete('/:id', deleteShopProduct);

export default shopProductRouter;
