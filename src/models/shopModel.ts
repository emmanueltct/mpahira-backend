// models/ShopModel.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // adjust to your setup
import { ShopAttributes } from '../interfaces/shopInterface';
import User from './userModel';
import Market from './marketModel';


type ShopCreationAttributes = Optional<ShopAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Shop extends Model<ShopAttributes, ShopCreationAttributes> implements ShopAttributes {
  public id!: string;
  public brandName!: string;
  public sellerId!: string;
  public marketId!: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

Shop.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    sellerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  marketId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'markets',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  },
  },
  {
    sequelize,
    modelName: 'Shop',
    tableName: 'shops',
  }
);

Shop.belongsTo(User, {
  foreignKey: 'sellerId',
  as: 'seller',
});

Shop.belongsTo(Market, {
  foreignKey: 'marketId',
  as: 'market',
});

export default Shop;
