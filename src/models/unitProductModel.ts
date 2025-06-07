import { DataTypes,Model,Optional } from "sequelize";
import sequelize from '../config/database';
import { unitProductAttribute } from "../interfaces/unitProductInterface";



interface unitProductCreationAttributes extends Optional<unitProductAttribute, 'id'> {}

// Sequelize model
class UnitProduct extends Model<unitProductAttribute, unitProductCreationAttributes> implements unitProductAttribute {
  public id!: string;
  public unitProduct!: string;
}

UnitProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true,
      allowNull: false,
    },
    unitProduct: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'unitProducts',
  }
);

export default UnitProduct;