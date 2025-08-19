import { Request, Response } from 'express';
import {DeliveryLocation} from '../models/DeliveryLocation';
import { Cart } from '../models/cartModel';
import * as cartUtils from '../utils/cartUtils';
import Shop from '../models/shopModel';
import Market from '../models/marketModel';
import ShopProduct from '../models/shopProductModel';
import User from '../models/userModel';

export const createDeliveryLocation = async (req: Request, res: Response) => {
  try {
     const {
      locationLongitude,
      locationLatitude,
      googleMapCoordinate,
      streetNumber,
      nearestLandmark,
      locationDescription,
    } = req.body;
      const buyerId = (req as any).user.id;
    const location = await DeliveryLocation.create({
      buyerId,
      locationLongitude,
      locationLatitude,
      googleMapCoordinate,
      streetNumber,
      nearestLandmark,
      locationDescription,
    });

  
       let cart = await Cart.findOne({ where: { userId:buyerId }})
     
      if(cart){
            const items = typeof cart?.items === 'string' ? JSON.parse(cart.items) : cart?.items;
           const shopProduct: any = await ShopProduct.findOne({
              where: {id: items[0].productId },
                include:{
                    model: Shop,as: 'shopName',
                    include: [
                    { model: User, as: 'seller' },
                    { model: Market, as: 'market'}
                    ],
                }
            });
           
           const transportCost = cartUtils.calculateTransportCost(
                shopProduct.shopName.market.locationLatitude,
                shopProduct.shopName.market.locationLongitude,
                locationLatitude,
                locationLongitude
        
              );
              const updatedGeneralTotal = cart?.totalAmount + cart.serviceCost + transportCost.cost;

              await cart?.update({deliverylocationId:location.id, transportCost: transportCost.cost, deliveryDistance:transportCost.distance, generalTotal: updatedGeneralTotal,});
            }


       res.status(201).json(location);
       return
    
    
  
  } catch (error) {
    res.status(500).json({ message: 'Error creating buyer location', error });
  }
};

export const getAllDeliveryLocations = async (_: Request, res: Response) => {
  try {
    const locations = await DeliveryLocation.findAll();
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations', error });
  }
};

export const getLocationsByBuyerId = async (req: Request, res: Response) => {
  try {
    const { buyerId } = req.params;

    const locations = await DeliveryLocation.findAll({
      where: { buyerId },
      order: [['createdAt', 'DESC']], // optional: latest first
    });

    if (locations.length === 0) {
       res.status(404).json({ message: 'No saved locations for this buyer' });
      return
    }

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving buyer locations', error });
  }
};

export const getDeliveryLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await DeliveryLocation.findByPk(id);
    if (!location) { res.status(404).json({ message: 'Location not found' });
         return
    }
    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching location', error });
  }
};

export const updateDeliveryLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await DeliveryLocation.update(req.body, { where: { id } });
    if (!updated){ res.status(404).json({ message: 'Location not found' });
     return
    }
    const updatedLocation = await DeliveryLocation.findByPk(id);
    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error });
  }
};

export const deleteDeliveryLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await DeliveryLocation.destroy({ where: { id } });
    if (!deleted) {res.status(404).json({ message: 'Location not found' });
     return
    }
    res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error });
  }
};
