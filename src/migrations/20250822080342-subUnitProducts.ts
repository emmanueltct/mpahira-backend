
// File: migrations/XXXX-create-Order.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('sub_unit_products', {
       id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        unitId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
       
        subUnit: {
           type: DataTypes.STRING,
           allowNull:false,
        },

        subUnitDescription: {
          type: DataTypes.STRING,
          allowNull: true,
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
    await queryInterface.dropTable('sub_unit_products');
  },
};