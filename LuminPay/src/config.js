// config.js - Configuración global de LuminaPay

const path = require("path");

const config = {
  PORT: process.env.PORT || 3000,
  DB_PATH: path.join(__dirname, "../db/lumina.db"),
};

module.exports = config;
