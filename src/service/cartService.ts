// File: order.service.ts

import {Cart } from '../models/cartModel';
import { Order } from '../models/orderModel';
import ShopProduct from '../models/shopProductModel';
import Product from '../models/productModel';
import * as orderUtils from '../utils/orderUtitls';
import { CartAttributes } from '../interfaces/cartInterface';
import Shop from '../models/shopModel';
import User from '../models/userModel';
import Market from '../models/marketModel';
import { OrderItem } from '../interfaces/orderInterface';

const createOrderFromCart = async (userId: string, locationLatitude:string, locationLongitude:string) => {
  const carts = await Cart.findAll({ where: { userId }}) ;
  if (!carts) throw new Error('Cart not found');

  let totalAmount = 0;
  let refundAmount = 0;
  let finalTransportCost = 3000;
  let transportCostCalculated = false;

   const enrichedCarts = await Promise.all(
      carts.map(async (cart) => {
        const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;

        const enrichedItems = await Promise.all(
          items.map(async (item: any) => {
            const shopProduct: any = await ShopProduct.findOne({
              where: {id: item.productId },
              include: [
                {
                    model: Product, as: 'productName',
                    // attributes: ['productName'],
                },

                {
                    model: Shop,as: 'shopName',
                    include: [
                    { model: User, as: 'seller' },
                    { model: Market, as: 'market'}
                    ],
                }
                ]
            });
                // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<",shopProduct)
            return {
              ...item,
              marketName: shopProduct?.shopName?.market || null,
              generalStatus: "Available" ,
              processingStatus: "pending",
              agentComment: '',
              buyerComment: ''
            };
          })
        );

        return {
          ...cart.toJSON(),
          items: enrichedItems,
        };
      })
    );

  const serviceCost = orderUtils.calculateServiceCost(carts[0].totalAmount);
   const transportCost = orderUtils.calculateTransportCost(
     enrichedCarts[0].items[0].marketName?.locationLatitude,
     enrichedCarts[0].items[0].marketName?.locationLongitude,
     locationLatitude,
     locationLongitude
    );
    const paidAmount = carts[0].totalAmount + serviceCost + transportCost.cost;

console.log("transport cost",transportCost)

  const order = await Order.create({
    buyerId: userId,
    items:enrichedCarts[0].items,
    totalAmount:carts[0].totalAmount,
    refundAmount,
    paidAmount,
    transportCost:transportCost.cost,
    serviceCost,
    agentCommission:Math.round(serviceCost/5),
    paymentTransaction: '',
    paymentStatus: 'Pending',
    orderProcessingStatus: 'Pending',
    locationLatitude,
    locationLongitude,
  });

  return order;
};

const getClientOrders = async (userId: string) => {
  return Order.findAll({ where: { buyerId: userId }, include: ['buyer', 'agent', 'messenger'] });
};

const updatePaymentStatus = async (orderId: string, status:"Pending" | "Verification" | "Paid" | "Rejected") => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  order.paymentStatus = status;
  await order.save();
  return order;
};

const assignAgent = async (orderId: string, agentId: string) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  order.agentId = agentId;
  order.orderProcessingStatus = 'Assigned to Agent';
  await order.save();
  return order;
};

const assignDriver = async (orderId: string, driverId: string) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  order.driverId = driverId;
  await order.save();
  return order;
};

const updateOrderStatus = async (orderId: string, status:"Pending" | "Assigned to Agent" | "Shopping" | "Shipping" | "Delivered") => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');
  order.orderProcessingStatus = status;
  await order.save();
  return order;
};

const updateOrderItemStatus = async (orderId: string, productId: string, updates: Partial<OrderItem>) => {
  const order = await Order.findByPk(orderId);
  if (!order) throw new Error('Order not found');

  console.log("000000000000000000000000000000000000000000000000000",order)
   const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
  const updatedItems: OrderItem[] = items.map((item: { productId: string; generalStatus: string; processingStatus: string; totalPrice: number; }) => {
    if (item.productId === productId) {
         
      const updatedItem = { ...item, ...updates };

      const shouldRefund =
        updatedItem.generalStatus === 'Not available' ||
        updatedItem.processingStatus === 'Cancelled';

      if (shouldRefund && item.generalStatus !== 'Not available' && item.processingStatus !== 'Cancelled') {
        order.totalAmount -= item.totalPrice;
        order.refundAmount += item.totalPrice;
      }

      return updatedItem;
    }
    return item;
  });

  order.items = updatedItems;
  order.serviceCost = orderUtils.calculateServiceCost(order.totalAmount);
  order.paidAmount = order.totalAmount + order.serviceCost + order.transportCost;
  await order.save();

  return order;
};







export default {
  createOrderFromCart,
  getClientOrders,
  updatePaymentStatus,
  updateOrderItemStatus,
  assignAgent,
  assignDriver,
  updateOrderStatus
};

