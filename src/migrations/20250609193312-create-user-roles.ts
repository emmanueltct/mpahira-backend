// src/migrations/20250609193312-create-user-roles.ts
import { QueryInterface, DataTypes, Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default {
  up: async (queryInterface: QueryInterface) => {
    // Enable pgcrypto (needed for gen_random_uuid)
    await queryInterface.sequelize.query(
      `CREATE EXTENSION IF NOT EXISTS "pgcrypto";`
    );

    // Create table
    await queryInterface.createTable("roles", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
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
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Insert one record with explicit id
    const roleValue = process.env.UserRole || "Admin";

    await queryInterface.bulkInsert("roles", [
      {
        id: Sequelize.literal("gen_random_uuid()"), // ✅ force uuid
        role: roleValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("roles");
  },
};
