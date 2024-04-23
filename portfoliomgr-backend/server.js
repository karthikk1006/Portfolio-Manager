const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config()
const router = require("./routes/router")
const app = express()



// GLOBAL VARIABLES
PORT = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors()); 

app.use("/api/v1",router)

app.listen(PORT,()=>{
    console.log( "Server listening on port "+ PORT );
});

// const { rows } = await client.query('BEGIN');
// sample query execution
// const client = await pool.connect(); do this before
// client.release(); in end