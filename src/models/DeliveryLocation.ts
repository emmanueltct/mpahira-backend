// File: models/DeliveryLocation.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './userModel';
import { DeliveryLocationAttributes} from '../interfaces/deliveryLocationInterface';


export class DeliveryLocation extends Model<DeliveryLocationAttributes> implements DeliveryLocationAttributes {
    public id!: string;
    public buyerId!: string;
    public locationLongitude!:string;
    public locationLatitude!:string;
    public googleMapCoordinate!:string;
    public StreetNumber!:string;
    public nearestLandmark!:string;
    public locationDescription!:Text
}

DeliveryLocation.init(
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

     locationLongitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    locationLatitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    googleMapCoordinate: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    streetNumber: {
     type: DataTypes.TEXT,
      allowNull: true,
    },
     nearestLandmark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    locationDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: 'DeliveryLocation',
    tableName: 'delivery_locations',
    timestamps: true,
  }
);

DeliveryLocation.belongsTo(User, { foreignKey: 'buyerId',as:'location'});
