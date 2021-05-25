import path from "path";
import webpack from "webpack";
import * as webpackDevServer from "webpack-dev-server";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

const isDev: boolean = process.env.NODE_ENV === "development";

const filename = (ext: string) =>
  isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const config: webpack.Configuration = {
  entry: "./src/index.tsx",
  mode: isDev ? "development" : "production",
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  devtool: isDev ? "source-map" : false,
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {},
  },
  output: {
    path: path.resolve(__dirname, "./build"),
    filename: filename("js"),
    publicPath: "/",
  },
  devServer: {
    contentBase: path.join(__dirname, "./build"),
    hot: true,
    port: 8000,
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};

export default config;
