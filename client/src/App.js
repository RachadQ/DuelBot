import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
function App() {

  const chartContainerRef = useRef();
  const chart = useRef();
  const [symbol, setSymbol] = useState('AAPL'); // Default stock symbol
  const [data, setData] = useState([]);

  const fetchData = async (symbol) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
        console.log('API Response:', response.data); // Log the entire response data

        if (response.data.Information) {
            console.error('API usage limit reached:', response.data.Information);
            alert(response.data.Information); // Display an alert with the message
            return; // Exit the function early
        }

        if (!response.data || !response.data['Time Series (1min)']) {
            throw new Error('Invalid response format');
        }

        const timeSeries = response.data['Time Series (1min)'];
        const formattedData = Object.keys(timeSeries).map((time) => {
            const date = time.split(' ')[0]; // Extract date part only
            return {
                time: date, // Use only the date part
                value: parseFloat(timeSeries[time]['4. close']),
            };
        });

        // Sort the data by time in ascending order
        formattedData.sort((a, b) => new Date(a.time) - new Date(b.time));

        setData(formattedData);
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
    }
};

  useEffect(() => {
    fetchData(symbol);
  }, [symbol]);


  // Set up chart
  useEffect(() => {
    if (chartContainerRef.current) {
      chart.current = createChart(chartContainerRef.current, { width: 600, height: 400 });
      const lineSeries = chart.current.addLineSeries();
      lineSeries.setData(data);
    }
  }, [data]);

  return (
    <div className="App">
      <div>
      <h1>TradingView Clone</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
        placeholder="Enter stock symbol (e.g., AAPL)"
      />
      <div ref={chartContainerRef} style={{ position: 'relative', width: '600px', height: '400px' }} />
    </div>
    </div>
  );
}

export default App;
