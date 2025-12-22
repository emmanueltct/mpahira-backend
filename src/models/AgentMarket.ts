// File: models/FavauriteMarket.model.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

import { AgentMarketAttributes } from '../interfaces/agentMarketInterface';


export class AgentMarket extends Model<AgentMarketAttributes> implements AgentMarketAttributes {
    public id!: string;
    public marketId!: string;
    public agentId!: string;
}

AgentMarket.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    marketId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    agentId: {
      type: DataTypes.UUID,
      allowNull: false,
       references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },

  },
  {
    sequelize,
    modelName: 'AgentMarket',
    tableName: 'agent_markets',
  }
);

