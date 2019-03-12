const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const open = require('open');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const conf = require('./config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//webpack
if(conf.env === "development"){
    let opened = false;
    const config = require('./webpack.dev');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath
    }));
    compiler.apply(new webpack.ProgressPlugin(function (percentage, msg) {
        console.log(percentage);
        if (percentage === 1 && !opened) {
            opened = true;
            open("http://localhost:" + conf.port);
        }
    }));
}

//static
app.use(express.static(path.join(__dirname, "dist"),{maxAge : 7 * 24 * 60 * 60}));
app.use(express.static(path.join(__dirname, "api"),{maxAge : 7 * 24 * 60 * 60}));
app.use(express.static(path.join(__dirname),{maxAge : 7 * 24 * 60 * 60}));

// 本地json模拟远程服务器api  post请求转get
app.use('/api/*', function (req , res, next) {
    if(req.method === "POST"){
        req.method = "GET";
    }
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
