import { User,  UserData, createNewUser } from '../models/users';
import { logger } from '../logger';

const DEBUG = true;

const main = async (): Promise<void> => {
    try {
        const syncState = await Promise.all([
            User.sync(),
        ]);
        
        if (DEBUG && syncState) {
            const pseudoRandom = () => Math.floor(Math.random() * 10000);
            const userData: UserData = {
                chat_id: pseudoRandom(),
                firstname: 'migration_record',
                phone: pseudoRandom().toString()
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
