const userService = require('../services/user.service');

class UserController {
  /**
   * Обновление баланса пользователя
   */
  async updateBalance(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const { amount } = req.body;
      
      const updatedUser = await userService.updateBalance(userId, amount);
      
      return res.status(200).json({
        success: true,
        data: {
          userId: updatedUser.id,
          balance: updatedUser.balance,
          updatedAt: updatedUser.updatedAt
        }
      });
    } catch (error) {
      if (error.message === 'Пользователь не найден') {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      } else if (error.message === 'Недостаточно средств на балансе') {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }
      
      console.error('Ошибка при обновлении баланса:', error);
      return res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    }
  }

  /**
   * Получение информации о пользователе
   */
  async getUser(req, res) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await userService.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Пользователь не найден'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          balance: user.balance,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      return res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
      });
    }
  }
}

module.exports = new UserController(); 