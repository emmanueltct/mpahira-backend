import { Request, Response } from 'express';
import { unitProductAttribute } from '../interfaces/unitProductInterface';
import { SubUnitProduct, UnitProduct } from '../models/associations';


// Create a new Unit product
export const createProductUnit = async (req: Request<{}, {}, Pick<unitProductAttribute, 'unitProduct'|'unitProductDescription'>>, res: Response): Promise<void> => {
  try {
    const { unitProduct,unitProductDescription } = req.body;
    console.log("_______________________",unitProductDescription)
    const newUnitProduct = await UnitProduct.create({ unitProduct,unitProductDescription });
    res.status(201).json(newUnitProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating unit product', error });
  }
};

// Get all Unit products
export const getAllProductUnits = async (_req: Request, res: Response): Promise<void> => {
  try {
    const unitProducts: unitProductAttribute[] = await UnitProduct.findAll({
      include: [
        {
          model: SubUnitProduct,
          as: "subUnits", // 👈 make sure alias matches association
        },
      ],
    });
    res.status(200).json(unitProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unit products', error });
  }
};

// Get Unit product by ID
export const getProductUnitById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const unitProduct = await UnitProduct.findByPk(req.params.id,{
      
      include: [
        {
          model: SubUnitProduct,
          as: "subUnits", // 👈 make sure alias matches association
        },
      ],
    
    });
    if (!unitProduct) {
      res.status(404).json({ message: 'Unit product not found' });
      return;
    }
    res.status(200).json(unitProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unit product', error });
  }
};

// Update an existing Unit product by ID
export const updateProductUnit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { unitProduct } = req.body;

    const  existingUnitProduct = await UnitProduct.findByPk(id);
    if (!existingUnitProduct ) {
      res.status(404).json({ message: 'Unit product not found' });
      return;
    }

    // Check if the new Unit product name already exists (and is not the same as current)
    const duplicate = await UnitProduct.findOne({ where: { unitProduct } });
    if (duplicate && duplicate.id !== id) {
      res.status(409).json({ message: 'Unit Product name already in use' });
      return;
    }

    existingUnitProduct.unitProduct = unitProduct;
    await existingUnitProduct.save();

    res.status(200).json({ message: 'Unit Product updated successfully', UnitProduct: existingUnitProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update unit Product', error });
  }
};

// Delete unit product by ID
export const deleteProductUnit = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deleted = await UnitProduct.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ message: 'Unit product not found' });
      return;
    }
    res.status(200).json({ message: 'Unit product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting unit product', error });
  }
};
