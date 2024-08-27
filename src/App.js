import React, { useState, useEffect } from 'react';
import {
  calculateMean,
  calculateStandardDeviation,
  calculateMode,
  calculateMin,
  calculateMax
} from './utils/calculations'; // Допустим, у нас есть модуль для расчетов

function App() {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({
    mean: 0,
    stdDev: 0,
    mode: null,
    min: null,
    max: null,
  });

  useEffect(() => {
    const socket = new WebSocket('wss://trade.termplat.com:8800/?password=1234');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received quote:', data);
      setQuotes((prevQuotes) => [...prevQuotes, data]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const mean = calculateMean(quotes);
      const stdDev = calculateStandardDeviation(quotes);
      const mode = calculateMode(quotes);
      const min = calculateMin(quotes);
      const max = calculateMax(quotes);

      const newStats = {
        mean,
        stdDev,
        mode,
        min,
        max,
        timestamp: new Date().toISOString(),
      };

      setStats(newStats);

      // Отправка статистики на сервер с дополнительной отладкой
      fetch('http://localhost:8888/reactjs/spa-stock-quotes/save-statistics.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStats),
      })
          .then(response => response.text()) // Используем .text() для получения полного ответа
          .then(data => {
            console.log('Response from server:', data); // Здесь мы выводим полный ответ сервера
          })
          .catch(error => {
            console.error('Error saving statistics:', error);
          });
    }
  }, [quotes]);

  return (
      <div className="App">
        <h1>Stock Quotes Statistics</h1>
        <div>
          <p>Mean: {stats.mean}</p>
          <p>Standard Deviation: {stats.stdDev}</p>
          <p>Mode: {stats.mode}</p>
          <p>Min: {stats.min}</p>
          <p>Max: {stats.max}</p>
        </div>
        <ul>
          {quotes.map((quote, index) => (
              <li key={index}>{JSON.stringify(quote)}</li>
          ))}
        </ul>
      </div>
  );
}

export default App;
