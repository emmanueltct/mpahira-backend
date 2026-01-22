// src/migrations/20250609193312-create-user-roles.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('recommend_products', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
    
      shopProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shop_products",
        key: "id",
      },
       onDelete: "CASCADE",
    },
    recommendedProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shop_products",
        key: "id",
      },
       onDelete: "CASCADE",
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
    await queryInterface.dropTable('recommend_products');
  },
};

