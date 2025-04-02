/**
 * Скрипт для нагрузочного тестирования API обновления баланса
 * Запускает множество параллельных запросов на списание средств
 */

const axios = require('axios');

// Конфигурация
const config = {
  apiUrl: 'http://localhost:3000/api/users/1/balance',
  totalRequests: 10000,        // Общее количество запросов
  concurrentRequests: 1000,    // Максимальное число параллельных запросов
  amount: -2                   // Сумма списания для каждого запроса
};

// Функция для отправки одного запроса
async function sendRequest() {
  try {
    const response = await axios.put(config.apiUrl, { amount: config.amount });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      status: error.response?.status,
      error: error.response?.data?.error || error.message 
    };
  }
}

// Функция для группировки массива в чанки
function chunk(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

// Основная функция тестирования
async function runLoadTest() {
  console.log(`Запуск нагрузочного тестирования...`);
  console.log(`Всего запросов: ${config.totalRequests}`);
  console.log(`Параллельных запросов: ${config.concurrentRequests}`);
  console.log(`Сумма списания: ${config.amount}`);
  
  const startTime = Date.now();
  
  // Создаем массив запросов
  const requests = Array.from({ length: config.totalRequests }, () => sendRequest);
  
  // Разбиваем запросы на чанки для ограничения параллелизма
  const chunkedRequests = chunk(requests, config.concurrentRequests);
  
  let successCount = 0;
  let failureCount = 0;
  let errors = {};
  
  // Выполняем запросы по чанкам
  for (const [index, batch] of chunkedRequests.entries()) {
    console.log(`Выполнение пакета ${index + 1}/${chunkedRequests.length}...`);
    
    const results = await Promise.all(batch.map(fn => fn()));
    
    // Анализируем результаты
    results.forEach(result => {
      if (result.success) {
        successCount++;
      } else {
        failureCount++;
        const errorMessage = result.error;
        errors[errorMessage] = (errors[errorMessage] || 0) + 1;
      }
    });
  }
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  // Выводим итоги
  console.log('\n===== Результаты тестирования =====');
  console.log(`Успешных запросов: ${successCount}`);
  console.log(`Неуспешных запросов: ${failureCount}`);
  console.log(`Время выполнения: ${duration.toFixed(2)} секунд`);
  console.log(`Запросов в секунду: ${(config.totalRequests / duration).toFixed(2)}`);
  
  console.log('\nОшибки:');
  Object.entries(errors).forEach(([error, count]) => {
    console.log(`  - ${error}: ${count} запросов`);
  });
}

// Запускаем тест
runLoadTest().catch(console.error);