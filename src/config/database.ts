

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

    pool: {
      max: 10,       // maximum number of connection in pool
      min: 0,        // minimum number of connection in pool
      acquire: 30000, // maximum time, in ms, that pool will try to get connection before throwing error
      idle: 10000,    // maximum time, in ms, that a connection can be idle before being released
    },

    dialectOptions: {
      connectTimeout: 60000, // increase connection timeout to 60 seconds
    },
  }
);

export default sequelize;
