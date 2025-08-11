import { Request, Response } from 'express';
import { ShopAttributes } from '../interfaces/shopInterface';
import Shop from '../models/shopModel';
import Product from '../models/productModel';
import User from '../models/userModel';
import Market from '../models/marketModel';


// Create a new Shop
export const createShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandName,marketId } = req.body;
    const loggedSeller=req.user as any
    const sellerId=loggedSeller.id
    const newShop = await Shop.create({ brandName,sellerId,marketId });
    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Shop', error });
  }
};

// Get all Shops
export const getAllShops = async (_req: Request, res: Response): Promise<void> => {
  try {
    const Shops: ShopAttributes[] = await Shop.findAll({
      include: [{ model: User, as: 'seller' },
           { model: Market, as: 'market'}]
    });
    res.status(200).json(Shops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Shops', error });
  }
};

// Get Shop by ID
export const getShopById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Shop', error });
  }
};

// get shop by sellers 

export const getShopBySeller=async (req: Request, res: Response): Promise<void> => {
  try{
    const Shops: ShopAttributes[] = await Shop.findAll({ where: { sellerId: req.params.id } });
    res.status(200).json(Shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get seller Shops', error });
  }
}


// Update an existing Shop by ID
export const updateShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { Shop } = req.body;

    const existingShop = await Shop.findByPk(id);
    if (!existingShop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    // Check if the new Shop name already exists (and is not the same as current)
    // const duplicate = await Shop.findOne({ where: { brand } });
    // if (duplicate && duplicate.id !== id) {
    //   res.status(409).json({ message: 'Shop name already in use' });
    //   return;
    // }

    await existingShop.update(req.body);
   

    res.status(200).json({ message: 'Shop updated successfully', Shop: existingShop });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update Shop', error });
  }
};

// Delete a Shop by ID
export const deleteShop = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deleted = await Shop.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Shop', error });
  }
};
