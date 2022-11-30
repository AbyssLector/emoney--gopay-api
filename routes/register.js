require('dotenv').config();

const jwt = require('jsonwebtoken');
const { Router } = require('express');
const {authenticateHeader } = require('../mw');
const db = require('../db');
const router = Router();

router.get('/', (req, res) => {
    return res.status(400).json("Selamat Datang. silahkan registrasi dengan memasukan name, phone, email, password");
})


router.post('/', authenticateHeader, async (req, res) => {
    const { username, phone, email, password } = req.body;

    if (!name || !phone || !email) return res.status(400).json("Invalid or Wrong parameters");
    
    const query1 = await db.promise().query(`SELECT * from users where user_name = ?`, [username])
    const result1 = query1[0][0];
    if (result1) return res.status(400).json("Name already exists");

    const query2 = await db.promise().query(`SELECT * from users where user_id = ?`, [phone])
    const result2 = query2[0][0];
    if (result2) return res.status(400).json("Phone number already exists");

    const query3 = await db.promise().query(`SELECT * from users where user_email = ?`, [email])
    const result3 = query3[0][0];
    if (result3) return res.status(400).json("Email already exists");

    const date = new Date();
    const timestamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    db.execute(
        "insert into users (user_id, user_name, user_email, user_pass, user_role, user_balance, user_createtime) VALUES (?, ?, ?, ?, ?, ?, ?)", [phone, username, email, password, 0, 0, timestamp], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(500).json("server error, please try again later");
            }
            res.status(200).json("Account registered. please login");
        }
    )






});

module.exports = router;