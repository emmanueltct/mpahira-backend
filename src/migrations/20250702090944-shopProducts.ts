// src/migrations/20250609193312-create-user-products.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('shopproducts', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

    shopId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'shops',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    productUnit: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'unitproducts',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
     engLabel:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:""
    },
     kinyLabel:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:""
    },
     marketUnitPrice:{
      type: DataTypes.STRING,
      allowNull:false,
    },
    systemUnitPrice:{
      type: DataTypes.STRING,
      allowNull:false,
    },
     productDiscount:{
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue:0
    },
    isExpires:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:false
    },

    expireDate:{
      type: DataTypes.STRING,
      allowNull:true,
    },

    isAvailable:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue:true
    },

    productDescription:{
      type: DataTypes.STRING,
      allowNull:true,
    },

    productProfile: {
      type: DataTypes.STRING,
      allowNull:false,
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
    await queryInterface.dropTable('shopproducts');
  },
};
