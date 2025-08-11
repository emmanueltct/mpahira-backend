
// File: migrations/XXXX-create-cart.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Carts', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      deliverylocationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      items: {
        type: DataTypes.TEXT('long'),    // use TEXT/LONGTEXT instead of JSON
        allowNull: false,
        get() {
          const raw = this.getDataValue('items');
          return raw ? JSON.parse(raw) : [];    // return parsed object/array
        },
        set(value: any) {
          this.setDataValue('items', JSON.stringify(value)); // stringify before saving
        },
      },

      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
     
    transportCost:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },
    deliveryDistance:{
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:"Not Calculated"
    },
     serviceCost:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
    },

    generalTotal:{
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue:0
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
    await queryInterface.dropTable('Carts');
  },
};