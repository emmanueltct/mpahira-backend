

// File: controllers/cart.controller.ts
import { Request, Response } from 'express';
import { Cart } from '../models/cartModel';
import Product from '../models/productModel';
import ShopProduct from '../models/shopProductModel';
import { cartSchema, removeItemSchema, updateItemSchema } from '../validations/cartValidation';
import { CartItem } from '../interfaces/cartInterface';
import * as cartUtils from '../utils/cartUtils';
import User from '../models/userModel';
import Shop from '../models/shopModel';
import Market from '../models/marketModel';
import { DeliveryLocation } from '../models/DeliveryLocation';
import { v4 as uuidv4 } from 'uuid';
import { isTypedArray } from 'util/types';



export const createCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = cartSchema.safeParse(req.body);
    if (!result.success) {
       res.status(400).json({ errors: result.error.flatten() });
       return
    }

    const { items, totalAmount } = result.data;

    const product = await ShopProduct.findOne({
      where: { id: items.productId },
      include: [
        {
          model: Shop,
          as: 'shopName',
          include: [{ model: Market, as: 'market' }],
        },
      ],
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return 
    }

   
    const newItem = {
      productId: items.productId,
      quantity: items.quantity,
      unit: items.unit,
      unitPrice: items.unitPrice,
      totalPrice: items.quantity * items.unitPrice,
    };

    let cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      const lastDeliveryLocation = await DeliveryLocation.findOne({
        where: { buyerId: userId },
        order: [['createdAt', 'DESC']],
      });

      const transportCost = cartUtils.calculateTransportCost(
        product.shopName.market?.locationLatitude,
        product.shopName.market?.locationLongitude,
        lastDeliveryLocation?.locationLatitude||"",
        lastDeliveryLocation?.locationLongitude || ""

      );

      const serviceCost = cartUtils.calculateServiceCost(newItem.totalPrice);
      const generalTotal = newItem.totalPrice + serviceCost + transportCost.cost;

      const newCart = await Cart.create({
        userId,
        deliverylocationId: lastDeliveryLocation?.id,
        items: JSON.stringify(newItem),
        totalAmount: newItem.totalPrice,
        serviceCost,
        transportCost: transportCost.cost,
        deliveryDistance:transportCost.distance,
        generalTotal,
      });

       res.status(201).json({ message: 'Cart created and item added', cart: newCart });
       return
    }

    // Parse existing items if stored as JSON string
    let existingItems: any[] = [];
    const items2 =  JSON.parse(cart.items)
     existingItems = Array.isArray(items2) ? items2 : [items2];
    const alreadyExists = existingItems.some((item: any) => item.productId === newItem.productId);
    if (alreadyExists) {
       res.status(400).json({ message: 'Product already exists in cart' });
       return
    }

    const updatedItems = [...existingItems, newItem];
    const updatedTotal = updatedItems.reduce((sum: number, item: any) => sum + item.totalPrice, 0);
    const updatedServiceCost = cartUtils.calculateServiceCost(updatedTotal);
    const updatedGeneralTotal = updatedTotal + updatedServiceCost + cart.transportCost;

    await cart.update({
      items: JSON.stringify(updatedItems),
      totalAmount: updatedTotal,
      serviceCost: updatedServiceCost,
      generalTotal: updatedGeneralTotal,
    });

     res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    console.error('Cart creation error:', err);
     res.status(500).json({ message: 'Internal server error', error: err });
     return
  }
};











export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validation = updateItemSchema.safeParse(req.body);
  if (!validation.success) {
     res.status(400).json({ errors: validation.error.flatten() });
     return
  }
  const { productId, quantity } = validation.data;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart){
         res.status(404).json({ message: 'Cart not found' });
         return
    } 
    let items: any[] = [];

        try {
          const parsedItems = JSON.parse(cart.items);

          items = Array.isArray(parsedItems) ? parsedItems : [parsedItems];
        } catch (err) {
          console.error(`Error parsing cart items for cart id ${cart.id}:`, err);
          items = [];
        }
        const items2 =items;
    const updatedItems = items2.map((item: CartItem) =>(     
         item.productId === productId
        ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
        : item
    ));

      const updatedTotal = updatedItems.reduce((sum:number, i: { totalPrice: any; }) => sum + i.totalPrice, 0);

    const updatedServiceCost = cartUtils.calculateServiceCost(updatedTotal);
    const updatedGeneralTotal = updatedTotal + updatedServiceCost + cart.transportCost;
    await cart.update({ items:JSON.stringify(updatedItems), totalAmount: updatedTotal,serviceCost: updatedServiceCost,generalTotal: updatedGeneralTotal });

     res.status(200).json({ message: 'Item quantity updated', cart });
     return
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
     return
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const validation = removeItemSchema.safeParse(req.params);
  if (!validation.success){
     res.status(400).json({ errors: validation.error.flatten() });
     return
  } 
  const { productId } = validation.data;

  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart){
        res.status(404).json({ message: 'Cart not found' });
        return
    }

     let items: any[] = [];

    try {
      const parsedItems = JSON.parse(cart.items);

      items = Array.isArray(parsedItems) ? parsedItems : [parsedItems];
    } catch (err) {
      console.error(`Error parsing cart items for cart id ${cart.id}:`, err);
      items = [];
    }
     const items2 =items;

    const filteredItems = items2.filter((item: { productId: string; }) => item.productId !== productId);
    const updatedTotal = filteredItems.reduce((sum:number, i: { totalPrice: any; }) => sum + i.totalPrice, 0);

    const updatedServiceCost = cartUtils.calculateServiceCost(updatedTotal);
    const updatedGeneralTotal = updatedTotal + updatedServiceCost + cart.transportCost;

    await cart.update({ items: JSON.stringify(filteredItems), totalAmount: updatedTotal ,serviceCost: updatedServiceCost,generalTotal: updatedGeneralTotal });

     res.status(200).json({ message: 'Item removed from cart', cart });
     return
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return
  }
};

export const deleteCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart){
        res.status(404).json({ message: 'Cart not found' });
        return
    } 

    await cart.destroy();
    res.status(200).json({ message: 'Cart deleted' });
    return
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
     return
  }
};

export const viewCarts = async (req: Request, res: Response) => {
    const user = (req as any).user;

  try {
    let carts;
    
    if (user.role.role === 'Buyer') {
      carts = await Cart.findAll({ where: { userId:user.id } ,
         include: [{ model: User, as:"buyer" },{ model: DeliveryLocation, as:"location" }]
        });
    } else if (['Admin', 'Seller', 'Agent'].includes(user.role.role)) {
      carts = await Cart.findAll({
        include: [{ model: User, as:"buyer" },
         { model: DeliveryLocation, as:"location" }],
      });
    } else {
       res.status(403).json({ message: 'Access denied' });
       return
    }
    const enrichedCarts = await Promise.all(
      carts.map(async (cart) => {
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



    res.status(200).json({ carts: enrichedCarts });
    return;
  } catch (err) {
     res.status(500).json({ message: 'Server error', error: err });
     return
  }
};