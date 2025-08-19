// src/migrations/20250609193312-create-user-roles.ts
import { QueryInterface, DataTypes } from "sequelize";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
export default {
  up: async (queryInterface: QueryInterface) => {
    // Create table
    await queryInterface.createTable("roles", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      role: {
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

    // Insert one record every time migration runs
    console.log( process.env.UserRole)
    await queryInterface.bulkInsert("roles", [
      {
          // generates a new UUID for each run
        role: process.env.UserRole,    // you can change to e.g. 'seller' or 'admin'
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("roles");
  },
};
