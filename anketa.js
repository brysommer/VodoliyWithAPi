import { bot } from "./app.js";
import { phrases, keyboards } from './language_ua.js';
import { logger } from './logger/index.js';
import { DateTime } from "luxon";

let customerInfo = {};
const phoneRegex = /^\d{10,12}$/;

export const anketaListiner = async() => {
    bot.setMyCommands([
      {command: '/start', description: 'До головного меню'},
      {command: '/login', description: 'Авторизуватись, для постійних клієнтів "Водолій"'},
      {command: '/logout', description: 'Вийти з акаунту'}
    ]);

    bot.on("callback_query", async (query) => {

      const action = query.data;
      const chatId = query.message.chat.id;
      
      switch (action) {
        case  '/volume':
          customerInfo[chatId].units = 'volume';
          bot.sendMessage(chatId, phrases.chooseVolume, { reply_markup: keyboards.volumeKeyboard })
          break;
        case '/price':
          customerInfo[chatId].units = 'price';
          bot.sendMessage(chatId, phrases.chooseAmount, { reply_markup: keyboards.amountKeyboard });  
          break;
        case '/water':
          customerInfo[chatId].goods = 'water';
          bot.sendMessage(chatId, phrases.volumeOrPrice, { reply_markup: keyboards.volumeOrPrice })
          break;
        case '/richedwater':
          customerInfo[chatId].goods = 'richedwater';
          bot.sendMessage(chatId, phrases.volumeOrPrice, { reply_markup: keyboards.volumeOrPrice })
          break;
        case 'volume-1':
        case 'volume-5':
        case 'volume-6':
        case 'volume-10':
        case 'volume-12':
        case 'volume-19':

        case 'amount-2':
        case 'amount-5':
        case 'amount-10':
        case 'amount-15':
        case 'amount-20':
        case 'amount-30':
      }
    });
    
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      if (!customerInfo[chatId]) {
        customerInfo[chatId] = {};
        customerInfo[chatId].isAuthenticated = false;
      };
      if (customerInfo[chatId].hasOwnProperty('goods')) {
        if (!isNaN(parseFloat(msg.text))) {
          const goods = customerInfo[chatId].goods;
          const units = customerInfo[chatId].units;
          switch (goods) {
            case 'water': 
              if (units === 'volume')
                bot.sendMessage(chatId, `Ви замовили ${msg.text} літрів питної води`)
              else if (units === 'price')
                bot.sendMessage(chatId, `Ви замовили питної води на ${msg.text} гривень`);
              break;
            case 'richedwater': 
              if (units === 'volume')
                bot.sendMessage(chatId, `Ви замовили ${msg.text} літр мінералізованої води`)
              else if (units === 'price')
                bot.sendMessage(chatId, `Ви замовили мінералізованої води на ${msg.text} гривень`)
              break;
          }  
        }
      }
      let userAuth = customerInfo[chatId].isAuthenticated;
      console.log(customerInfo[chatId]);
      console.log(msg.location);
      if (msg.contact) {
        customerInfo[chatId].phone = msg.contact.phone_number;
        customerInfo[chatId].isAuthenticated = true;
        bot.sendMessage(chatId, phrases.congratAuth, { 
          reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }});
      } else if (phoneRegex.test(msg.text)) {
        customerInfo[chatId].phone = msg.text;
        customerInfo[chatId].isAuthenticated = true;
        bot.sendMessage(chatId, phrases.congratAuth);
      } else if (msg.location) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, `${msg.location.latitude} , ${msg.location.longitude}`)
      }

      switch (msg.text) {
        case '/start':
          if (userAuth) 
            bot.sendMessage(msg.chat.id, phrases.mainMenu, {
              reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }
            });
          else {
            bot.sendMessage(msg.chat.id, phrases.greetings, {
              reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
            });
          }
          break;
        case 'До головного меню':
          if (userAuth) {
            bot.sendMessage(msg.chat.id, phrases.mainMenu, {
              reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }
            });  
          }
          else
          bot.sendMessage(msg.chat.id, 'Ви не авторизовані', {
            reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '/login':
          if (userAuth) {
            bot.sendMessage(msg.chat.id, phrases.alreadyAuth, {
              reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }
            });  
          }
          else
          bot.sendMessage(msg.chat.id,  {
            reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Ввести номер автомата': 
          bot.sendMessage(msg.chat.id, phrases.selectGoods, {
            reply_markup: keyboards.twoWaters
          });
          break;
        case 'Відсканувати QR-код':
          bot.sendMessage(msg.chat.id, 'Очікую фото', {
            reply_markup: { keyboard: keyboards.chooseVendor, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '/logout':
        case 'Вийти з акаунту':
          customerInfo[chatId].isAuthenticated = false;
          bot.sendMessage(chatId, phrases.logout, {
            reply_markup: { keyboard: keyboards.login, resize_keyboard: true },
          });
          break;
        case 'Авторизуватись':
        case 'Зареєструватись':
          bot.sendMessage(msg.chat.id, phrases.contactRequest, {
            reply_markup: { keyboard: keyboards.contactRequest, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Відсканувати QR-код': 
          bot.sendMessage(msg.chat.id, phrases.photoRequest, {
            reply_markup: { keyboard: keyboards.contactRequest, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Ні, я введу номер вручну':
          bot.sendMessage(msg.chat.id, phrases.phoneRules);
          break;
        case '⛽️ Купівля товару': 
          bot.sendMessage(msg.chat.id, phrases.chooseVendor, {
            reply_markup: { keyboard: keyboards.chooseVendor, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Ввести номер автомата': 
          bot.sendMessage(msg.chat.id, phrases.enterVendorNum);
          break;
        case '💳 Рахунок':
          bot.sendMessage(msg.chat.id, phrases.accountStatus, {
            reply_markup: { keyboard: keyboards.accountStatus, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '💰 Баланс':
          let currentTime = DateTime.now().toFormat('yy-MM-dd HH:mm:ss');
          let userBalance = 0.00;
          let userSpend = 0.00;
          const balanceMessage = `
          ${currentTime}

          💰 Поточний баланс:
          ${userBalance} БОНУСНИХ грн.

          🔄 Оборот коштів:
          ${userSpend} БОНУСНИХ грн.
          `
          bot.sendMessage(msg.chat.id, balanceMessage, {
            reply_markup: { keyboard: keyboards.accountStatus, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '💸 Поповнити баланс':
          bot.sendMessage(msg.chat.id, phrases.enterTopupAmount, {
            reply_markup: { keyboard: keyboards.returnToBalance, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '⭐️ Бонуси': 
          let userBonusAcc = phrases.userBonusAcc;
          bot.sendMessage(msg.chat.id, userBonusAcc, {
            reply_markup: { keyboard: keyboards.accountStatus, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case '📊 Історія операцій':
          bot.sendMessage(msg.chat.id, phrases.userHistory, {
            reply_markup: { keyboard: keyboards.historyMenu, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
      };
  });
};