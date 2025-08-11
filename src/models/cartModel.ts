// File: models/cart.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './userModel';
import { CartAttributes, CartItem } from '../interfaces/cartInterface';
import { DeliveryLocation } from './DeliveryLocation';

type CartCreationAttributes = Optional< CartAttributes, 'id' | 'deliverylocationId'>;
export class Cart extends Model<CartAttributes,CartCreationAttributes> implements CartAttributes {
  public id!: string;
  public userId!: string;
  public deliverylocationId!:string | undefined;
  public items!: CartItem[];
  public totalAmount!: number;
  public  transportCost !: number;
  public  deliveryDistance!:string;
  public serviceCost !: number;
  public generalTotal !: number;
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
     deliverylocationId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
     items: {
        type: DataTypes.TEXT('long'),    // use TEXT/LONGTEXT instead of JSON
        allowNull: false,
      },

    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transportCost:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },
     deliveryDistance:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"Not Calculated"
    },
     serviceCost:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },

    generalTotal:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },

  },
  {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
  }
);

Cart.belongsTo(User, { foreignKey: 'userId',as:'buyer'});
Cart.belongsTo(DeliveryLocation, { foreignKey: 'deliverylocationId',as:'location'});