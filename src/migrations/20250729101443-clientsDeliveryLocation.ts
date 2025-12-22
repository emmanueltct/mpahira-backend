
// File: migrations/XXXX-create-Order.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('delivery_locations', {
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
    await queryInterface.dropTable('delivery_locations');
  },
};