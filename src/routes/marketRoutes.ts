import Router from 'express';
import {
  createMarket,
  getMarkets,
  getMarketById,
  updateMarket,
  deleteMarket,
} from "../controllers/marketControllers"
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated';
import upload from '../config/multer';

const marketRouter = Router();

marketRouter.post('/',isAuthenticated, isAdmin,upload.single('marketThumbnail'), createMarket);
marketRouter.get('/', getMarkets);
marketRouter.get('/:id', getMarketById);
marketRouter.patch('/:id', updateMarket);
marketRouter.delete('/:id', deleteMarket);

export default marketRouter;
