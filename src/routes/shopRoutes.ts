import Router from 'express';
import {
  createShop,
  getAllShops,
  getShopById,
  getShopBySeller,
  updateShop,
  deleteShop,
  
} from "../controllers/shopControllers"

import { isAdmin, isAuthenticated, isSeller } from '../middleware/isAuthenticated';

const shopRouter = Router();

shopRouter.post('/',isAuthenticated, isSeller, createShop);
shopRouter.get('/', getAllShops);
shopRouter.get('/:id', getShopById);
shopRouter.get('/sellers/:id', getShopBySeller);
shopRouter.patch('/:id', updateShop);
shopRouter.delete('/:id', deleteShop);

export default shopRouter;
