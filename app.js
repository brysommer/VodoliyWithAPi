import TelegramBot from 'node-telegram-bot-api';
import { anketaListiner } from './anketa.mjs';
import { dataBot } from './values.mjs';
import { decodeQR } from './qrdecode.mjs';
import { sequelize } from './models/sequelize.mjs';
import { logger } from './logger/index.mjs';

const bot = new TelegramBot(dataBot.telegramBotToken, { polling: true });

export { bot };

const main = async () => {
    const models = {
        list:  [
            'users'
        ]
    };
    // DB
    const configTables = models.list;
    const dbInterface = sequelize.getQueryInterface();
    const checks = await Promise.all(configTables.map(configTable => {
        return dbInterface.tableExists(configTable);
    }));
    const result = checks.every(el => el === true);
    if (!result) {
        // eslint-disable-next-line no-console
        console.error(`🚩 Failed to check DB tables, see config.models.list`);
        throw (`Some DB tables are missing`);
    }
    logger.info('DB connected.');
}; 

main();


anketaListiner();
decodeQR();
