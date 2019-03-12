const path = require("path");
const url = require("url");
const conf = require("./config");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
function resolve(dir) {
    return path.join(__dirname, ".", dir);
}
module.exports = {
    entry: {
        app: ["./src/index.js"]
    },
    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    minChunks: 2
                }
            }
        }
    },
    // context: path.resolve(__dirname, "./"),
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            "@": resolve("src"),
            "@conf": resolve("config"),
            "@api": resolve("api")
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    hotReload: true // 关闭热重载
                }
            }
            // 设置全局exports
            // {
            //     test: require.resolve('./src/js/globals.js'),
            //     use: 'exports-loader?file,parse=helpers.parse'
            // },
            // 设置this变量
            // {
            //     test: require.resolve('./src/js/index.js'),
            //     use: 'imports-loader?this=>window'
            // },
        ]
    },
    devServer: {
        proxy: {
            "/api": {
                target: "http://localhost:" + conf.port,
                pathRewrite: function(path) {
                    let obj = url.parse(path);
                    let search = obj.search;
                    let pathname = obj.pathname;
                    let first = pathname.replace(/^\/api/, "");
                    let two = first.replace(/$/, ".json");
                    return two + (search || "");
                }
            },
            "/remote": {
                target: "http://10.130.195.32:8221",
                changeOrigin: false,
                ws: true, // proxy websocket
                pathRewrite: {
                    "^/remote": "" // rewrite path
                }
            },
            "/upload": {
                target: "http://10.130.146.30:3080",
                changeOrigin: false
            }
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        // new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            filename: "index.html",
            inject: "body"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery"
        })
        // 提供全局变量
        // new webpack.ProvidePlugin({
        //     join: ['lodash', 'join']
        // })
    ]
};
