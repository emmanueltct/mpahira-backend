
// File: migrations/XXXX-create-Order.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('favauriteMarkets', {
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
    await queryInterface.dropTable('favauriteMarkets');
  },
};