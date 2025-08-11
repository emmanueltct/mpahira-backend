import express from 'express';
import {
  createDeliveryLocation,
  getAllDeliveryLocations,
  getDeliveryLocationById,
  updateDeliveryLocation,
  deleteDeliveryLocation,
} from '../controllers/deliverLocationController';
import { isAuthenticated, isBuyer } from '../middleware/isAuthenticated';

const router = express.Router();

router.post('/',isAuthenticated, isBuyer, createDeliveryLocation);
router.get('/', getAllDeliveryLocations);
router.get('/:id', getDeliveryLocationById);
router.put('/:id', updateDeliveryLocation);
router.delete('/:id', deleteDeliveryLocation);

export default router;
