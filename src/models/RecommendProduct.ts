import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/database";


interface RecommendProductAttributes {
  id: string;
  shopProductId: string;         // Original product
  recommendedProductId: string;  // Product being recommended
  createdAt?: Date;
  updatedAt?: Date;
}

interface RecommendProductCreationAttributes
  extends Optional<RecommendProductAttributes, "id"> {}

class RecommendProduct
  extends Model<RecommendProductAttributes, RecommendProductCreationAttributes>
  implements RecommendProductAttributes
{
  public id!: string;
  public shopProductId!: string;
  public recommendedProductId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RecommendProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shopProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shop_products",
        key: "id",
      },
    },
    recommendedProductId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shop_products",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "RecommendProduct",
    tableName: "recommend_products",
  }
);

export default RecommendProduct;
