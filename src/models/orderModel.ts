// File: models/Order.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './userModel';
import { OrderAttributes, OrderItem } from '../interfaces/orderInterface';
import { DeliveryLocation } from './DeliveryLocation';


export class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: string;
    public userId!: string;
    public items!:string;
    public buyerId!:string;
    public agentId!:string;
    public driverId!:string;
    public totalAmount!:number;
    public paidAmount!:number;
    public refundAmount!:number;
    public transportCost!:number;    
    public serviceCost!:number;
    public agentCommission!:number;
    public generalTotal !:number;
    public paymentTransaction!:string;
    public paymentStatus!:'pending' | "Success" | "Cancelled";
    public orderProcessingStatus!:'Pending'| 'Assigned to Agent'|'Shopping'|'Shipping'|'Delivered';
    public agentComment!:Text;
    public buyerComment!:Text;
    public serviceRating!:string;
    public deliverylocationId!:string;
    public deliveryDistance!:string;
 
}

Order.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    buyerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    agentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

     driverId: {
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

    paidAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },

    refundAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    transportCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    
    serviceCost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    agentCommission: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

     generalTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    paymentTransaction: {
      type: DataTypes.STRING,
      allowNull:true,
      unique:false,
    },
    
    paymentStatus: {
      type: DataTypes.ENUM("pending", "Success" , "Cancelled"),
      allowNull: false,
      defaultValue:"Pending",
    },

   orderProcessingStatus: {
      type: DataTypes.ENUM('Pending', 'Assigned to Agent','Shopping','Shipping','Delivered'),
      allowNull: false,
      defaultValue:"Pending",
    },

    agentComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    buyerComment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    serviceRating: {
      type: DataTypes.STRING,
      allowNull: true,
    },

     deliverylocationId: {
      type:DataTypes.UUID,
      allowNull: true,
    },

     deliveryDistance: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  }
);

Order.belongsTo(User, { foreignKey: 'buyerId',as:'buyer'});
Order.belongsTo(User, { foreignKey: 'agentId',as:'agent'});
Order.belongsTo(User, { foreignKey: 'driverId',as:'messenger'});
/* Order.belongsTo(DeliveryLocation, { foreignKey: ' deliverylocationId',as:'location'});*/