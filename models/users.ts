import { Model, DataTypes } from "sequelize";
import { sequelize } from './sequelize';
import { logger } from '../logger';

interface UserData {
    chat_id: number,
    firstname?: string,
    lastname?: string,
    phone: string,
}

interface UserValues extends UserData {
    id: number,
    goods: string,
    isAuthenticated: boolean,
    units: string,
}

class User extends Model {}
User.init({
    chat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isAuthenticated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    goods: {
        type: DataTypes.STRING,
        allowNull: true
    },
    units: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: false,
    timestamps: false,
    modelName: 'users',
    sequelize
});

const createNewUser = async (userData: UserData): Promise<UserValues|undefined> => {
    let res;
    try {
        res = await User.create({ ...userData });
        res = res.dataValues;
        logger.info(`Created user with id: ${res.id}`);
    } catch (err) {
        logger.error(`Impossible to create user: ${err}`);
    }
    return res;
};

interface UpdateParams {
    goods?: string,
    units?: string,
    phone?: string,
    firstname?: string,
    lastname?: string,
}

const updateUserByChatId = async (chat_id: number, updateParams: UpdateParams): Promise<UserValues|undefined> => {
    const res = await User.update({ ...updateParams } , { where: { chat_id } });
    if (res[0]) {
        const data = await findUserByChatId(chat_id);
        if (data) {
            logger.info(`Channel ${data.chat_id} updated`);
            return data;
        }
        logger.info(`Channel ${chat_id} updated, but can't read result data`);
    } 
    return undefined;
};

const userLogin = async (chat_id: number): Promise<number|undefined> => {
    const res = await User.update({ active: false }, { where: { chat_id } });
    if (res) logger.info(`Channel ${chat_id} deactivated`);
    return res[0] ? chat_id : undefined;
};

const userLogout = async (chat_id: number): Promise<number|undefined> => {
    const res = await User.update({ active: false }, { where: { chat_id } });
    if (res) logger.info(`Channel ${chat_id} deactivated`);
    return res[0] ? chat_id : undefined;
};


const findUserById = async (id: number): Promise<Array<UserValues>|undefined> => {
    const res = await User.findAll({ where: { id: id } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findUsersByStatus = async (isAuthenticated: boolean): Promise<Array<UserValues>|undefined> => {
    const res = await User.findAll({ where: { isAuthenticated } });
    if (res.length > 0) return res.map(el => el.dataValues);
    return;
};

const findUserByChatId = async (chat_id: number): Promise<UserValues|null> => {
    const res = await User.findOne({ where: { chat_id: chat_id } });
    if (res) return res.dataValues;
    return res;
};

export {
    User,
    UserData,
    createNewUser,
    updateUserByChatId,
    userLogin,
    userLogout,
    findUserById,
    findUsersByStatus,
    findUserByChatId
};   