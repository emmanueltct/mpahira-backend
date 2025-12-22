import { BelongsTo, DataTypes,Model,Optional } from "sequelize";
import sequelize from '../config/database';

import ShopProduct from "./shopProductModel";
import { productSubCategoryAttribute } from "../interfaces/subCategoryInterface";
import Product from "./productModel";



interface productSubCategoryCreationAttributes extends Optional<productSubCategoryAttribute, 'id'> {}

// Sequelize model
class ProductSubCategory extends Model<productSubCategoryAttribute, productSubCategoryCreationAttributes> implements productSubCategoryAttribute {
  public id!: string;
  public categoryId!: string;
  public subCategoryEng!:string;
  public subCategoryKiny!:string;
  public imageUrl!:string;

}

ProductSubCategory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subCategoryEng:{
        type: DataTypes.STRING,
        allowNull: false
      },
    subCategoryKiny:{
        type: DataTypes.STRING,
        allowNull: false
      },

    imageUrl:{
        type: DataTypes.STRING,
        allowNull: true
      }
  },
  {
    sequelize,
    tableName: 'product_sub_categories',
  }
);

// ProductSubCategory.belongsTo(Product,{foreignKey:"categoryId", as:"productCategory"});

ProductSubCategory.hasMany(ShopProduct,{foreignKey:"subCategoryId", as:"shopProduct"})

export default ProductSubCategory;