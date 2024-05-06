const pool = require("../db/connection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config()

const saltRounds = 10;

module.exports.login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const client = await pool.connect(); 
        const emailExistsQuery = 'SELECT * FROM "user" WHERE email = $1';
        const {rows} = await client.query(emailExistsQuery, [email]);
        if (rows.length == 0) {
            return res.status(400).json({ error: 'Email does not exist' });
        }
        const user = rows[0]
        const result = await bcrypt.compare(password,user.password);
        if(!result){
            return res.status(400).json({ error: 'Incorrect password' });   
        }
        delete user['password'];
        const userData = user;
        const token =  jwt.sign(user,process.env.SECRET_KEY, { expiresIn: '1h' });
        return res.cookie("userData",token).status(200).json({status : "success", msg: "Login successful"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }

}