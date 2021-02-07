import path from 'path'
import webpack from 'webpack'
import * as webpackDevServer from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const isDev: boolean = process.env.NODE_ENV === 'development'

const filename = (ext: string) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`)

const config: webpack.Configuration = {
    entry: './src/index.tsx',
    mode: isDev ? 'development' : 'production',
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    devtool: isDev ? 'source-map' : false,
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {},
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename('js'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        port: 8000,
        hot: isDev,
    },
    plugins: [new CleanWebpackPlugin()],
}

export default config
