const pool = require("../db/connection");

module.exports.addShare = async (req, res) => {
  const { userId } = req.params;
  const { stockSymbol, qty, pricePurchased } = req.body;
  console.log(userId, stockSymbol, qty, pricePurchased);
  try {
    const client = await pool.connect();

    const stockDataQuery = `SELECT * FROM stock WHERE symbol = $1`;
    const { rows } = await client.query(stockDataQuery, [stockSymbol]);
    const stockData = rows[0];

    const stockOwnedQuery = `INSERT INTO stock_owned (user_id, stock_symbol, qty) VALUES ($1, $2, $3)`;
    await client.query(stockOwnedQuery, [userId, stockSymbol, qty]);

    const currentPrice = stockData.current;
    const profitOrLoss = qty * pricePurchased - qty * currentPrice;

    const amountInvestedQuery = `INSERT INTO amount_invested (user_id, stock_symbol, price_purchased, profit_loss) VALUES ($1, $2, $3, $4)`;
    await client.query(amountInvestedQuery, [
      userId,
      stockSymbol,
      pricePurchased,
      profitOrLoss,
    ]);

    client.release();
    return res.status(201).json({ message: "Share added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
