let env = require("./config.env");
let conf = {};
if(env === "production"){
    conf.api_local = "/api/json";
    conf.api = "/xlcloud-subway-webapp";
    conf.api_sys = "/xlcloud-sys-server";
}else{
    conf.api_local = "/api/json";
    conf.api = "/xlcloud-subway-webapp";
    conf.api_sys = "/xlcloud-sys-server";
}
conf.port = 8080;
conf.apiServer = "http://10.130.146.33:8140";
conf.version = 'V0.42(20190129)';
conf.env = env;
module.exports = conf;
