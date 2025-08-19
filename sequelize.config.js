module.exports = {
  development: {
    username: "sql8794560",
    password: "LIAHtw29wV",
    database: "sql8794560",
    host: "sql8.freesqldatabase.com",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000 // optional, to prevent timeout
    }
  },
  local: {
    username: "root",
    password: "",
    database: "mpahira",
    host: "127.0.0.1",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000 // optional, to prevent timeout
    }
  }
};
