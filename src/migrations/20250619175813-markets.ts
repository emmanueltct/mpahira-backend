// src/migrations/20250609193312-create-user-roles.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('markets', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
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
        allowNull:false,
      },
      classification: {
        type: DataTypes.ENUM('shared','owner','store'),
        allowNull: false,
      },
      locationLongitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
       locationLatitude: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     googleMapCoordinate: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('markets');
  },
};

