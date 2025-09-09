require("dotenv").config();

module.exports = {
  development: {
    username: "if0_39747079",
    password: "mpahiraTCTita",
    database: "if0_39747079_mpahira",
    host: "sql303.infinityfree.com",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000
    }
  },
  local: {
    username: "root",
    password: "",
    database: "mpahira",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000
    }
  },
  neon: {
    use_env_variable: "NEON_DATABASE_URL", // 👈 string key, not process.env
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
