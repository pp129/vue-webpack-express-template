let UserSQL = {
    insert:
        "INSERT INTO tab_user_info(user_id,user_name,user_password) VALUES(?,?,?)",
    queryAll: "SELECT * FROM tab_user_info",
    getUserById: "SELECT * FROM tab_user_info WHERE user_id = ? "
};
module.exports = UserSQL;
