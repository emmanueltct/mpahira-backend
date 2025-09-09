import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { ProductPricingAttributes } from "../interfaces/productPricing";
import ShopProduct from "./shopProductModel";
import UnitProduct from "./unitProductModel";
import { SubUnitProduct } from "./SubUnitProducts";



type ProductPricingCreationAttributes = Optional<ProductPricingAttributes, "id">;

class ProductPricing extends Model<ProductPricingAttributes, ProductPricingCreationAttributes>
  implements ProductPricingAttributes {
  public id!: string;
  public productId!: string;
  public unitId!: string;
  public subUnitId!: string;
  public unitPrice!: number;
  public minPrice!: number;
  public maxPrice!: number;
  public isDefaultSelection!: boolean;
}

ProductPricing.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subUnitId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue:0
    },
    minPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue:0
    },
    maxPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue:0
    },
    isDefaultSelection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "ProductPricing",
    tableName: "product_units",
    timestamps: true,
  }
);

// Associations
ProductPricing.belongsTo(ShopProduct, { foreignKey: "productId", as: "product" });
ProductPricing.belongsTo(UnitProduct, { foreignKey: "unitId", as: "unit" });
ProductPricing.belongsTo(SubUnitProduct, { foreignKey: "subUnitId", as: "subUnit" });

export default ProductPricing;
