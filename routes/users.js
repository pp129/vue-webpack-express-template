const express = require("express");
const router = express.Router();

// 导入MySQL模块
let db = require("../server/model");
// 查询所有用户
router.get("/getUser", function(req, res, next) {
    // 从连接池获取连接
    db.query(req, res, next);
});
//添加用户
router.post("/addUser", function(req, res, next) {
    let user_id = req.body.uid;
    let user_name = req.body.name;
    let password = req.body.password;
    let param = {
        uid: user_id,
        name: user_name,
        password: password
    };
    db.insert(param, res, next);
});
module.exports = router;
