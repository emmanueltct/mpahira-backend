import express from 'express';
import {
  createFavourite,
  getAllFavourites,
  getFavouriteById,
  updateFavourite,
  deleteFavourite,
  getUserFavourites,
} from '../controllers/favouriteMarketController';
import { isAuthenticated, isBuyer, optionalAuth } from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/',isAuthenticated, isBuyer, createFavourite);
router.get('/', getAllFavourites);
router.get('/single',optionalAuth,getUserFavourites)
router.get('/:id', getFavouriteById);
router.put('/:id', updateFavourite);
router.delete('/:id', deleteFavourite);

export default router;
