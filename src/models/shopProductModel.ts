// models/ShopProductModel.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // adjust to your setup
import { ShopProductAttributes } from '../interfaces/shopProductInterface';

import Product from './productModel';
import Shop from './shopModel';
import UnitProduct from './unitProductModel';
import ProductPricing from './productPricing';


type ShopProductCreationAttributes = Optional<ShopProductAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class ShopProduct extends Model<ShopProductAttributes, ShopProductCreationAttributes> implements ShopProductAttributes {
  public id!: string;
  public shopId!: string;
  public productId!: string;
  // public productUnit!:string;
  public subCategoryId!:string;
  public engLabel!:string;
  public kinyLabel!:string;
  public isExpires!:boolean;
  public expireDate!: string;
  public isAvailable!:boolean;
  public productDescription!:Text;
  public productProfile!:string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  shopName: any;
}

ShopProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'shops',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

    // productUnit: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    //   references: {
    //     model: 'unit_products',
    //     key: 'id',
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'RESTRICT',
    // },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    subCategoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'product_sub_categories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
     engLabel:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:""
    },
     kinyLabel:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:""
    },
    
    isExpires:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },
    expireDate:{
      type: DataTypes.STRING,
      allowNull:true,
    },

    isAvailable:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },
    productDescription:{
      type: DataTypes.STRING,
      allowNull:true,
    },
    productProfile: {
      type: DataTypes.STRING,
      allowNull:false,
    },
  },
  {
    sequelize,
     modelName: 'shopProduct',
     tableName: 'shop_products',

    
  }
);



export default ShopProduct;
