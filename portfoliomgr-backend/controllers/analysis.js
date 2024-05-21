const pool = require("../db/connection");

module.exports.analysis = async (req,res) => {
    try {
        let result = {}
        const client = await pool.connect();
        let query = `SELECT symbol,MAX(high),MIN(low) FROM stock_price GROUP BY symbol`;
        const { rows:row1 } = await pool.query(query);
        result['data1'] = row1;
        query= ` SELECT symbol,current FROM stock WHERE current>(SELECT avg(current) FROM stock)`
        const { rows:row2 } = await pool.query(query);
        result['data2'] = row2;
        res.status(200).json({status:"success",data:result});

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}