var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/rl-main.js'
    ],
    module: {
        loaders: [
        {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        },
        {
            test: /\.scss$/,
            loaders: ['style', 'css', 'sass'],
        }
        ]
    },
    resolve: {
        extensions: ['', '.js']
    },
    output: {
        path: 'dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};