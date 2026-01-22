import Router from 'express';
import upload from '../config/multer'
import {
  createShopProduct,
  getShopProducts,
  getShopProductById,
  updateShopProduct,
  deleteShopProduct,
  getShopProductByHomeSearch
} from "../controllers/shopProductControllers"

import { isAdmin, isAuthenticated, isSeller, optionalAuth } from '../middleware/isAuthenticated';
import { validateShopProductInput } from '../middleware/isshopproductvalid';

const shopProductRouter = Router();

shopProductRouter.post('/', upload.single('productProfile'), isAuthenticated, isSeller, validateShopProductInput, createShopProduct);
shopProductRouter.get('/',optionalAuth , getShopProducts);
shopProductRouter.get('/:id', getShopProductById);
shopProductRouter.patch('/:id',upload.single('productProfile'), updateShopProduct);
shopProductRouter.delete('/:id', deleteShopProduct);
shopProductRouter.get('/products/search',getShopProductByHomeSearch);
export default shopProductRouter;
