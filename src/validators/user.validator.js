const { body, param, validationResult } = require('express-validator');

// Валидация параметров для обновления баланса
const validateUpdateBalance = [
  param('userId')
    .isInt({ min: 1 })
    .withMessage('ID пользователя должен быть положительным целым числом'),
  
  body('amount')
    .isNumeric()
    .withMessage('Сумма должна быть числом')
    .notEmpty()
    .withMessage('Сумма является обязательным параметром'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateUpdateBalance
}; 