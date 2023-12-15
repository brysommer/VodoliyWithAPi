import { User, createNewUser } from '../models/users.mjs';
import { logger } from '../logger/index.mjs';

const DEBUG = true;

const main = async () => {
    try {
        const syncState = await Promise.all([
            User.sync(),
        ]);
        
        
        if (DEBUG && syncState) {
            const pseudoRandom = () => Math.floor(Math.random() * 10000);
            const userData = {
                chat_id: pseudoRandom(),
                firstname: 'migration_record',
                phone: pseudoRandom().toString(),
                dialoguestatus: '',
            };

            logger.info('Log created by migration procedure');
            createNewUser(userData);
        }

    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
    }
};

main();
