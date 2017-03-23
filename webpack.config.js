const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTML = require('html-webpack-plugin');

const out = path.resolve(__dirname, 'assets');
const jsPath = path.resolve(__dirname, 'src', 'js');
const stylePath = path.resolve(__dirname, 'src', 'styles');
const imgPath = path.resolve(__dirname, 'src', 'static', 'img');
const fontsPath = path.resolve(__dirname, 'src', 'static', 'fonts');

module.exports = {
    entry: {
        app: './src/js/bootstrap.js',
        vendor: ['react']
    },
    output: {
        path: out,
        filename: 'js/[name].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            include: jsPath,
            loader: 'babel-loader',
            options: {
                presets: [
                    ['es2015', {loose: true, modules: false}],
                    'stage-0',
                    'react'
                ],
                plugins: ["babel-plugin-syntax-jsx"]
            }
        }, {
            test: /\.scss$/,
            include: stylePath,
            loader: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader!postcss-loader!sass-loader'
            })
        }, {
            test: /\.png$/,
            include: imgPath,
            loader: 'url-loader?limit=15000&mimetype=image/png&name=img/[name].[ext]'
        }, {
            test: /\.jpg$/,
            include: imgPath,
            loader: 'file-loader?name=img/[name].[ext]'
        }, {
            test: /\.(otf|eot|svg|ttf|woff|woff2)$/,
            include: fontsPath,
            loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
        }]
    },
    plugins: [
        // split vendor chunks
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),

        // build css into separate file
        new ExtractTextPlugin({
            filename: 'style/main.css',
            allChunks: true
        }),

        // postcss config
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    require('autoprefixer')({
                        browsers: ['last 3 version']
                    })
                ]
            }
        }),

        // HTML
        new HTML({
            template: './src/index.html',
            filename: 'index.html',
            inject: false,
            hash: true
        }),
    ],
    devServer: {
        historyApiFallback: true,
        contentBase: out,
        publicPath: "/",
        port: 3000
    },
};