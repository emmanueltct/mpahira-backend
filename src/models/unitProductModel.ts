import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { unitProductAttribute } from "../interfaces/unitProductInterface";
import { SubUnitProduct } from "./SubUnitProducts";

interface unitProductCreationAttributes
  extends Optional<unitProductAttribute, "id"> {}

// Sequelize model
class UnitProduct
  extends Model<unitProductAttribute, unitProductCreationAttributes>
  implements unitProductAttribute
{
  public id!: string;
  public unitProduct!: string;
  public unitProductDescription!: string;
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
    unitProductDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "unit_products",
    modelName: "UnitProduct",
  }
);

// // 🔗 Association (one unit can have many sub-units)
// UnitProduct.hasMany(SubUnitProduct, {
//   foreignKey: "unitId",
//   as: "subUnits",
// });

export default UnitProduct;
