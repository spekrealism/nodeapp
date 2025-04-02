const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUpdateBalance } = require('../validators/user.validator');

// Маршруты пользователей
router.get('/users/:userId', userController.getUser);
router.put('/users/:userId/balance', validateUpdateBalance, userController.updateBalance);

// Маршрут для проверки состояния сервера
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

module.exports = router; 