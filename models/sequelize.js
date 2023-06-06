import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import path from 'path';
import fs from 'fs';

const _dirname = process.cwd();
const dbpath = path.join(_dirname, 'db.db');
console.log(dbpath);

//const dbpath = __dirname + './db.db';

export const sequelize = new Sequelize({
    storage: dbpath,
    dialect: 'sqlite',
    logging: false
});
