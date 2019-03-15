const mysql = require("mysql"); //引入mysql模块
const databaseConfig = require("../mysql.config"); //引入数据库配置模块中的数据
const pool = mysql.createPool(databaseConfig);
const userSQL = require("../sql");

// 响应一个JSON数据
let responseJSON = function(res, ret) {
    if (typeof ret === "undefined") {
        res.json({ code: "-200", msg: "操作失败"});
    } else {
        res.json(ret);
    }
};
//向外暴露方法
module.exports = {
    query(req, res, next) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        pool.getConnection(function(err, connection) {
            // 建立连接 查询用户信息
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
    },
    insert(req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            let param = req;
            // 建立连接 增加一个用户信息
            connection.query(
                userSQL.insert,
                [param.uid, param.name, param.password],
                function(err, result) {
                    if (result) {
                        result = {
                            code: 200,
                            msg: "增加成功"
                        };
                    }

                    // 以json形式，把操作结果返回给前台页面
                    responseJSON(res, result);

                    // 释放连接
                    connection.release();
                }
            );
        });
    }
};
