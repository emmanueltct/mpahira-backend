import { Request, Response } from "express";
import RecommendProduct from "../models/RecommendProduct";
import { Market, Product, Shop, ShopProduct, User } from "../models/associations";


// CREATE recommendation
export const createRecommendProduct = async (req: Request, res: Response) => {
  try {
    const product = await RecommendProduct.create(req.body);
     res.status(201).json(product);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};

// GET all recommendations
export const getAllRecommendProducts = async (req: Request, res: Response) => {
  try {
    const products = await RecommendProduct.findAll({
      include: [
  
        { model: ShopProduct, as: "recommendedProduct" },
      ],
    });
     res.status(200).json(products);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};

// GET by ID
export const getRecommendProductById = async (req: Request, res: Response) => {
  try {
    const product = await RecommendProduct.findAll(
      {
     where:{shopProductId:req.params.id},
      include: [
      
        { model: ShopProduct, as: "recommendedProduct",

        include:[ {
          model: Product,
          as: "productName",
        },
        
        {
          model: Shop,
          as: "shopName",
          include: [
            // {
            //   model: User,
            //   as: "seller",
            //   attributes: ["id", "firstName", "lastName", "telephone", "email", "profilePic"],
            // },
            {
              model: Market,
              as: "market",
              attributes: [
                "id",
                "marketName",
              ],
            },
          ],
        },
       ]
         }
      ],
    });

    if (!product) {
     res.status(404).json({ message: "Recommendation product not found" });
      return 
    }

     res.status(200).json(product);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateRecommendProduct = async (req: Request, res: Response) => {
  try {
    const product = await RecommendProduct.findByPk(req.params.id);

    if (!product) {
      res.status(404).json({ message: "Recommendation product not found" });
       return
    }

    await product.update(req.body);
     res.status(200).json(product);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteRecommendProduct = async (req: Request, res: Response) => {
  try {
    const product = await RecommendProduct.findByPk(req.params.id);

    if (!product) {
       res.status(404).json({ message: "Recommendation product not found" });
       return
    }

    await product.destroy();
     res.status(200).json({ message: "Recommendation product deleted" });
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};
