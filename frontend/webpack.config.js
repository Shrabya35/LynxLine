import webpack from "webpack";
import path from "path";
import Dotenv from "dotenv-webpack";
import browserifyZlib from "browserify-zlib";
import querystringEs3 from "querystring-es3";
import pathBrowserify from "path-browserify";
import cryptoBrowserify from "crypto-browserify";
import streamBrowserify from "stream-browserify";
import streamHttp from "stream-http";

export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "public"),
    port: 3000,
    hot: true,
    devMiddleware: {
      publicPath: "/",
    },
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    fallback: {
      zlib: browserifyZlib,
      querystring: querystringEs3,
      path: pathBrowserify,
      crypto: cryptoBrowserify,
      fs: false,
      stream: streamBrowserify,
      http: streamHttp,
      net: false,
    },
  },
  plugins: [new Dotenv()],
};
