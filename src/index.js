require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middlewares/error.middleware');
const db = require('./models');

// Инициализация приложения Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use(morgan('dev'));

// Маршруты API
app.use('/api', routes);

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
const server = app.listen(PORT, async () => {
  try {
    // Проверка подключения к базе данных
    await db.sequelize.authenticate();
    console.log('Подключение к базе данных установлено.');
    
    console.log(`Сервер запущен на порту ${PORT}`);
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
    process.exit(1);
  }
});

// Обработка завершения работы приложения
process.on('SIGINT', async () => {
  console.log('Завершение работы приложения...');
  await db.sequelize.close();
  server.close(() => {
    console.log('Сервер остановлен.');
    process.exit(0);
  });
});

module.exports = app; 