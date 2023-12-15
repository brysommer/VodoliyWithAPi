import { bot } from "./app.js";
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
//import { generateKeyboard } from './src/plugins.mjs';
import axios from 'axios';
import { findNearestCoordinate } from './modules/locations.js';
import { numberFormatFixing } from './modules/validations.js';



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
          logger.info(`USER_ID: ${chatId} used ${1} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'volume-5':
          logger.info(`USER_ID: ${chatId} used ${5} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'volume-6':
          logger.info(`USER_ID: ${chatId} used ${6} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;

        case 'volume-10':
          logger.info(`USER_ID: ${chatId} used ${10} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;

        case 'volume-12':
          logger.info(`USER_ID: ${chatId} used ${12} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;

        case 'volume-19':
          logger.info(`USER_ID: ${chatId} used ${19} litr from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;


        case 'amount-2':
          logger.info(`USER_ID: ${chatId} used ${2} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'amount-5':
          logger.info(`USER_ID: ${chatId} used ${5} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'amount-10':
          logger.info(`USER_ID: ${chatId} used ${10} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'amount-15':
          logger.info(`USER_ID: ${chatId} used ${15} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'amount-20':
          logger.info(`USER_ID: ${chatId} used ${20} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
        case 'amount-30':
          logger.info(`USER_ID: ${chatId} used ${30} UAH from the balance`);
          await updateUserByChatId(chatId, { goods: '', units: '' });
          bot.sendMessage(chatId, 'Операція успішна')
          break;
      }
    });
    
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      try {
        const userInfo = await findUserByChatId(chatId);
        let dialogueStatus;
        let isAuthenticated;
        let birthDaydate;
        let userDatafromApi;
        if (userInfo) {
          dialogueStatus = userInfo.dialoguestatus;
          isAuthenticated = userInfo.isAuthenticated;
          birthDaydate = userInfo.birthdaydate;
          if (userInfo?.lastname) {
            const data = JSON.parse(userInfo?.lastname);
            userDatafromApi = data;
          }
          
        }
  
      } catch (error) {
        
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
        const phone = numberFormatFixing(msg.contact.phone_number);
        try {
          await updateUserByChatId(chatId, { phone, dialoguestatus: 'name' });
          await bot.sendMessage(chatId, `Введіть ПІБ`);
        } catch (error) {
          logger.warn(`Cann't update phone number`);
        }
      } else if (dialogueStatus === 'name') {
        await updateUserByChatId(chatId, { firstname: msg.text, dialoguestatus: 'birdaydate' });
        await bot.sendMessage(chatId, `Введіть дату народження в форматі ДД.ММ.РРРР. Наприклад 05.03.1991`);
      } else if (dialogueStatus === 'topup') {
        await updateUserByChatId(chatId, { dialoguestatus: '' });
        await bot.sendMessage(chatId, `Ви поповнюєте рахунок на ${msg.text} грн.`, {reply_markup: { inline_keyboard: [[{ 
          text: 'Перейти до оплати',
          url: `https://easypay.ua/ua/partners/vodoleylviv-card?amount=${msg.text}`,
        }]] }});
      } else if (dialogueStatus === 'buyFromAccount') {
        await updateUserByChatId(chatId, { dialoguestatus: '' });
        bot.sendMessage(msg.chat.id, phrases.selectGoods, {
          reply_markup: keyboards.twoWaters
        });
      } else if (dialogueStatus === 'birdaydate') {
        
        await updateUserByChatId(chatId, { birthdaydate: msg.text, dialoguestatus: '' });
        await userLogin(chatId);

        console.log(userInfo.phone);
        console.log(userInfo.firstname);
        console.log(msg.text);
        const newUser = await axios.post('http://soliton.net.ua/water/api/user/add/index.php', {
          phone_number: userInfo.phone,
          name: userInfo.firstname,
          date_birth: msg.text,
          email: 'brys@gmail.com'
        });
        const userCard = await axios.get(`http://soliton.net.ua/water/api/user/index.php?phone=${userInfo.phone}`);
        await updateUserByChatId(chatId, { lastname: JSON.stringify(userCard.data.user) }); 
        console.log(newUser.data);
        if (newUser.data.status) {
          logger.info(`USER_ID: ${chatId} registred`);
          bot.sendMessage(chatId, phrases.congratAuth, { 
            reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }});  
        }
      } else if (dialogueStatus === 'numberlogin') {
        if (msg.contact.phone_number) {
          const phone = numberFormatFixing(msg.contact.phone_number);
          console.log(phone)
          const userCard = await axios.get(`http://soliton.net.ua/water/api/user/index.php?phone=${phone}`);
          await updateUserByChatId(chatId, { lastname: JSON.stringify(userCard.data.user) }); 
          console.log(userCard);
          console.log(userCard.data.user);
          userDatafromApi = userCard.data.user;
          console.log(userDatafromApi);
        }
         

        await updateUserByChatId(chatId, { dialoguestatus: 'birthdaylogin' }); 
        await bot.sendMessage(chatId, `Введіть дату народження у форматі ДД.ММ.РРРР. Наприклад 05.03.1991`);
      } else if (dialogueStatus === 'birthdaylogin') {
        console.log(userDatafromApi);
        console.log(userDatafromApi?.date_birth);
        if (userDatafromApi?.date_birth === msg.text ) {
          bot.sendMessage(chatId, JSON.stringify(userDatafromApi));
        }
        if (msg.text === birthDaydate) {
          
          await updateUserByChatId(chatId, { dialoguestatus: '' });
          await userLogin(chatId);
          logger.info(`USER_ID: ${chatId} loggin`);  
          bot.sendMessage(chatId, phrases.congratAuth, { 
            reply_markup: { keyboard: keyboards.mainMenu, resize_keyboard: true, one_time_keyboard: true }});  
        } else {
          bot.sendMessage(chatId, `Дата ${msg.text} не відповідає номеру ${userInfo.phone}. Спробуйте ще раз`);  
        }
      } else if (msg.location) {
        logger.info(`USER_ID: ${chatId} share location`);
        const locations = await axios.get('http://soliton.net.ua/water/api/devices');
        const targetCoordinate = {lat: msg.location.latitude, lon: msg.location.longitude};
        console.log(locations.data.devices);
        const nearest = findNearestCoordinate(locations.data.devices, targetCoordinate);
        //bot.sendMessage(chatId, `${msg.location.latitude} , ${msg.location.longitude}`);

        bot.sendMessage(chatId, `${nearest.name}`);

        bot.sendLocation(chatId, nearest.lat, nearest.lon);
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
        case 'Акції і новини':
          const news = await axios.get('http://soliton.net.ua/water/api/news');
          news.data.news.forEach(element => {
            bot.sendMessage(msg.chat.id, `
            ${element.date}

            ${element.title}

            ${element.desc}
            ` );  
          });
          console.log(news.data);
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
          await updateUserByChatId(chatId, { dialoguestatus: 'buyFromAccount' });
          break;
        case 'Ввести номер автомата': 
          bot.sendMessage(msg.chat.id, phrases.enterVendorNum);
          break;
        case '💳 Рахунок':
          bot.sendMessage(msg.chat.id, phrases.accountStatus, {
            reply_markup: { keyboard: keyboards.accountStatus, resize_keyboard: true, one_time_keyboard: true }
          });
          break;
        case 'Мій профіль':
          /* Оновлювати актуальну інформацію
          const userCard = await axios.get(`http://soliton.net.ua/water/api/user/index.php?phone=${userInfo.phone}`);
          await updateUserByChatId(chatId, { lastname: JSON.stringify(userCard.data.user) }); 
          */
          let currentTime = DateTime.now().toFormat('yy-MM-dd HH:mm:ss');
          const balanceMessage = `
            ${userDatafromApi.name}
          ${currentTime}
          Тип карти: ${userDatafromApi.card[0].CardGroup}

          💰 Поточний баланс:
          
          ${userDatafromApi.card[0].WaterQty} БОНУСНИХ грн.

          🔄 Оборот коштів:
          ${userDatafromApi.card[0].AllQty} БОНУСНИХ грн.

          Знижка: ${userDatafromApi.card[0].Discount}%
          `
          bot.sendMessage(msg.chat.id, balanceMessage, /*{
            reply_markup: { keyboard: keyboards.accountStatus, resize_keyboard: true, one_time_keyboard: true }
          }*/);
          break;
        case '💸 Поповнити картку':
          bot.sendMessage(msg.chat.id, phrases.enterTopupAmount, {
            reply_markup: { keyboard: keyboards.returnToBalance, resize_keyboard: true, one_time_keyboard: true }
          });
          await updateUserByChatId(chatId, { dialoguestatus: 'topup' });
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