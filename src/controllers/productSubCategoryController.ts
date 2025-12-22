import { Request, Response } from "express";
import  ProductSubCategory  from "../models/ProductSubCategory";
import { uploadToCloudinary } from "../utils/uploadImage";

// ➤ Create subcategory
export const createSubCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, subCategoryEng, subCategoryKiny } = req.body;
    
      const folderName="products/productSubCategory"
        if (!req.file) {
          res.status(400).json({ message: 'No file uploaded' });
          return
        }
    
  const result = await uploadToCloudinary(req.file.buffer, req.file.originalname,folderName);

  console.log(result)

    const newSubCategory = await ProductSubCategory.create({
      categoryId,
      subCategoryEng,
      subCategoryKiny,
      imageUrl:result.secure_url
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      data: newSubCategory,
    });
  } catch (error: any) {
     res.status(500).json({ message: "Error creating subcategory", error: error.message });
  }
};

// ➤ Get all subcategories
export const getAllSubCategories = async (req: Request, res: Response) => {
  try {
    const subCategories = await ProductSubCategory.findAll();
     res.status(200).json(subCategories);
  } catch (error: any) {
     res.status(500).json({ message: "Error fetching subcategories", error: error.message });
  }
};

// ➤ Get subcategory by ID
export const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subCategory = await ProductSubCategory.findByPk(id);

    if (!subCategory) {
     res.status(404).json({ message: "Subcategory not found" });
       return
    }

    res.status(200).json(subCategory);
  } catch (error: any) {
     res.status(500).json({ message: "Error fetching subcategory", error: error.message });
  }
};

// ➤ Update subcategory
export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { subCategoryEng, subCategoryKiny, categoryId } = req.body;

    const subCategory = await ProductSubCategory.findByPk(id);
    if (!subCategory) {
       res.status(404).json({ message: "Subcategory not found" });
       return
    }

    // check if file is uploaded
    const folderName="products/productSubCategory"
    let imageUrl = subCategory.imageUrl; // keep old image
    if (req.file) {
       const result = await uploadToCloudinary(req.file.buffer, req.file.originalname,folderName);
      imageUrl = result.secure_url; 
      // ✅ if you use Cloudinary, replace this with the secure_url after upload
    }

    await subCategory.update({
      subCategoryEng,
      subCategoryKiny,
      categoryId,
      imageUrl,
    });

    res.status(200).json({
      message: "Subcategory updated successfully",
      data: subCategory,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating subcategory",
      error: error.message,
    });
  }
};

// ➤ Delete subcategory
export const deleteSubCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subCategory = await ProductSubCategory.findByPk(id);
    if (!subCategory) {
       res.status(404).json({ message: "Subcategory not found" });
       return
    }

    await subCategory.destroy();

     res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error: any) {
     res.status(500).json({ message: "Error deleting subcategory", error: error.message });
  }
};
