import { Request, Response } from 'express';

// import ShopProduct from '../models/shopProductModel';
// import Product from '../models/productModel';
// import Market from '../models/marketModel';
// import User from '../models/userModel';
import Shop from '../models/shopModel';
import { uploadToCloudinary } from '../utils/uploadImage';
import { Op } from 'sequelize';
import { Product, ProductPricing, ShopProduct, SubUnitProduct, UnitProduct,ProductSubCategory, Review, RecommendProduct } from '../models/associations';
import User from '../models/userModel';
import Market from '../models/marketModel';
import { getStringQuery } from '../utils/searchUtil';
//import ProductSubCategory from '../models/ProductSubCategory';
// import UnitProduct from '../models/unitProductModel';



export const createShopProduct = async (req: Request, res: Response) => {
  try {

    const folderName="products/profile"
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return
    }

    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname,folderName);
    
    const {
       shopId,productName,productId,isExpires,expireDate,isAvailable,productDescription,
     kinyLabel,subCategoryId
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
    //  productUnit,
     engLabel:productName,
     subCategoryId,
     kinyLabel,
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
      limit = "12",
      availability = "all",
      expires = "all",
    } = req.query as any;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const offset = (pageNum - 1) * limitNum;

    const user = req.user as { id: number; role: { role: string } } | undefined;

    // ShopProduct filters
   const shopProductWhere: any = {
  ...(availability !== "all" && availability !== "" && { isAvailable: availability === "true" }),
  ...(expires !== "all" && expires !== "" && { isExpires: expires === "true" }),
  ...(Number(priceMin) || Number(priceMax)
    ? { marketUnitPrice: { [Op.between]: [Number(priceMin) || 0, Number(priceMax) || Number.MAX_SAFE_INTEGER] } }
    : {}),
  // ShopProduct search columns
  ...(searchTerm.trim() && {
    [Op.or]: [
      { engLabel: { [Op.iLike]: `%${searchTerm}%` } },
      { kinyLabel: { [Op.iLike]: `%${searchTerm}%` } },
    ],
  }),
};

    // Multi-field search for ShopProduct & Product
    const productWhere: any = {};
      
      if (searchTerm.trim()) {
        productWhere[Op.or] = [
          { product: { [Op.iLike]: `%${searchTerm}%` } },
          { productKinyLabel: { [Op.iLike]: `%${searchTerm}%` } },
        ];
      }

      const SubProductWhere: any = {};
      if (category !== "all" && category !== "") {
        SubProductWhere.id = category;
      }
      // if (searchTerm.trim()) {
      //   SubProductWhere[Op.or] = [
      //     { subCategoryEng: { [Op.iLike]: `%${searchTerm}%` } },
      //     { subCategoryKiny: { [Op.iLike]: `%${searchTerm}%` } },
      //   ];
      // }

    // Market filter inside Shop include
    const marketWhere = market !== "all" && market !== "" ? { id: market } : undefined;

    const shopProducts = await ShopProduct.findAndCountAll({
      where: shopProductWhere,
      include: [
        {
          model: Product,
          as: "productName",
          where: Object.keys(productWhere).length ? productWhere : undefined,
          attributes: ["id", "product", "productKinyLabel"],
        },
        {
          model: Product,
          as: "productName",
        },
        {
          model: ProductSubCategory,
          as: "subProductCategory",
          where: Object.keys(SubProductWhere).length ? SubProductWhere : undefined,
          attributes: ["id", "subCategoryKiny", "subCategoryEng"],
        },
        {
          model: Shop,
          as: "shopName",
          where: user && user.role.role === "Seller" ? { sellerId: user.id } : undefined,
          include: [
            {
              model: User,
              as: "seller",
              attributes: ["id","firstName","lastName","telephone","email","profilePic"],
            },
            {
              model: Market,
              as: "market",
              where: marketWhere,
              attributes: [
                "id","marketName","province","district","sector",
                "marketThumbnail","classification",
                "locationLongitude","locationLatitude","googleMapCoordinate",
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







export const getShopProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shopProduct = await ShopProduct.findOne({
      where: {
        id: req.params.id,
        isAvailable: true, // Only available products
      },
      include: [
        {
          model: ProductPricing,
          as: "productUnities",
          required: true, // Only include if ProductPricing exists
          include: [
            {
              model: UnitProduct,
              as: "unit",
            },
            {
              model: SubUnitProduct,
              as: "subUnit",
              required: true, // Only include if SubUnitProduct exists
            },
          ],
        },
        {
          model: Review,
          as: "productReview",
           where: {
            isApproved: true,  // only approved review message
            },
          required: false, // Keep product even if no approved reviews
        },

        {
          model: RecommendProduct,
          as: "recommendedProducts",
          include:[
             { model: ShopProduct, as: "recommendedProduct" }
          ]
        },
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
    });

    if (!shopProduct) {
      res.status(200).json({ message: "ShopProduct not found or not available" });
      return;
    }

    res.status(200).json(shopProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ShopProduct", error });
  }
};

export const updateShopProduct = async (req: Request, res: Response) => {
  try {
    const shopProduct = await ShopProduct.findByPk(req.params.id);

    if (!shopProduct) {
     res.status(404).json({ message: "ShopProduct not found" });
      return 
    }

    console.log(req.body)
    
    const folderName = "products/profile";
    const updateData: any = { ...req.body };

    console.log(updateData)

    // ✅ Only update productProfile if a file is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer, req.file.originalname,folderName
      );
      updateData.productProfile = result.secure_url;
    } else {
      // Explicitly remove it to avoid overwriting with undefined
      delete updateData.productProfile;
    }

    await shopProduct.update(updateData);

    console.log("Updated data:", updateData);

    res.status(200).json(shopProduct);
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(400)
      .json({ message: "Failed to update ShopProduct", error: (error as Error).message });
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


export const getShopProductByHomeSearch=async(req:Request,res:Response)=>{

   try {
    // 🔹 get search query safely
  
    const search = getStringQuery(req.query.products);
     
    if (!search) {
       res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    // 🔹 search only in shopProduct fields
      const { rows: shopProducts, count } =
      await ShopProduct.findAndCountAll({
        where: {
          [Op.or]: [
            { engLabel: { [Op.iLike]: `%${search}%` } },
            { kinyLabel: { [Op.iLike]: `%${search}%` } },
          ],
        },

        order: [["createdAt", "DESC"]],

        include: [
           {
          model:ProductPricing,
          as: "productUnities",
          include:[
            {
              model:UnitProduct,
              as: "unit",
            },
             {
              model:SubUnitProduct,
              as: "subUnit",
            },

          ],
        },
          {
            model: Shop,
            as: "shopName",
            include: [
              {
                model: User,
                as: "seller",
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "telephone",
                  "email",
                  "profilePic",
                ],
              },
              {
                model: Market,
                as: "market",
                attributes: [
                  "id",
                  "marketName",
                  "province",
                  "district",
                ],
              },
            ],
          },
        ],
      });

    res.status(200).json({
      success: true,
      count,
      shopProducts,
    });

  } catch (error) {
    console.error("Shop product search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
}