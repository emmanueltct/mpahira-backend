import Product from "./productModel";
import ProductPricing from "./productPricing";
import Shop from "./shopModel";
import ShopProduct from "./shopProductModel";
import { SubUnitProduct } from "./SubUnitProducts";
import UnitProduct from "./unitProductModel";


// Define relationships here
UnitProduct.hasMany(SubUnitProduct, { foreignKey: "unitId", as: "subUnits" });

SubUnitProduct.belongsTo(UnitProduct, { foreignKey: "unitId", as: "unit" });

ShopProduct.belongsTo(Product, {foreignKey: 'productId', as: 'productName'});

ShopProduct.belongsTo(Shop, {  foreignKey: 'shopId',  as: 'shopName'});

ShopProduct.belongsTo(UnitProduct, {  foreignKey: 'productUnit',  as: 'unitProduct',});

ShopProduct.hasMany(ProductPricing, { foreignKey: "productId", as: "productUnities" })

Shop.hasMany(ShopProduct,{ foreignKey: "shopId", as: "product" })

export { UnitProduct, SubUnitProduct,ShopProduct,ProductPricing,Shop,Product};
