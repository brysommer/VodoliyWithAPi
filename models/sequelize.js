"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
var dbpath = __dirname + '/db.db';
exports.sequelize = new sequelize_1.Sequelize({
    storage: dbpath,
    dialect: 'sqlite',
    logging: false
});
