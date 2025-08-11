// models/userModel.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database'; // adjust to your setup
import { MarketAttributes } from '../interfaces/marketInterface';



type MarketCreationAttributes = Optional< MarketAttributes, 'id' | 'createdAt' | 'updatedAt'>;

class Market extends Model< MarketAttributes, MarketCreationAttributes> implements  MarketAttributes {
  public id!: string;
  public marketName!: string;
  public province!: string;
  public district!:string;
  public sector!:string;
  public marketThumbnail?: string;
  public classification!: 'shared' | 'owner'|'store';
  public locationLongitude!:string;
  public locationLatitude!:string;
  public googleMapCoordinate?:string;
  public createdAt?: Date;
  public updatedAt?: Date;
}

Market.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    marketName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    marketThumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    classification: {
      type:  DataTypes.ENUM('shared','owner','store'),
      allowNull: false,
      defaultValue:"shared"
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
  },
  {
    sequelize,
    modelName: 'Market',
    tableName: 'markets',
  }
);


export default Market;
