
// File: routes/cart.route.ts
import express from 'express';
import { createCart,  updateCartItemQuantity, removeCartItem, deleteCart, viewCarts } from '../controllers/cartContoller';
import {isAuthenticated, isBuyer } from '../middleware/isAuthenticated';
import { isValidCartOption } from '../middleware/is ValidCartOption';

const router = express.Router();

router.post('/', isAuthenticated, isBuyer, isValidCartOption, createCart);
router.get('/', isAuthenticated, viewCarts);
// router.put('/update', isAuthenticated, isBuyer, updateCartItem);
router.patch('/update', isAuthenticated, updateCartItemQuantity);
router.delete('/:productId', isAuthenticated, removeCartItem);
router.delete('/delete', isAuthenticated, deleteCart);
export default router;