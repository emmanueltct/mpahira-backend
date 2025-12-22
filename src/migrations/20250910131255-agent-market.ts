
// File: migrations/XXXX-create-Order.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('agent_markets', {
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
        },
        
       createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('agent_markets');
  },
};