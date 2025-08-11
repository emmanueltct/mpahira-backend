import { Request, Response } from 'express';
import Market from '../models/marketModel';

export const createMarket = async (req: Request, res: Response) => {
  try {
    const {
  marketName,
  province,
  district,
  sector,
  marketThumbnail,
  classification,
  locationLongitude,
  locationLatitude,
  googleMapCoordinate
} = req.body;

// console.log("tttttttttttttttttttttttttttttttttttttttttttttt",req.body)
const market = await Market.create({
  marketName,
  province,
  district,
  sector,
  marketThumbnail,
  classification,
  locationLongitude,
  locationLatitude,
  googleMapCoordinate
});

    res.status(201).json(market);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create market', error });
  }
};

export const getMarkets = async (_req: Request, res: Response) => {
  try {
    const markets = await Market.findAll();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch markets', error });
  }
};

export const getMarketById = async (req: Request, res: Response):Promise<void> => {
  try {
    const market = await Market.findByPk(req.params.id);
    if (!market){
        res.status(404).json({ message: 'Market not found' });
        return
    } 

    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch market', error });
  }
};

export const updateMarket = async (req: Request, res: Response) => {
  try {
    const market = await Market.findByPk(req.params.id);
     if (!market){
        res.status(404).json({ message: 'Market not found' });
        return
    } 
    await market.update(req.body);
    res.status(200).json(market);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update market', error });
  }
};

export const deleteMarket = async (req: Request, res: Response) => {
  try {
    const market = await Market.findByPk(req.params.id);
     if (!market){
        res.status(404).json({ message: 'Market not found' });
        return
    } 
    await market.destroy();
    res.status(200).json({ message: 'Market deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete market', error });
  }
};
