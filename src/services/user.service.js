const db = require('../models');
const { Sequelize } = db;

class UserService {
  /**
   * Получить пользователя по ID
   */
  async getUserById(userId) {
    return await db.User.findByPk(userId);
  }

  /**
   * Обновить баланс пользователя
   * Ключевая идея: используем SQL-функцию GREATEST, чтобы гарантировать, 
   * что баланс не станет отрицательным на уровне базы данных
   */
  async updateBalance(userId, amount) {
    // Конвертируем amount в число с плавающей точкой
    const numericAmount = parseFloat(amount);
    
    // Проверяем, существует ли пользователь
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Оптимистичная проверка (быстрее, но может давать ложные отрицательные результаты при конкурентных запросах)
    if (numericAmount < 0 && Math.abs(numericAmount) > user.balance) {
      throw new Error('Недостаточно средств на балансе');
    }

    // Это атомарная операция, которая обеспечивает согласованность данных при параллельных запросах
    const result = await db.sequelize.transaction(async (t) => {
      // Используем UPDATE с оптимистической блокировкой и атомарным вычислением нового баланса
      const [affectedRows] = await db.sequelize.query(
        `UPDATE users 
         SET balance = GREATEST(balance + :amount, 0),
             "updatedAt" = NOW()
         WHERE id = :userId AND (balance + :amount) >= 0
         RETURNING *`,
        {
          replacements: { 
            userId, 
            amount: numericAmount 
          },
          type: Sequelize.QueryTypes.UPDATE,
          transaction: t
        }
      );
      
      // Проверяем результат обновления
      if (!affectedRows || affectedRows.length === 0) {
        throw new Error('Недостаточно средств на балансе');
      }
      
      return affectedRows[0];
    });
    
    return result;
  }
}

module.exports = new UserService(); 