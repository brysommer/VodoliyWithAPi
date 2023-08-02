import { bot } from "./app.mjs";
import { phrases, keyboards } from './language_ua.mjs';
import { logger } from './logger/index.mjs';
import { DateTime } from "luxon";
import { 
  updateUserByChatId,
  userLogin,
  userLogout,
  findUserByChatId,
  createNewUserByChatId
} from './models/users.mjs';
import { generateKeyboard } from './src/plugins.mjs'



export const anketaListiner = async() => {
  
    bot.setMyCommands([
      {command: '/start', description: 'До головного меню'},
      {command: '/login', description: 'Авторизація існуючого користувача'},
      {command: '/register', description: 'Реєстрація нового користувача'},
      {command: '/logout', description: 'Вийти з акаунту'}
    ]);
  
    bot.on("callback_query", async (query) => {

      const action = query.data;
      const chatId = query.message.chat.id;
      
      switch (action) {
        case  '/volume':
          await updateUserByChatId(chatId, { units: 'volume' })
          bot.sendMessage(chatId, phrases.chooseVolume, { reply_markup: keyboards.volumeKeyboard })
          break;
        case '/price':
          await updateUserByChatId(chatId, { units: 'price' })
          bot.sendMessage(chatId, phrases.chooseAmount, { reply_markup: keyboards.amountKeyboard });  
          break;
        case '/water':
          await updateUserByChatId(chatId, { goods: 'water' })
          bot.sendMessage(chatId, phrases.volumeOrPrice, { reply_markup: keyboards.volumeOrPrice })
          break;
        case '/richedwater':
          await updateUserByChatId(chatId, { goods: 'richedwater' })
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
      const userInfo = await findUserByChatId(chatId);
      let dialogueStatus;
      let isAuthenticated;
      let birthDaydate;
      if (userInfo) {
        dialogueStatus = userInfo.dialoguestatus;
        isAuthenticated = userInfo.isAuthenticated;
        birthDaydate = userInfo.birthdaydate;
      }

    
    
      if (!isNaN(parseFloat(msg.text))) {
        const goods = userInfo.goods;
        const units = userInfo.units;
        switch (goods) {
          case 'water': 
            if (units === 'volume') {
              bot.sendMessage(chatId, `Ви замовили ${msg.text} літрів питної води`);
              logger.info(`USER_ID: ${chatId} make an order`);
            } else if (units === 'price') {
              logger.info(`USER_ID: ${chatId} make an order`);
              bot.sendMessage(chatId, `Ви замовили питної води на ${msg.text} гривень`);
            }
            break;
          case 'richedwater': 
            if (units === 'volume') {
              logger.info(`USER_ID: ${chatId} make an order`);
              bot.sendMessage(chatId, `Ви замовили ${msg.text} літр мінералізованої води`);
            } else if (units === 'price') {
              logger.info(`USER_ID: ${chatId} make an order`);
              bot.sendMessage(chatId, `Ви замовили мінералізованої води на ${msg.text} гривень`);
            }
            break;
        }  
      }
      if (msg.contact && dialogueStatus === '') {
        try {
          await updateUserByChatId(chatId, { phone: msg.contact.phone_number, dialoguestatus: 'name' });
          await bot.sendMessage(chatId, `Введіть ПІБ`);
        } catch (error) {
          logger.warn(`Cann't update phone number`);
        }
      } else if (dialogueStatus === 'name') {
        await updateUserByChatId(chatId, { firstname: msg.text, dialoguestatus: 'birdaydate' });
        await bot.sendMessage(chatId, `Введіть дату народження в форматі ДД.ММ.РРРР. Наприклад 05.03.1991`);
      } else if (dialogueStatus === 'birdaydate') {
        await updateUserByChatId(chatId, { birthdaydate: msg.text, dialoguestatus: '' });
        await userLogin(chatId);
        logger.info(`USER_ID: ${chatId} registred`);
        bot.sendMessage(chatId, phrases.congratAuth, { 
          reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }});
      } else if (dialogueStatus === 'numberlogin') {
        await updateUserByChatId(chatId, { dialoguestatus: 'birthdaylogin' }); 
        await bot.sendMessage(chatId, `Введіть дату народження у форматі ДД.ММ.РРРР. Наприклад 05.03.1991`);
      } else if (dialogueStatus === 'birthdaylogin') {
        if (msg.text === birthDaydate) {
          await updateUserByChatId(chatId, { dialoguestatus: '' });
          await userLogin(chatId);
          logger.info(`USER_ID: ${chatId} loggin`);  
          bot.sendMessage(chatId, phrases.congratAuth, { 
            reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }});  
        } else {
          bot.sendMessage(chatId, `Дата ${msg.text} не відповідає номеру ${userInfo.phone}`);  
        }
      } else if (msg.location) {
        logger.info(`USER_ID: ${chatId} share location`);
        bot.sendMessage(chatId, `${msg.location.latitude} , ${msg.location.longitude}`);
      }

      switch (msg.text) {
        case '/start':
          if(userInfo) await updateUserByChatId(chatId, { dialoguestatus: '' });
          if (isAuthenticated) 
            bot.sendMessage(msg.chat.id, phrases.mainMenu, {
              reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }
            });
          else {
            logger.info(`USER_ID: ${chatId} join BOT`);
            bot.sendMessage(msg.chat.id, phrases.greetings, {
              reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
            });  
          }
          break;
        case 'Повернутися до головного меню':
        case 'До головного меню':
          if (isAuthenticated) {
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
          if (isAuthenticated) {
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
          try {
            await userLogout(chatId);
            logger.info(`USER_ID: ${chatId} logged out`);
            bot.sendMessage(chatId, phrases.logout, {
              reply_markup: { keyboard: keyboards.login, resize_keyboard: true },
            });  
          } catch (error) {
            logger.warn(`Can't loggout`)
          }
          break;
        case 'Авторизуватись':
          if(userInfo) {
            await updateUserByChatId(chatId, { dialoguestatus: 'numberlogin' });
            await bot.sendMessage(msg.chat.id, phrases.contactRequest, {
              reply_markup: { keyboard: keyboards.contactRequest, resize_keyboard: true, one_time_keyboard: true }
            });
             
          } else {
            await bot.sendMessage(msg.chat.id, phrases.registerRequest, {
              reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
            });
          };
          break;  
        case 'Зареєструватись':
        case '/register':
          if(userInfo) {
            bot.sendMessage(chatId, `Ви вже зареєстровані, будь ласка, авторизуйтесь`,{
              reply_markup: { keyboard: keyboards.login, resize_keyboard: true, one_time_keyboard: true }
            });
          } else {
            await createNewUserByChatId(chatId);
            bot.sendMessage(msg.chat.id, phrases.contactRequest, {
              reply_markup: { keyboard: keyboards.contactRequest, resize_keyboard: true, one_time_keyboard: true }
            });  
          }
          break;
        case 'Відсканувати QR-код': 
          bot.sendMessage(msg.chat.id, phrases.photoRequest, {
            reply_markup: { keyboard: keyboards.contactRequest, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Ні, я введу номер вручну':
          bot.sendMessage(msg.chat.id, phrases.phoneRules);
          break;
        case '⛽️ Купити воду': 
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
        case '💸 Поповнити картку':
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