const express = require('express')
const bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
const app = express()
const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'my_bd_01',
    mutipleStatements: true
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.call("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.Header("Access-Control-Allow-Methods", "*")
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})

app.post("/login", (req, res) => {
    var userName = req.body.userName
    var passWord = req.body.passWord
    if (!userName || !passWord) {
        res.send({
            code: 0,
            msg: "用户名与密码为必传参数...",
        })
        return
    }
    const sqlStr = "select * from user WHERE userName=? AND passWord=?"
    conn.query(sqlStr, [userName, passWord], (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            var tokn = jwt.sign(
                {
                    identify: result[0].identify,
                    userName: result[0].userName,
                },
                "secret",
                { expiresIn: "1h" },
            )
            console.log(token)
            res.send({ code: 1, msg: "登陆成功", token: token })
        } else {
            if (req.headers.authorization == undefined || req.headers.authorization == null) {
                var token = req.headers.authorization.split(" ")[1]
            }
            jwt.verify(token, "secret", (err, decode) => {
                if (err) {
                    res.send({ code: 0, msg: "登陆失败" })
                }
            })
        }
    })
})

app.post("/register", (req, res) => {
    var userName = req.body.userName
    var passWord = req.body.passWord
    if (!userName || !passWord) {
        res.send({
            code: 0,
            msg: "用户名与密码为必传参数...",
        })
        return
    }
    if (userName && passWord) {
        const result = `SELECT * FROM user WHERE userName ='${userName}'`
        conn.query(result, [userName], (err, results) => {
            if (err) throw err
            if (results.length >= 1) {
                res.send({ code: 0, msg: "注册失败，用户名重复" })
            } else {
                const sqlStr = "insert into user(userName,passWord) values(?,?)"
                conn.query(sqlStr, [userName, passWord], (err, results) => {
                    if (err) throw err
                    if (results.affectedRows === 1) {
                        res.send({ code: 1, msg: "注册成功" })
                    } else {
                        res.send({ code: 0, msg: "注册失败" })
                    }
                })
            }
        })
    }
    console.log("接收", req.body)
})

app.lsiten(4000, () => {
    console.log("4000端口已经启动")
})