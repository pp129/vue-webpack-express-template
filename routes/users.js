const express = require("express");
const router = express.Router();

// 导入MySQL模块
let db = require("../server/model");
// 查询所有用户
router.get("/getUser", function(req, res) {
    // 从连接池获取连接
    db.query(res);
});
//根据user_id查询用户信息
router.get("/getUserById",function(req, res) {
   db.queryById(req,res)
});
//添加用户
router.post("/addUser", function(req, res, next) {
    let user_name = req.body.name;
    let password = req.body.password;
    let param = {
        name: user_name,
        password: password
    };
    db.insert(param, res, next);
});
//更新用户信息
router.post("/updateUser",function(req, res, next) {
    let user_id = req.body.uid;
    let user_name = req.body.name;
    let password = req.body.password;
    let newPassword = req.body.newPassword;
    let param = {
        uid: user_id,
        name: user_name,
        password: password,
        newPassword:newPassword
    };
    db.update(param,res,next);
});
module.exports = router;
