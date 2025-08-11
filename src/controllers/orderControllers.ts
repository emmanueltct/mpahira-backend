
// File: order.controller.ts
import { Request, Response } from 'express';
import orderService from '../service/orderService';

export const createOrderFromCart = async (req: Request, res: Response) => {
  try {
      const userId = (req as any).user.id;
    const order = await orderService.createOrderFromCart(userId);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err});
  }
};

export const getClientOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getClientOrders(req.params.userId);
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err});
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updatePaymentStatus(req.params.orderId, req.body.paymentStatus);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const assignAgent = async (req: Request, res: Response) => {
  try {
    const order = await orderService.assignAgent(req.params.orderId, req.body.agentId);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const assignDriver = async (req: Request, res: Response) => {
  try {
    const order = await orderService.assignDriver(req.params.orderId, req.body.driverId);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.orderId, req.body.orderProcessingStatus);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};


export const updateOrderItemStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, productId } = req.params;
    const updates = req.body;
    console.log("88888888888888888888888888888888888888888888888",updates)
    const order = await orderService.updateOrderItemStatus(orderId, productId, updates);
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
