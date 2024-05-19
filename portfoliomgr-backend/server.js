const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config()
const router = require("./routes/router");
const cron = require("node-cron");
const axios = require("axios")
const app = express()

const pool = require("./db/connection")


// GLOBAL VARIABLES
PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors()); 

app.use("/api/v1",router)

app.listen(PORT,()=>{
    console.log( "Server listening on port "+ PORT );
});

cron.schedule('1 1 0 * * *',async function() {
    try {
      
      console.log('running a task every first second of first minute of all day every day');
      const client = await pool.connect(); 
  
      const {rows} = await client.query("SELECT DISTINCT symbol FROM stock_price");
      await Promise.all(rows.map(async (row) => {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${row.symbol}&apikey=${process.env.AV_API_KEY}`);
        const timeSeriesData = response.data['Time Series (Daily)'];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = yesterday.toISOString().split('T')[0];
        const yesterdayData = timeSeriesData[yesterdayDate];
      }));
      const updateQuery = `UPDATE stock_price SET current = ${yesterdayData['4. close']},     low = ${yesterdayData['3. low']},     high = ${yesterdayData['2. high']},     date = '${yesterdayDate}' WHERE symbol = '${row.symbol}'`;
      await client.query(updateQuery);
      console.log(row.symbol);
      console.log(yesterdayData);
      client.release();
    } catch (error) {
      console.error('Error:', error);
    }

  });
// const { rows } = await client.query('BEGIN');
// sample query execution
// const client = await pool.connect(); do this before
// client.release(); in end