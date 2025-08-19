// src/migrations/20250609193313-create-users.ts
import { QueryInterface, DataTypes } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
import bcrypt from "bcrypt";

import crypto from "crypto";
dotenv.config();
export default {
  up: async (queryInterface: QueryInterface) => {
    // Create users table
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.ENUM("local", "google"),
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      refreshToken: {
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

    // Fetch an existing role (for example "admin")
    const [roles]: any = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE role = 'admin' LIMIT 1;`
    );

    const roleId = roles.length ? roles[0].id : crypto.randomUUID();

    // If no "admin" role exists, insert it
    if (!roles.length) {
      await queryInterface.bulkInsert("roles", [
        {
          id: roleId,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Insert default admin user
    const hashedPassword = await bcrypt.hash(process.env.USERPASSWORD as string, 12); // default password

    await queryInterface.bulkInsert("users", [
      {
  
        firstName: "Super",
        lastName: "Admin",
        telephone: "250788000000",
        email:process.env.USEREMAIL,
        password: hashedPassword,
        profilePic: null,
        provider: "local",
        roleId,
        otp: null,
        otpExpires: null,
        accessToken: null,
        refreshToken: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("users");
  },
};
