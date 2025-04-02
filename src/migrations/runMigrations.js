const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
const db = require('../models');

const umzug = new Umzug({
  migrations: { 
    glob: path.join(__dirname, './migrations/*.js'),
    resolve: ({ name, path, context }) => {
      const migration = require(path);
      return {
        name,
        up: async () => migration.up(context, db.Sequelize),
        down: async () => migration.down(context, db.Sequelize)
      };
    }
  },
  context: db.sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db.sequelize }),
  logger: console,
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Подключение к базе данных установлено.');
    
    await umzug.up();
    console.log('Все миграции успешно выполнены.');
    
    // Создаем пользователя, если таблица существует, но пользователей ещё нет
    const userCount = await db.User.count();
    if (userCount === 0) {
      await db.User.create({ balance: 10000 });
      console.log('Создан пользователь с балансом 10000.');
    } else {
      console.log('Пользователи уже существуют в базе данных.');
    }
    
    if (process.env.NODE_ENV !== 'production') {
      process.exit(0);
    }
  } catch (error) {
    console.error('Ошибка при выполнении миграций:', error);
    process.exit(1);
  }
})(); 