import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import UnitProduct from "./unitProductModel";
import { subUnitProductAttribute } from "../interfaces/subUnitProductInterface";


interface subUnitProductCreationAttributes
  extends Optional<subUnitProductAttribute, "id"> {}

export class SubUnitProduct
  extends Model<subUnitProductAttribute, subUnitProductCreationAttributes>
  implements subUnitProductAttribute
{
  public id!: string;
  public subUnit!: string;
  public subUnitDescription!: string;
  public unitId!: string; // FK reference to UnitProduct
}

SubUnitProduct.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    subUnit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     subUnitDescription: {
     type: DataTypes.STRING,
     allowNull: true,
     },
    unitId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "sub_unit_products",
    modelName: "SubUnitProduct",
  }
);

// 🔗 Reverse association (each sub-unit belongs to one unit)
// SubUnitProduct.belongsTo(UnitProduct, {
//   foreignKey: "unitId",
//   as: "unit",
// });
