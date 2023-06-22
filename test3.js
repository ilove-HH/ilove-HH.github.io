var mysql = require('mysql');  //导入mysql包

var connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '123456',
   port: '3306',
   database: 'my_bd_01'
});

connection.connect();

var express = require('express');
var app = express();

app.use(express.static('public'));
//参数里为'/'则是默认打开页面
app.get('/', function (req, res) {
   res.sendFile(__dirname + "/" + "log2.html");
})


app.get('/login', function (req, res) {
   var response = {
      "account": req.query.account,
      "password": req.query.password,
   };
   var selectSQL = "select account,password from user where account = '" + req.query.account + "' and password = '" + req.query.password + "'";
   //var selectSQL = "select password from user where account='"+req.query.account+"'";
   var addSqlParams = [req.query.account, req.query.password];
   res.location = function (url) {
      var req = this.req;

      // "back" 是 referrer的别名
      if ('back' == url) url = req.get('Referrer') || '/';

      // 设置Lcation
      this.setHeader('Location', url);
      return this;
   };
   connection.query(selectSQL, function (err, result) {
      if (err) {
         console.log('[login ERROR] - ', err.message);
         return;
      }
      //console.log(result);
      if (result == '') {
         console.log("帐号密码错误");
         res.location('https://ilove-HH.github.io/log.html');
         res.statusCode = 301;
         res.end('响应的内容');
      }
      else {
         console.log("OK");
         res.location('https://ilove-HH.github.io/Untitled-11.html');
         res.statusCode = 301;
         res.end('响应的内容');
      }
   });
   console.log(response);
   //res.end(JSON.stringify(response));
})

app.get('/register.html', function (req, res) {
   res.sendFile(__dirname + "/" + "register.html");
})

//注册模块
var addSql = 'INSERT INTO user(account,password,name) VALUES(?,?,?)';

app.get('/process_get', function (req, res) {

   // 输出 JSON 格式
   var response = {
      "account": req.query.account,
      "password": req.query.password,
      "name": req.query.name
   };
   var addSqlParams = [req.query.account, req.query.password, req.query.name];
   res.location = function (url) {
      var req = this.req;

      // "back" 是 referrer的别名
      if ('back' == url) url = req.get('Referrer') || '/';

      // 设置Lcation
      this.setHeader('Location', url);
      return this;
   };
   connection.query(addSql, addSqlParams, function (err, result) {
      if (err) {
         console.log('[INSERT ERROR] - ', err.message);
         res.location('https://ilove-HH.github.io/log.html');
         res.statusCode = 301;
         res.end('响应的内容');
         return;//如果失败了就直接return不会继续下面的代码
      }
      res.location('https://ilove-HH.github.io/log2.html');
      res.statusCode = 301;
      res.end('响应的内容');
      console.log("OK");
   });
   console.log(response);
   //res.end(JSON.stringify(response));
})



var server = app.listen(3000, function () {

   var host = server.address().address
   var port = server.address().port

   console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
