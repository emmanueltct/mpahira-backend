import { DataTypes,Model,Optional } from "sequelize";
import sequelize from '../config/database';
import { productAttribute } from "../interfaces/productInterface";
import ShopProduct from "./shopProductModel";
import ProductSubCategory from "./ProductSubCategory";



interface productCreationAttributes extends Optional<productAttribute, 'id'> {}

// Sequelize model
class Product extends Model<productAttribute, productCreationAttributes> implements productAttribute {
  public id!: string;
  public product!: string;
  public productKinyLabel!:string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true,
      allowNull: false,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    productKinyLabel:{
        type: DataTypes.STRING,
        allowNull: false
      }
  },
  {
    sequelize,
    tableName: 'products',
  }
);

Product.hasMany(ProductSubCategory,{foreignKey:"categoryId", as:"productSubCategory"})
Product.hasMany(ShopProduct,{foreignKey:"productId", as:"shopProduct"})
export default Product;