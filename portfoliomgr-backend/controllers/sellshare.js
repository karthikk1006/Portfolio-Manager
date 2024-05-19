const pool = require("../db/connection");

module.exports.sellShare = async (req, res) => {
  const { user_id, stock_symbol, qty } = req.body;
  const client = await pool.connect(); 

  try {
      // qty is qty sold
      await client.query('BEGIN');

      // Fetch current qty from stock_owned
      const stockOwnedResult = await client.query(
        'SELECT qty FROM stock_owned WHERE user_id = $1 AND stock_symbol = $2',
        [user_id, stock_symbol]
      );

      if (stockOwnedResult.rows.length === 0) {
        throw new Error('Stock not found for user');
      }

      const currentQty = stockOwnedResult.rows[0].qty;

      if (currentQty < qty) {
        throw new Error('Not enough shares to sell');
      }

      const newQty = currentQty - qty;
      // Update stock_owned table
      await client.query(
        'UPDATE stock_owned SET qty = $1 WHERE user_id = $2 AND stock_symbol = $3',
        [newQty, user_id, stock_symbol]
      );

      // Fetch price_purchased from amount_invested
      const amountInvestedResult = await client.query(
        'SELECT price_purchased FROM amount_invested WHERE user_id = $1 AND stock_symbol = $2',
        [user_id, stock_symbol]
      );

      if (amountInvestedResult.rows.length === 0) {
        throw new Error('Investment not found for user');
      }

      const pricePurchased = amountInvestedResult.rows[0].price_purchased;

      // Fetch current stock price from stock table
      const stockPriceResult = await client.query(
        'SELECT current FROM stock_price WHERE symbol = $1',
        [stock_symbol]
      );

      if (stockPriceResult.rows.length === 0) {
        throw new Error('Current stock price not found');
      }

      const currentPrice = stockPriceResult.rows[0].current;

      // Calculate profit or loss
      const profitLoss = (currentPrice - pricePurchased) * parseInt(qty);

      // Update user table p_or_l column
      await client.query(
        'UPDATE "user" SET p_or_l = (p_or_l + $1) WHERE id = $2',
        [profitLoss, user_id]
      );

      await client.query('COMMIT');

      res.status(200).send('Shares sold successfully');
    }
    catch (error) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: error.message });
    } 
    finally {
      client.release();
    }
  
};
