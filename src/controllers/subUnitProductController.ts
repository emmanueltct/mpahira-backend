// File: controllers/subUnitProductController.ts
import { Request, Response } from "express";

import UnitProduct from "../models/unitProductModel";
import { SubUnitProduct } from "../models/SubUnitProducts";


  // Create
export const  createSubUnit=async(req: Request, res: Response)=> {
    try {
      const { unitId, subUnit,description } = req.body;

      const subUnitProduct = await SubUnitProduct.create({unitId,subUnit,subUnitDescription:description});

       res.status(201).json({
        success: true,
        message: "SubUnitProduct created successfully",
        data: subUnitProduct,
      });
    } catch (error: any) {
      console.log(error)
       res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get all
export const getAllSubUnit=async(req: Request, res: Response)=>{
    try {
      const subUnitProducts = await SubUnitProduct.findAll({
        include: [{ model: UnitProduct, as: "units" }],
      });

       res.status(200).json({
        success: true,
        data: subUnitProducts,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Get one
export const getOneSubUnit=async(req: Request, res: Response)=>{
    try {
      const { id } = req.params;

      const subUnitProduct = await SubUnitProduct.findByPk(id, {
        include: [{ model: UnitProduct, as: "units" }],
      });

      if (!subUnitProduct) {
         res.status(404).json({ success: false, message: "SubUnitProduct not found" });
         return
      }

       res.status(200).json({ success: true, data: subUnitProduct });
    } catch (error: any) {
       res.status(500).json({ success: false, message: error.message });
    }
  }

  // Update
export const updateSubUnit=async(req: Request, res: Response)=>{
    try {
      const { id } = req.params;
      const { subUnit } = req.body;

      const subUnitProduct = await SubUnitProduct.findByPk(id);

      if (!subUnitProduct) {
         res.status(404).json({ success: false, message: "SubUnitProduct not found" });
         return
      }

      await subUnitProduct.update({ subUnit });

       res.status(200).json({
        success: true,
        message: "SubUnitProduct updated successfully",
        data: subUnitProduct,
      });
    } catch (error: any) {
       res.status(500).json({ success: false, message: error.message });
    }
  }

  // Delete
export const deleteSubUnit=async(req: Request, res: Response)=>{
    try {
      const { id } = req.params;

      const subUnitProduct = await SubUnitProduct.findByPk(id);

      if (!subUnitProduct) {
        res.status(404).json({ success: false, message: "SubUnitProduct not found" });
        return 
      }

      await subUnitProduct.destroy();

      res.status(200).json({
        success: true,
        message: "SubUnitProduct deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

