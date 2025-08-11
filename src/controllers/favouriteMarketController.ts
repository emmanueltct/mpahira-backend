import { Request, Response } from 'express';
import { FavauriteMarket } from '../models/FavauriteMarket';

export const createFavourite = async (req: Request, res: Response) => {
  try {
      const buyerId = (req as any).user.id;
      const marketId=req.body.marketId
    const favourite = await  FavauriteMarket.create({buyerId,marketId});
    res.status(201).json(favourite);
  } catch (error) {
    res.status(500).json({ message: 'Error creating favourite market', error });
  }
};

export const getAllFavourites = async (_: Request, res: Response) => {
  try {
    const all = await  FavauriteMarket.findAll();
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favourites', error });
  }
};

export const getFavouriteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await  FavauriteMarket.findByPk(id);
    if (!record){
        res.status(404).json({ message: 'Favourite not found' });
        return 
    } 
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favourite', error });
  }
};

export const updateFavourite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [updated] = await  FavauriteMarket.update(req.body, { where: { id } });
    if (!updated) { res.status(404).json({ message: 'Favourite not found' });
      return
    }
    const updatedRecord = await  FavauriteMarket.findByPk(id);
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error updating favourite', error });
  }
};

export const deleteFavourite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await  FavauriteMarket.destroy({ where: { id } });
    if (!deleted) {
         res.status(404).json({ message: 'Favourite not found' });
        return 
    }
    res.status(200).json({ message: 'Favourite deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting favourite', error });
  }
};
