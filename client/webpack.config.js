const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    mode: argv.mode || 'development',
    entry: path.join(__dirname, 'src', 'index.js'),
    devtool: isProduction ? 'source-map' : 'inline-source-map', // Use inline-source-map instead of eval
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public', 'legal'),
            to: path.resolve(__dirname, 'dist', 'legal'),
          },
          {
            from: path.resolve(__dirname, 'public', 'images'),
            to: path.resolve(__dirname, 'dist', 'images'),
          },
          {
            from: path.resolve(__dirname, 'public', 'manifest.json'),
            to: path.resolve(__dirname, 'dist', 'manifest.json'),
          },
          {
            from: path.resolve(__dirname, 'public', 'favicon.ico'),
            to: path.resolve(__dirname, 'dist', 'favicon.ico'),
          }
        ],
      }),
      new Dotenv({
        path: path.resolve(__dirname, '.env'),
        safe: false,
        systemvars: true,
        defaults: false
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      port: 3000,
      host: '0.0.0.0', // Allow external connections
      hot: true,
      historyApiFallback: true,
      server: {
        type: 'https', // Enable HTTPS for Pi Network
        options: {
          key: path.resolve(__dirname, '..', 'ssl', 'key.pem'),
          cert: path.resolve(__dirname, '..', 'ssl', 'cert.pem'),
        }
      },
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      headers: {
        'Content-Security-Policy': "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://sdk.minepi.com; connect-src 'self' ws: wss: https://localhost:3000 https://localhost:5000 https://localhost:3443 https://www.youtube.com https://i.ytimg.com https://api.minepi.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; frame-src 'self' https://www.youtube.com https://youtube.com; font-src 'self' data:;"
      },
    },
  };
};