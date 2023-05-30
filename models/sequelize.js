import { Sequelize } from 'sequelize';

const dbpath = './db.db';

export const sequelize = new Sequelize({
    storage: dbpath,
    dialect: 'sqlite',
    logging: false
});
