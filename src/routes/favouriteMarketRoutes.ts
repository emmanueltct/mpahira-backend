import express from 'express';
import {
  createFavourite,
  getAllFavourites,
  getFavouriteById,
  updateFavourite,
  deleteFavourite,
} from '../controllers/favouriteMarketController';
import { isAuthenticated, isBuyer } from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/',isAuthenticated, isBuyer, createFavourite);
router.get('/', getAllFavourites);
router.get('/:id', getFavouriteById);
router.put('/:id', updateFavourite);
router.delete('/:id', deleteFavourite);

export default router;
