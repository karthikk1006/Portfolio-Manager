const pool = require("../db/connection");
const bcrypt = require("bcryptjs")


const saltRounds = 10;

module.exports.createUser = async (req,res)=>{
    const {name,role,email,password} = req.body;
    try {
    const client = await pool.connect();
    const emailExistsQuery = 'SELECT * FROM "user" WHERE email = $1';
    const { rows:checkrow} = await client.query(emailExistsQuery, [email]);
    if (checkrow.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    const queryString = `INSERT INTO "user" (name, role, email, password) VALUES ($1, $2, $3, $4) RETURNING *;`;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const {rows} = await client.query(queryString,[name,role,email,hashedPassword]);
    return res.status(201).json({status : "success", data : rows[0]});    
    client.release()
    } 
    catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
