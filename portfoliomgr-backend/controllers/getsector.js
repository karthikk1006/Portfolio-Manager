const pool = require("../db/connection");

module.exports.getSector = async (req,res) => {
    const userId = parseInt(req.params.userId);
    const client = await pool.connect();
    try {
        const query = `
      SELECT s.sector AS sector, COUNT(so.stock_symbol) AS stock_count
      FROM stock_owned so
      JOIN stock s ON s.symbol = so.stock_symbol
      WHERE so.user_id = $1
      GROUP BY s.sector;
    `;
    const {rows} = await client.query(query, [userId]);
    res.status(200).json({ status:"success",data: rows });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}