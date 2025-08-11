// File: order.routes.ts
import { Router } from 'express';
import * as orderController from '../controllers/orderControllers';
import { assignAgentSchema, paymentStatusSchema, orderStatusSchema, assignDriverSchema, orderItemUpdateSchema } from '../validations/orderValidation'
import { authenticateUser, isAdmin, isAgent, isAuthenticated, isBuyer } from '../middleware/isAuthenticated';
import { zodValidate } from '../middleware/isValidOrder';

const orderRouter = Router();

orderRouter.post('/', isAuthenticated, orderController.createOrderFromCart);
orderRouter.get('/:userId',isAuthenticated, orderController.getClientOrders);
orderRouter.patch('/:orderId/payment-status',  isAuthenticated, isAdmin, zodValidate(paymentStatusSchema), orderController.updatePaymentStatus);
orderRouter.patch('/:orderId/assign-agent', authenticateUser, isAdmin, zodValidate(assignAgentSchema), orderController.assignAgent);
orderRouter.patch('/:orderId/assign-driver', authenticateUser, isAgent, zodValidate(assignDriverSchema), orderController.assignDriver);
orderRouter.patch('/:orderId/status', authenticateUser, isAgent, zodValidate(orderStatusSchema), orderController.updateOrderStatus);
orderRouter.patch('/:orderId/item/:productId',isAuthenticated, isBuyer, zodValidate(orderItemUpdateSchema), orderController.updateOrderItemStatus);
export default orderRouter;


;


