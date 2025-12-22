import { Request, Response } from 'express';
import { productAttribute } from "../interfaces/productInterface";
import Product from '../models/productModel';

import ProductSubCategory from '../models/ProductSubCategory';
import { Market, ProductPricing, Shop, ShopProduct, SubUnitProduct, UnitProduct, User } from '../models/associations';


// Create a new product
export const createProduct = async (req: Request<{}, {}, Pick<productAttribute, 'product'|'productKinyLabel'>>, res: Response): Promise<void> => {
  try {
    const { product,productKinyLabel} = req.body;
    const newproduct = await Product.create({ product,productKinyLabel });
    res.status(201).json(newproduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Get all products
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: productAttribute[] = await Product.findAll({
          include:[{model:ProductSubCategory, as:"productSubCategory",
            include: [
            {
              model:ShopProduct,
              as:"shopProduct",
              include:[
                {
              model: Shop,
              as: "shopName",
              include: [
                    {
                      model: Market,
                      as: "market",
                      attributes: [
                        "id","marketName"
                      ],
                    },
                  ],
            },
            {
              model: ProductPricing,
              as: "productUnities",
              include: [
                { model: UnitProduct, as: "unit" },
                { model: SubUnitProduct, as: "subUnit" },
              ],
            }],

              }],
              }],
          order: [['createdAt', 'DESC']], // or any column you want to sort by
        });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ID
export const getProductById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'product not found' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Update an existing product by ID
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { product } = req.body;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      res.status(404).json({ message: 'product not found' });
      return;
    }

    // Check if the new product name already exists (and is not the same as current)
    const duplicate = await Product.findOne({ where: { product } });
    if (duplicate && duplicate.id !== id) {
      res.status(409).json({ message: 'product name already in use' });
      return;
    }

    existingProduct.product = product;
    await existingProduct.save();

    res.status(200).json({ message: 'product updated successfully', product: existingProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      res.status(404).json({ message: 'product not found' });
      return;
    }
    res.status(200).json({ message: 'product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
