const pool = require("../db/connection");


module.exports.addShare = async (req,res)=>{

    const {userId} = req.params;
    const {
        stockSymbol,
        qty,
        pricePurchased
    } = req.body;
    try {
        const client = await pool.connect();
        const stockOwnedQuery = `INSERT INTO stock_owned (user_id, stock_symbol, qty) VALUES ($1, $2, $3)`;
        await client.query(stockOwnedQuery, [userId, stockSymbol, qty]);

        const amountInvestedQuery = `INSERT INTO amount_invested (user_id, stock_symbol, price_purchased, current, profit_loss) VALUES ($1, $2, $3, 0, 0)`;
        await client.query(amountInvestedQuery, [userId, stockSymbol, pricePurchased]);

        client.release();
        return res.status(201).json({ message: 'Share added successfully' });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' })
    }
}