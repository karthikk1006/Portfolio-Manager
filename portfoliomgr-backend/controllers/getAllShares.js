const pool = require("../db/connection");

module.exports.getAllShares = async (req, res) => {
  const { userId } = req.params;
  try {
    const client = await pool.connect();
    const query = `
        SELECT so.stock_symbol as symbol, s.name, s.sector, s.current, so.qty, ai.price_purchased, ai.profit_loss
        FROM stock_owned so
        INNER JOIN amount_invested ai ON so.user_id = ai.user_id AND so.stock_symbol = ai.stock_symbol
        INNER JOIN stock s ON so.stock_symbol = s.symbol
        WHERE so.user_id = $1`;
    const { rows } = await pool.query(query, [userId]);
    return res.status(200).json({ status: "success", data: rows });
    Client.release();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
