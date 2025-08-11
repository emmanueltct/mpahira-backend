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
       shopId,productName, productId,isExpires,expireDate,isAvailable,productDescription
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
     isExpires,
     expireDate,
     isAvailable,
     productDescription,
     productProfile:result.secure_url
});
    
    res.status(201).json(shopProduct);
  }else{
        res.status(201).json({error: "something went wrong and product not created please try again"});
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
      searchTerm = '',
      category = '',
      market = '',
      priceMin = 0,
      priceMax = 0,
      page = '1',
      limit = '10',
    } = req.query as {
      searchTerm: string;
      category: string;
      market: string;
      priceMin: string;
      priceMax: string;
      page: string ;
      limit: string ;
    };;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const priceMinValue = Number(priceMin);
    const priceMaxValue = Number(priceMax);

    // Check for logged in user and their role
    const user = req.user as { id: number; role: string } | undefined;

    // Build where conditions
    const productConditions: any = {};
    const shopConditions: any = {};

    const whereConditions: any = {};
     if (user && user.role === 'Seller') {
      whereConditions['$shopName.seller.id$'] = user.id;
    }
    
  if (searchTerm) {
      whereConditions['$productName.product$'] = {
        [Op.like]: `%${searchTerm}%`,
      };
    }

    if (category) {
      whereConditions['$productName.id$'] = category;
    }

    if (market) {
      whereConditions['$shopName.market.id$'] = market;
    }

    if (Number(priceMin) > 0 || Number(priceMax) > 0) {
      whereConditions.price = {
        ...(Number(priceMin) > 0 ? { [Op.gte]: Number(priceMin) } : {}),
        ...(Number(priceMax) > 0 ? { [Op.lte]: Number(priceMax) } : {}),
      };
    }
    const shopProducts = await ShopProduct.findAndCountAll({
        where: whereConditions,
      include: [
        {
          model: Product,
          as: 'productName',
          // where: productConditions,
          
        },
        {
          model: Shop,
          as: 'shopName',
          // where: shopConditions,
          include: [
            { model: User, as: 'seller', attributes: ["id","firstName","lastName","telephone","email","profilePic"] },
            { model: Market, as: 'market', attributes: ["id","marketName", "province","district","sector","marketThumbnail","classification","locationLongitude","locationLatitude","googleMapCoordinate"] },
          ],
        },
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      total: shopProducts.count,
      page: parseInt(page),
      totalPages: Math.ceil(shopProducts.count / parseInt(limit)),
      data: shopProducts.rows,
    });
  } catch (error) {
    console.error('Error fetching shop products:', error);
    res.status(500).json({
      message: 'Failed to fetch shop products',
      error: (error as any).message || error,
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
