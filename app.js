import TelegramBot from 'node-telegram-bot-api';
import { anketaListiner } from './anketa.js';
import { dataBot } from './values.js';
import {decodeQR} from './qrdecode.js';

const bot = new TelegramBot(dataBot.telegramBotToken, { polling: true });

export { bot };

anketaListiner();
decodeQR();
