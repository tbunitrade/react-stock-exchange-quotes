import React, { useState, useEffect } from 'react';

function App() {
  const [quotes, setQuotes] = useState([]);

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

  return (
      <div className="App">
        <h1>Stock Quotes</h1>
        <ul>
          {quotes.map((quote, index) => (
              <li key={index}>{JSON.stringify(quote)}</li>
          ))}
        </ul>
      </div>
  );
}

export default App;
