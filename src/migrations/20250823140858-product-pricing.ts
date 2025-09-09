import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("product_pricing", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "shop_products", key: "id" },
        onDelete: "CASCADE",
      },
      unitId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "unit_products", key: "id" },
        onDelete: "CASCADE",
      },
      subUnitId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "sub_unit_products", key: "id" },
        onDelete: "CASCADE",
      },
      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      minPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      maxPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      isDefaultSelection: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("product_pricing");
  },
};
