
// File: migrations/XXXX-create-Order.ts
import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('orders', {
       id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        buyerId: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        agentId: {
          type: DataTypes.UUID,
          allowNull: true,
        },

        driverId: {
          type: DataTypes.UUID,
          allowNull: true,
        },

        items: {
        type: DataTypes.TEXT,    // use TEXT/LONGTEXT instead of JSON
      
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

        paidAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        refundAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        transportCost: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        
        serviceCost: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        agentCommission: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

         generalTotal: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },

        paymentTransaction: {
          type: DataTypes.STRING,
          allowNull:true,
        },
        
        paymentStatus: {
          type: DataTypes.ENUM('Pending', 'Verification','Paid','Rejected'),
          allowNull: false,
          defaultValue:"Pending",
        },

      orderProcessingStatus: {
          type: DataTypes.ENUM('Pending', 'Assigned to Agent','Shopping','Shipping','Delivered'),
          allowNull: false,
          defaultValue:"Pending",
        },

        agentComment: {
          type: DataTypes.TEXT
         
        },

        buyerComment: {
          type: DataTypes.TEXT
          
        },

        serviceRating: {
          type: DataTypes.STRING,
          allowNull: true,
        },

       deliverylocationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
     
      deliveryDistance:{
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
    await queryInterface.dropTable('orders');
  },
};