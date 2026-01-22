import { AgentMarket } from "./AgentMarket";
import Market from "./marketModel";
import Product from "./productModel";
import ProductPricing from "./productPricing";
import ProductSubCategory from "./ProductSubCategory";
import RecommendProduct from "./RecommendProduct";
import Review from "./reviewModel";
import Shop from "./shopModel";
import ShopProduct from "./shopProductModel";
import { SubUnitProduct } from "./SubUnitProducts";
import UnitProduct from "./unitProductModel";
import User from "./userModel";


// Define relationships here
UnitProduct.hasMany(SubUnitProduct, { foreignKey: "unitId", as: "subUnits" });

SubUnitProduct.belongsTo(UnitProduct, { foreignKey: "unitId", as: "unit" });

ShopProduct.belongsTo(Product, {foreignKey: 'productId', as: 'productName'});

ShopProduct.belongsTo(Shop, {  foreignKey: 'shopId',  as: 'shopName'});
ShopProduct.belongsTo(ProductSubCategory, {  foreignKey: 'subCategoryId',  as: 'subProductCategory'});

// ShopProduct.belongsTo(UnitProduct, {  foreignKey: 'productUnit',  as: 'unitProduct',});

ShopProduct.hasMany(ProductPricing, { foreignKey: "productId", as: "productUnities" })
ShopProduct.hasMany(Review, {
  foreignKey: "productId", // ✅ NO leading space
  as: "productReview",
})

ShopProduct.hasMany(RecommendProduct, {
  foreignKey: "shopProductId",
  as: "recommendedProducts",
});



Shop.hasMany(ShopProduct,{ foreignKey: "shopId", as: "product" })

User.hasOne(AgentMarket, { foreignKey: "agentId", as: "agentsMarket" });
AgentMarket.belongsTo(User, { foreignKey: "agentId", as: "agent" });

Market.hasMany(AgentMarket, { foreignKey: "marketId", as: "agentsMarket" });
AgentMarket.belongsTo(Market, { foreignKey: "marketId", as: "market" });
Review.belongsTo(ShopProduct, {
  foreignKey: "productId",
  as: "shopProductReview",
})
RecommendProduct.belongsTo(ShopProduct, {
  foreignKey: "recommendedProductId",
  as: "recommendedProduct",
});

export { UnitProduct, SubUnitProduct,ShopProduct,ProductPricing,Shop,Product,Market,User,ProductSubCategory,Review,RecommendProduct};
