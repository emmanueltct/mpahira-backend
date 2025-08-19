import { Request, Response } from "express";
import Driver from "../models/driverModel";
import orderService from "../service/orderService";


// Find driver by telephone
export const findAllDriver=async (req: Request, res: Response)=>{
     try {
    const driver = await Driver.findAll();

    if (!driver) {
     res.status(404).json({ message: "Driver not found" });
      return 
    }

     res.json(driver);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
    return 
  }
}
export const findDriver = async (req: Request, res: Response) => {
  try {
    const { telephone } = req.params;
    const driver = await Driver.findOne({ where: { telephone } });

    if (!driver) {
     res.status(404).json({ message: "Driver not found" });
      return 
    }

     res.json(driver);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
  }
};

// Create new driver
export const createDriver = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, telephone, plateNumber } = req.body;
    const {orderId}=req.params
    const existing = await Driver.findOne({ where: { telephone } });
    if (existing) {
      res
        .status(400)
        .json({ message: "Driver already exists with this phone number" });
        return
    }

    const driver = await Driver.create({
      firstName,
      lastName,
      telephone,
      plateNumber,
    });
        if (!driver) {
      res.status(404).json({ message: "Driver not found" });
      return 
    }
  
     const order = await orderService.assignDriver(orderId, driver.id);
     res.json({
        message:"Shopping for this order has been successfully completed.",
        driver,
        order 
        });
     res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Use existing driver (assign)
export const useExistingDriver = async (req: Request, res: Response) => {
  try {
    const { telephone } = req.body;
    const {orderId}=req.params
    const driver = await Driver.findOne({ where: { telephone } });

    if (!driver) {
      res.status(404).json({ message: "Driver not found" });
      return 
    }
  
     const order = await orderService.assignDriver(orderId, driver.id);
     res.json({
        message:"Shopping for this order has been successfully completed.",
        driver,
        order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
