import { generateKeyboard } from './src/plugins.mjs'

const phrases = {
    greetings: 'Привіт, я бот Водолій. З моєю допомогою Ви зможете отримати віртуальну картку, купувати воду безготівковим способом, отримувати бонуси, шукати найближчі автомати та багато іншого. Авторизуйся або зареєструйся для доступу до усіх можливостей.',
    contactRequest: 'Нам потрібен ваш номер телефону. Отримати з контактних даних телеграм?',
    dataConfirmation: (customerName, customerPhone) => {
        return `Ваш номер телефону: ${customerPhone}. Ваше імя ${customerName}. Дані вірні?`;
    },
    thanksForOrder: (customerName) => {
        return `Замовлення успішно оформлено. Дякую ${customerName}`;
    },
    congratAuth: '🎉 Ви успішно авторизувались.', 
    congratRegister: '🎉 Ви успішно зареєструвались та авторизувались.',
    mainMenu: '📋 Головне меню',
    alreadyAuth: 'Ви вже авторизовані',
    logout: '🔑 Ви вийшли з акаунту.',
    wrongPhone: 'Невірний номер телефону. Будь ласка, введіть номер телефону ще раз:',
    phoneRules: 'Введіть ваш номер телефону без +. Лише цифри. І відправте повідомлення',
    nameRequest: 'Введіть своє ім\'я:',
    chooseVendor: 'Введіть номер автомату',
    enterVendorNum: 'Будь ласка, введіть номер автомата.',
    accountStatus: '💳 Рахунок',
    enterTopupAmount: 'Введіть сумму в грн, на яку хочете поповнити. На цю суму будуть нараховані бонуси згідно Вашого бонусного профілю',
    userHistory: '📊 Історія операцій',
    chooseVolume: `👉 Виберіть потрібну кількість літрів продукту.  ✏️ Або напишіть об’єм продукту у літрах цілим числом чи з дробною частиною.`,
    chooseAmount: '👉 Виберіть потрібну сумму у грн на яку бажаєте придбати продукт. ✏️ Або напишіть суму покупки у гривнях цілим числом чи з дробною частиною.',
    userBonusAcc: `💫 Ваші бонуси при обороті/n✅ 0 БОНУСНИХ грн /n20% від поповнення/n
    ↗️ 1000 БОНУСНИХ грн 30% від поповнення
    ↗️ 2000 БОНУСНИХ грн 30% від поповнення
    ↗️ 3000 БОНУСНИХ грн 30% від поповнення
    ↗️ 4000 БОНУСНИХ грн 30% від поповнення
    🌟 Додаткові бонуси: 
    За поповнення онлайн: 5% від поповнення
    За поповнення QR кодом: 5% від поповнення
    `,
    selectGoods: 'Виберіть будь ласка продукт із доступних:',
    volumeOrPrice: 'Виберіть будь ласка як саме ви хочете вказати кількість продукту:',
    registerRequest: 'Будь ласка, зареєструйтесь для доступу до функціоналу бота'
  };
  
const keyboards = {
    contactRequest: [
      [ { text: 'Так', request_contact: true, }, { text: 'Почати спочатку' } ]
    ],
    dataConfirmation: [
      ['Так, Оформити замовлення'],
      ['Ні, повторити введення'],
      ['/start'],
    ],
    mainMenu: generateKeyboard(2, [ [{ text: '⛽️ Купити воду' }], [{ text: '💸 Поповнити картку' }], [{ text: 'Знайти найближчий автомат', request_location: true, }], [{text: 'Акції і новини'}], [{text: 'Мій профіль'}], [{text: 'Служба підтримки'}] ]),
    login: [[{ text: 'Авторизуватись' }, { text: 'Зареєструватись' }]],
    chooseVendor: generateKeyboard(1, [[{ text: 'Знайти найближчий автомат по геолокації', request_location: true, }], [{text: 'Повернутися до головного меню'}]]),
    accountStatus: generateKeyboard(3,  [['💰 Баланс'], ['💸 Поповнити баланс'], ['⭐️ Бонуси'], ['📊 Історія операцій'], ['До головного меню']]),
    returnToBalance: [['💳 Рахунок']],
    historyMenu: [['Остання операція за рахунком'], ['💳 Рахунок']],
    volumeKeyboard: { 
      inline_keyboard: [
      [{ text: '1', callback_data: 'volume-1' }, { text: '5', callback_data: 'volume-5' }, { text: '6', callback_data: 'volume-6' }],
      [{ text: '10', callback_data: 'volume-10' }, { text: '12', callback_data: 'volume-12' }, { text: '19', callback_data: 'volume-19' }]
    ]},
    amountKeyboard: { 
      inline_keyboard: [
      [{ text: '2', callback_data: 'volume-2' }, { text: '5', callback_data: 'volume-5' }, { text: '10', callback_data: 'volume-10' }],
      [{ text: '15', callback_data: 'volume-15' }, { text: '20', callback_data: 'volume-20' }, { text: '30', callback_data: 'volume-30' }]
    ]},
    twoWaters: { 
      inline_keyboard: [
      [{ text: 'Питна вода - 1.5 грн/л', callback_data: '/water' } ],
      [{ text: 'Мінералізована вода - 2.0 грн/л', callback_data: '/richedwater' }]
    ]},
    volumeOrPrice: { 
      inline_keyboard: [
      [{ text: 'Обєм в літрах', callback_data: '/volume' } ],
      [{ text: 'Сумма в гривнях', callback_data: '/price' }]
    ]},
    
};

export { phrases, keyboards }

