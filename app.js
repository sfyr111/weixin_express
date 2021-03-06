var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// [微信公众号：接口配置和签名验证]
var config = require('./config/config.json');
var utils = require('./common/utils');

var index = require('./routes/index');
var users = require('./routes/users');

// [微信公众测试号：接口配置和签名验证]
var wechat = require('./routes/wechat');

// 接口：/accessToken
var acceptAccessToken = require('./routes/acceptAccessToken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));                                                 // 开启development日志
app.use(bodyParser.json());                                             // body转为json格式
app.use(bodyParser.urlencoded({ extended: false }));                    // body的url进行编码
app.use(cookieParser());                                                // 使用express的中间件：cookie
app.use(express.static(path.join(__dirname, 'public')));                //

app.use('/users', users);
// 接口：/accessToken
app.use('/acceptAccessToken',acceptAccessToken);

// [微信公众号：接口配置和签名验证]
app.use(utils.sign(config));            // 【重点：路由在此及其之后，都将进入签名验证函数】
app.use('/', index);                    // 微信公众号对接的url地址
// [微信公众测试号：接口配置和签名验证]
app.use('/wechat',wechat);              // 微信公众测试号对接的url地址

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
