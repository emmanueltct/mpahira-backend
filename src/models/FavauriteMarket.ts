// File: models/FavauriteMarket.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './userModel';
import { FavauriteMarketAttributes} from '../interfaces/favauriteMarketInterface';


export class FavauriteMarket extends Model<FavauriteMarketAttributes> implements FavauriteMarketAttributes {
    public id!: string;
    public buyerId!: string;
    public marketId!: string;
}

FavauriteMarket.init(
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

    marketId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

  },
  {
    sequelize,
    modelName: 'FavauriteMarket',
    tableName: 'favauritemarkets',
  }
);

FavauriteMarket.belongsTo(User, { foreignKey: 'buyerId',as:'buyer'});
