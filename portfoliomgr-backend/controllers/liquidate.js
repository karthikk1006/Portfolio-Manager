const pool = require("../db/connection");

module.exports.liquidate = async (req,res) => {
    const userId = parseInt(req.params.userId);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('CALL liquidate($1)', [userId]);
        await client.query('COMMIT'); // Commit the transaction if no errors
        res.status(200).json({ message: 'User liquidated successfully.' });
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction in case of an error
        console.error('Error during liquidation:', error);
        res.status(500).json({ error: 'An error occurred while liquidating user.' });   
    }
    finally {
        client.release(); // Release the client back to the pool
      }

}