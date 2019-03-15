const express = require("express");
const router = express.Router();
// 导入MySQL模块
let db = require("../server/model");
// 添加用户
router.get("/getUser", function(req, res, next) {
    // 从连接池获取连接
    db.query(req, res, next);
});
module.exports = router;
