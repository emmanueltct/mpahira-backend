import { AgentMarket } from "./AgentMarket";
import Market from "./marketModel";
import Product from "./productModel";
import ProductPricing from "./productPricing";
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

// ShopProduct.belongsTo(UnitProduct, {  foreignKey: 'productUnit',  as: 'unitProduct',});

ShopProduct.hasMany(ProductPricing, { foreignKey: "productId", as: "productUnities" })

Shop.hasMany(ShopProduct,{ foreignKey: "shopId", as: "product" })

User.hasOne(AgentMarket, { foreignKey: "agentId", as: "agentsMarket" });
AgentMarket.belongsTo(User, { foreignKey: "agentId", as: "agent" });

Market.hasMany(AgentMarket, { foreignKey: "marketId", as: "agentsMarket" });
AgentMarket.belongsTo(Market, { foreignKey: "marketId", as: "market" });

export { UnitProduct, SubUnitProduct,ShopProduct,ProductPricing,Shop,Product,Market,User};
