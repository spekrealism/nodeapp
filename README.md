# Сервис для управления балансом пользователей

Простое веб-приложение на Node.js (Express) и PostgreSQL (Sequelize ORM) для управления балансом пользователей.

## Функциональность

- При запуске приложение создает таблицу `users` и добавляет пользователя с балансом 10000
- Реализован API-маршрут для обновления баланса пользователя (пополнение и списание)
- Баланс не может быть отрицательным
- Операции с балансом выполняются атомарно, поддерживают параллельные запросы

## Технологии

- Node.js + Express
- PostgreSQL
- Sequelize ORM + Umzug (для миграций)
- Docker и Docker Compose

## Структура проекта

```
.
├── config/                  # Конфигурация приложения
├── src/
│   ├── controllers/         # Контроллеры
│   ├── middlewares/         # Промежуточные обработчики
│   ├── migrations/          # Миграции базы данных
│   ├── models/              # Модели данных
│   ├── routes/              # Маршруты API
│   ├── services/            # Бизнес-логика
│   ├── validators/          # Валидация данных
│   ├── utils/               # Вспомогательные функции
│   └── index.js             # Точка входа приложения
├── .env                     # Файл с переменными окружения
├── .env.example             # Пример файла с переменными окружения
├── Dockerfile               # Конфигурация образа Docker
├── docker-compose.yml       # Конфигурация Docker Compose
└── package.json             # Зависимости и скрипты NPM
```

## Запуск с использованием Docker

1. Клонируйте репозиторий:
   ```
   git clone <repository-url>
   cd nodeapp
   ```

2. Запустите приложение с помощью Docker Compose:
   ```
   docker-compose up -d
   ```

3. Приложение будет доступно по адресу: http://localhost:3000

4. Создайте и настройте файл .env (можно скопировать из .env.example)

5. Установите зависимости:
   ```
   docker-compose exec app npm run migrate
   ```

## API

### Получение информации о пользователе

```
GET /api/users/:userId
```

### Обновление баланса пользователя

```
PUT /api/users/:userId/balance
```

Тело запроса:
```json
{
  "amount": 100 // Положительное значение для пополнения, отрицательное для списания
}
```

## Тестирование под нагрузкой

Для тестирования можно использовать инструменты нагрузочного тестирования, например, Apache Bench или Artillery:

```
ab -n 10000 -c 1000 -T "application/json" -p payload.json http://localhost:3000/api/users/1/balance
```

где payload.json содержит:
```json
{
  "amount": -2
}
``` 