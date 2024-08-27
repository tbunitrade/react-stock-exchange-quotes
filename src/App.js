import React, { useState, useEffect } from 'react';
import {
  calculateMean,
  calculateStandardDeviation,
  calculateMode,
  calculateMin,
  calculateMax
} from './utils/calculations';

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

    // Cleanup WebSocket connection when the component unmounts
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

      setStats({
        mean,
        stdDev,
        mode,
        min,
        max,
      });
    }
  }, [quotes]);

  return (
      <div className="App">
        <h1>Stock Quotes</h1>
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
