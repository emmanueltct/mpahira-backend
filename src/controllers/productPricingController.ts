import { Request, Response } from "express";
import ProductPricing from "../models/productPricing";


export const createProductPricing = async (req: Request, res: Response) => {
  try {
    const {isDefaultSelection,maxPrice,minPrice,productId,subUnitId,unitId,unitPrice}=req.body
    const productPricing = await ProductPricing.create({isDefaultSelection,
      maxPrice:Number(maxPrice??0),
      minPrice:Number(minPrice??0),
      productId,
      subUnitId,
      unitId,
      unitPrice:Number(unitPrice??0)
    });
    res.status(201).json({message:"product pricing is created successful",
                        unit:productPricing});
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};

export const getProductPricings = async (req: Request, res: Response) => {
  try {
    const units = await ProductPricing.findAll({ include: ["product", "unit", "subUnit"] });
     res.json({units});
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};

export const getProductPricingById = async (req: Request, res: Response) => {
  try {
    const unit = await ProductPricing.findByPk(req.params.id, { include: ["product", "unit", "subUnit"] });
    if (!unit){ 
        res.status(404).json({ message: "Not found" }); 
        return
    }
    res.json(unit);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductPricing = async (req: Request, res: Response) => {
  try {
    const unit = await ProductPricing.findByPk(req.params.id);
    if (!unit){ 
         res.status(404).json({ message: "Not found" }); 
        return
}

    await unit.update(req.body);
    res.json(unit);
  } catch (error: any) {
     res.status(500).json({ error: error.message });
  }
};

export const deleteProductPricing = async (req: Request, res: Response) => {
  try {
    const unit = await ProductPricing.findByPk(req.params.id);
    if (!unit){ res.status(404).json({ message: "Not found" })
        return
    };

    await unit.destroy();
     res.json({ message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
