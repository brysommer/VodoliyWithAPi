import { Sequelize } from 'sequelize';

const dbpath = __dirname + '/db.db';

export const sequelize = new Sequelize({
    storage: dbpath,
    dialect: 'sqlite',
    logging: false
});
