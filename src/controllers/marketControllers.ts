import { Request, Response } from 'express';
import Market from '../models/marketModel';
import { uploadToCloudinary } from '../utils/uploadImage';

export const createMarket = async (req: Request, res: Response) => {
  try {

     const folderName="products/markets"
        if (!req.file) {
          res.status(400).json({ message: 'No file uploaded' });
          return
        }
    
  const result = await uploadToCloudinary(req.file.buffer, req.file.originalname,folderName);

        
    const {
  marketName,
  province,
  district,
  sector,
  classification,
  locationLongitude,
  locationLatitude,
  googleMapCoordinate
} = req.body;

if(result.secure_url){
  

const market = await Market.create({
  marketName,
  province,
  district,
  sector,
  marketThumbnail:result.secure_url,
  classification,
  locationLongitude,
  locationLatitude,
  googleMapCoordinate
});
  res.status(201).json(market);
}else{
 res.status(500).json({error: "something went wrong with uplodng image to the server and product not created please try again"}); 
}

  
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
