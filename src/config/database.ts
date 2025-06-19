

import { Sequelize } from 'sequelize';
import config from './config';

const env = process.env.NODE_ENV || 'development';

const dbConfig = config[env as keyof typeof config];

if (!dbConfig) {
  throw new Error(`Database config not found for environment: ${env}`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

export default sequelize;
