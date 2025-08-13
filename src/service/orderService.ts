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
import { DeliveryLocation } from '../models/DeliveryLocation';

const createOrderFromCart = async (userId: string, reference:string, status: "pending" | "Success" | "Cancelled",amount:string) => {
  const carts = await Cart.findAll({ where: { userId }}) ;
 
  if (!carts) throw new Error('Cart not found');

  
  let refundAmount = 0;

    let items: any[] = [];

   const enrichedCarts = await Promise.all(
      carts.map(async (cart) => {
        // const items = typeof cart.items === 'string' ? JSON.parse(cart.items) : cart.items;

         try {
         const parsedItems = JSON.parse(cart.items);

          items = Array.isArray(parsedItems) ? parsedItems : [parsedItems];
        } catch (err) {
          console.log(`Error parsing cart items for cart id ${cart.id}:`, err);
          items = [];
        }

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

    

  const order = await Order.create({
    buyerId: userId,
    items:JSON.stringify(enrichedCarts[0].items),
    totalAmount:carts[0].totalAmount,
    refundAmount,
    paidAmount:Number(amount),
    transportCost:carts[0].transportCost,
    serviceCost:carts[0].serviceCost,
    agentCommission:Math.round(carts[0].serviceCost/5),
    paymentTransaction:reference,
    paymentStatus:status ,
    orderProcessingStatus: 'Pending',
    deliverylocationId:carts[0].deliverylocationId,
    deliveryDistance:carts[0].deliveryDistance,
    generalTotal:carts[0].generalTotal,
  });
  

  return order;
};

const getClientOrders = async (userId: string, role:string) => {


    let orders;
    if (role=== 'Buyer') {
       orders = await Order.findAll({ where: {buyerId:userId } ,
         include: [{ model: User, as:"buyer" },
          // { model: DeliveryLocation, as:"location" }
        ]
        });
      
    } else if (['Admin', 'Seller', 'Agent'].includes(role)) {
      orders= await Order.findAll({
        include: [{ model: User, as:"buyer" },
        //  { model: DeliveryLocation, as:"location" }
        ],
      });
    } else {
       throw new Error('Access Denied');
       return 
    }

      const enrichedOrders = await Promise.all(
      orders.map(async (cart) => {
        let items: any[] = [];

        try {
          const parsedItems = JSON.parse(cart.items);

          items = Array.isArray(parsedItems) ? parsedItems : [parsedItems];
        } catch (err) {
          console.error(`Error parsing cart items for cart id ${cart.id}:`, err);
          items = [];
        }

        const enrichedItems = await Promise.all(
          items.map(async (item: any) => {
            const shopProduct = await ShopProduct.findOne({
              where: { id: item.productId },
              include: [
                { model: Product, as: "productName" },
                {
                  model: Shop,
                  as: "shopName",
                  include: [
                    { model: User, as: "seller" },
                    { model: Market, as: "market" },
                  ],
                },
              ],
            });

            return {
              ...item,
              ShopProduct: shopProduct ?? null,
              shopName: shopProduct?.shopName ?? null,
              shopOwner: shopProduct?.shopName?.seller ?? null,
              marketName: shopProduct?.shopName?.market ?? null,
            };
          })
        );

        return {
          ...cart.toJSON(),
          items: enrichedItems,
        };
      })
    );

  return enrichedOrders;
};

const updatePaymentStatus = async (orderId: string, status:"pending" | "Success" | "Cancelled") => {
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

  order.items =JSON.stringify(updatedItems);
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

