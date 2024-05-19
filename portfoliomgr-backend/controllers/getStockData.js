const axios = require('axios');
const pool = require('../db/connection');
require("dotenv").config()

const getStockData = async (req, res) => {
  const { userId, stockSymbol } = req.params;
  try {
    const alphaVantageResponse = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${process.env.AV_API_KEY}`);


    // Retrieve the price purchased and purchase date from the amount_invested table
    const client = await pool.connect();
    const purchaseInfoResult = await client.query('SELECT price_purchased, purchase_date FROM amount_invested WHERE user_id = $1 AND stock_symbol = $2', [userId, stockSymbol]);


    client.release();

    const { price_purchased: pricePurchased, purchase_date: purchaseDate } = purchaseInfoResult.rows[0] || {};

    const responseBody = {
      timeSeriesData: alphaVantageResponse.data["Time Series (Daily)"],
      pricePurchased,
      purchaseDate
    };

    res.status(200).json(responseBody);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStockData };
