require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.API_KEY;

//Route to get stock data
app.get('/api/stock/:symbol', async (req,res) => 
{
    const symbol = req.params.symbol
    try{
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${API_KEY}`);
        res.json(response.data);
    }
    catch(error)
    {
        res.status(500).json({error: 'Error fetching data'});
    }
})

app.listen(PORT,() => 
{
    console.log(`Server running on http://localhost:${PORT}`);
})