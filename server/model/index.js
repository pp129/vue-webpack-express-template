const mysql = require("mysql"); //引入mysql模块
const databaseConfig = require("../mysql.config"); //引入数据库配置模块中的数据
const pool = mysql.createPool(databaseConfig);
const userSQL = require("../sql");
// 响应一个JSON数据
let responseJSON = function(res, ret) {
    if (typeof ret === "undefined") {
        res.json({ code: "-200", msg: "操作失败" });
    } else {
        res.json(ret);
    }
};
//向外暴露方法
module.exports = {
    query: function(req, res, next) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            // let param = req.query || req.params;
            // 建立连接 增加一个用户信息
            connection.query(userSQL.queryAll, [], function(err, result) {
                if (result) {
                    result = {
                        code: 200,
                        msg: "查询成功",
                        data: result
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                responseJSON(res, result);

                // 释放连接
                connection.release();
            });
        });
    }
};
