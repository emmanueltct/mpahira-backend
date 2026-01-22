import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";


interface ReviewAttributes {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  productId: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewCreationAttributes
  extends Optional<ReviewAttributes, "id" | "isApproved"> {}

class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: string;
  public customerName!: string;
  public rating!: number;
  public comment!: string;
  public productId!: string;
  public isApproved!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0.5, max: 5.00 },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
  
      sequelize,
      tableName: "reviews",
      modelName: "Review",
      timestamps: true,
  
  }

);

//  Review.belongsTo(ShopProduct,{  foreignKey: 'productId',  as: 'productReview'})

export default Review;
