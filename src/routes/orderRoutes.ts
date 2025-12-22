// File: order.routes.ts
import { Router } from 'express';
import * as orderController from '../controllers/orderControllers';
import { assignAgentSchema, paymentStatusSchema, orderStatusSchema, assignDriverSchema, orderItemUpdateSchema } from '../validations/orderValidation'
import { authenticateUser, isAdmin, isAgent, isAuthenticated, isBuyer } from '../middleware/isAuthenticated';
import { zodValidate } from '../middleware/isValidOrder';

const orderRouter = Router();

orderRouter.post('/', isAuthenticated, orderController.createOrderFromCart);
orderRouter.get('/',isAuthenticated, orderController.getClientOrders);
orderRouter.get("/:id",isAuthenticated, orderController.getSingleClientOrders)
orderRouter.patch('/:orderId/payment-status',  isAuthenticated, isAdmin, zodValidate(paymentStatusSchema), orderController.updatePaymentStatus);
orderRouter.patch('/:orderId/assign-agent', isAuthenticated,isAdmin, zodValidate(assignAgentSchema), orderController.assignAgent);
orderRouter.patch('/:orderId/assign-driver', isAuthenticated, isAgent, zodValidate(assignDriverSchema), orderController.assignDriver);
orderRouter.patch('/:orderId/status', isAuthenticated, isAgent, zodValidate(orderStatusSchema), orderController.updateOrderStatus);
orderRouter.patch('/:orderId/item/:productId',isAuthenticated, isBuyer, zodValidate(orderItemUpdateSchema), orderController.updateOrderItemStatus);

export default orderRouter;





