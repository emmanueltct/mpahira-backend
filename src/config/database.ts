import { Sequelize } from "sequelize";
import config from "./config";

const env = process.env.NODE_ENV || "development";

let sequelize: Sequelize;

if (env === "neon") {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    throw new Error("NEON_CONNECTION_STRING is not set in environment variables");
  }

  sequelize = new Sequelize(connectionString, {
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const dbConfig = config[env as keyof typeof config];

  if (!dbConfig) {
    throw new Error(`Database config not found for environment: ${env}`);
  }

  sequelize = new Sequelize(dbConfig.database as string, dbConfig.username as string, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  });
}

export default sequelize;
