import { DataTypes,Model,Optional } from "sequelize";
import sequelize from '../config/database';
import { productAttribute } from "../interfaces/productInterface";



interface productCreationAttributes extends Optional<productAttribute, 'id'> {}

// Sequelize model
class Product extends Model<productAttribute, productCreationAttributes> implements productAttribute {
  public id!: string;
  public product!: string;
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true,
      allowNull: false,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);

export default Product;