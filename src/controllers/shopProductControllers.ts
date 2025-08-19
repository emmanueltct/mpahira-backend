import { Request, Response } from 'express';

import ShopProduct from '../models/shopProductModel';
import Product from '../models/productModel';
import Market from '../models/marketModel';
import User from '../models/userModel';
import Shop from '../models/shopModel';
import { uploadToCloudinary } from '../utils/uploadImage';
import { Op } from 'sequelize';



export const createShopProduct = async (req: Request, res: Response) => {
  try {

    const folderName="products/profile"
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname,folderName);
    
    const {
       shopId,productUnit, productPrice,productName, productId,isExpires,expireDate,isAvailable,productDescription,
     kinyLabel,productDiscount
    } = req.body;


   let finalProductId;

    if (productId) {
    finalProductId = productId;
    } else if (productName) {
    const [product] = await Product.findOrCreate({
        where: { product: productName }
    });
    finalProductId = product.id;
    } else {
    // Neither ID nor name provided
    res.status(400).json({ message: 'Product ID or product name must be provided.'});
    }

if(result.secure_url){


const shopProduct = await ShopProduct.create({
     shopId,
     productId:finalProductId,
     productUnit,
     engLabel:productName,
     kinyLabel,
     marketUnitPrice:productPrice,
     productDiscount,
     systemUnitPrice:productPrice+(productPrice*10/100),
     isExpires,
     expireDate,
     isAvailable,
     productDescription,
     productProfile:result.secure_url
});
    
    res.status(201).json(shopProduct);
  }else{
        res.status(500).json({error: "something went wrong with uplodng image to the server and product not created please try again"});
  }

  } catch (error) {
    res.status(400).json({ message: 'Failed to create ShopProduct', error });
  }
};

// export const getShopProducts = async (req: Request, res: Response) => {
//   try {
//     const shopProducts = await ShopProduct.findAll({
//        include: [
//           {
//             model: Product, as: 'productName',
//             // attributes: ['productName'],
//           },

//           {
//             model: Shop,as: 'shopName',
//             include: [
//               { model: User, as: 'seller' },
//               { model: Market, as: 'market'}
//             ],
//           }
//         ]
//       } );

//     res.status(200).json(shopProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch ShopProducts', error });
//   }
// };




export const getShopProducts = async (req: Request, res: Response) => {
  try {
    const {
      searchTerm = "",
      category = "all",
      market = "all",
      priceMin = "0",
      priceMax = "0",
      page = "1",
      limit = "10",
      availability = "all",
      expires = "all",
    } = req.query as any;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const offset = (pageNum - 1) * limitNum;

    const whereConditions: any = {};

    // Handle logged in user
    const user = req.user as { id: number; role: { role: string } } | undefined;
    if (user && user.role.role === "Seller") {
      whereConditions["$shopName.sellerId$"] = user.id;
    }

    // Search
    if (searchTerm.trim()) {
      whereConditions["$productName.product$"] = {
        [Op.like]: `%${searchTerm}%`,
      };
    }

    // Category filter
    if (category !== "all") {
      whereConditions["$productName.id$"] = category;
    }

    // Market filter
    if (market !== "all") {
      whereConditions["$shopName.market.id$"] = market;
    }

    // Availability filter
    if (availability !== "all") {
      whereConditions.isAvailable = availability === "true";
    }

    // Expires filter
    if (expires !== "all") {
      whereConditions.isExpires = expires === "true";
    }

    // Price range
    const min = Number(priceMin);
    const max = Number(priceMax);
    if (min > 0 || max > 0) {
      whereConditions.systemUnitPrice = {
        ...(min > 0 ? { [Op.gte]: min } : {}),
        ...(max > 0 ? { [Op.lte]: max } : {}),
      };
    }

    // Query
    const shopProducts = await ShopProduct.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Product,
          as: "productName",
        },
        {
          model: Shop,
          as: "shopName",
          include: [
            {
              model: User,
              as: "seller",
              attributes: ["id", "firstName", "lastName", "telephone", "email", "profilePic"],
            },
            {
              model: Market,
              as: "market",
              attributes: [
                "id",
                "marketName",
                "province",
                "district",
                "sector",
                "marketThumbnail",
                "classification",
                "locationLongitude",
                "locationLatitude",
                "googleMapCoordinate",
              ],
            },
          ],
        },
      ],
      limit: limitNum,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      total: shopProducts.count,
      page: pageNum,
      totalPages: Math.ceil(shopProducts.count / limitNum),
      data: shopProducts.rows,
    });
  } catch (error: any) {
    console.error("Error fetching shop products:", error);
     res.status(500).json({
      message: "Failed to fetch shop products",
      error: error.message || error,
    });
  }
};







export const getShopProductById = async (req: Request, res: Response):Promise<void> => {
  try {
    const shopProduct = await ShopProduct.findByPk(req.params.id);
    if (!shopProduct){
        res.status(404).json({ message: 'ShopProduct not found' });
        return
    } 

    res.status(200).json(shopProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ShopProduct', error });
  }
};

export const updateShopProduct = async (req: Request, res: Response) => {
  try {
    const shopProduct= await ShopProduct.findByPk(req.params.id);
     if (!shopProduct){
        res.status(404).json({ message: 'ShopProduct not found' });
        return
    } 
    await shopProduct.update(req.body);
    res.status(200).json(shopProduct);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update ShopProduct', error });
  }
};

export const deleteShopProduct = async (req: Request, res: Response) => {
  try {
    const shopProduct = await ShopProduct.findByPk(req.params.id);
     if (!shopProduct){
        res.status(404).json({ message: 'ShopProduct not found' });
        return
    } 
    await ShopProduct.destroy();
    res.status(200).json({ message: 'ShopProduct deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ShopProduct', error });
  }
};
