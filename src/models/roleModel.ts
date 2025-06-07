import { DataTypes,Model,Optional } from "sequelize";
import sequelize from '../config/database';
import { roleAttribute } from "../interfaces/roleInterface";



interface roleCreationAttributes extends Optional<roleAttribute, 'id'> {}

// Sequelize model
class Role extends Model<roleAttribute, roleCreationAttributes> implements roleAttribute {
  public id!: string;
  public role!: string;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
  }
);

export default Role;