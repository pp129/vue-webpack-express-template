const path = require('path');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
module.exports = merge(common, {
    mode: 'production',
    devtool: 'cheap-source-map',
    output: {
        filename: 'js/[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader:'file-loader',
                        options: {
                            limit: 10000,
                            name: 'img/[name].[hash:7].[ext]'
                        }
                    }
                ],

            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader:'file-loader',
                        options: {
                            limit: 10000,
                            name: 'font/[name].[hash:7].[ext]'
                        }
                    }
                ],
                // options: {
                //     limit: 10000,
                //     name: 'font/[name].[hash:7].[ext]'
                // }
            },
        ],
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ],
    },
    plugins: [
        new MinifyPlugin(),
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[id].[hash].css',
        }),
        new CopyWebpackPlugin([
            {from: 'resource', to: 'resource'},
            {from: 'api/json', to: 'json'},
        ]),
        new webpack.HashedModuleIdsPlugin()
    ],
});
