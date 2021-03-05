const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WatchMissingNodeModulesPlugin = require("react-dev-utils/WatchMissingNodeModulesPlugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const postcssLoader = {
    loader: "postcss-loader",
    options: {
        postcssOptions: {
            plugins: [
                [
                    "postcss-flexbugs-fixes",
                    "postcss-preset-env",
                    {
                        autoprefixer: {
                            flexbox: "no-2009",
                        },
                        stage: 3,
                    },
                ],
            ],
        },
    },
};

const useTypeScript = fs.existsSync("tsconfig.json");

module.exports = (_, { mode, analyze }) => {
    const isDevelopment = mode === "development";
    const isProduction = mode === "production";
    const shouldAnalyze = analyze || false;

    process.env.NODE_ENV = mode;
    process.env.BABEL_ENV = mode;

    return {
        mode: mode,
        target: isDevelopment ? "web" : "browserslist",
        entry: isProduction ? ["./src"] : ["react-hot-loader/patch", "./src"],
        output: {
            path: isProduction ? path.resolve(__dirname, "build") : undefined,
            publicPath: "/",
            filename: isProduction
                ? "static/js/[name].[contenthash:8].js"
                : "static/js/[name].js",
            chunkFilename: isProduction
                ? "static/js/[name].[contenthash:8].chunk.js"
                : "static/js/[name].chunk.js",
        },
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            ecma: 5,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                }),
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            "default",
                            { minifyFontValues: { removeQuotes: false } },
                        ],
                    },
                }),
            ],
            splitChunks: {
                chunks: "all",
            },
            runtimeChunk: true,
        },
        resolve: {
            modules: [path.join(__dirname, "src"), "node_modules"],
            extensions: ["*", ".ts", ".tsx", ".mjs", ".js", ".jsx", ".wasm", ".json"],
        },
        module: {
            rules: [
                {
                    oneOf: [
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: path.resolve(__dirname, "./src"),
                            exclude: /node_modules/,
                            loader: "babel-loader",
                            options: {
                                plugins: [
                                    isDevelopment && require("react-refresh/babel"),
                                ].filter(Boolean),
                            },
                        },
                        {
                            test: /\.css$/,
                            use: ["style-loader", "css-loader", postcssLoader],
                        },
                        {
                            test: /\.scss$/,
                            use: [
                                "style-loader",
                                "css-loader",
                                postcssLoader,
                                "sass-loader",
                            ],
                        },
                        {
                            test: /\.(png|jpe?g|gif|bmp)$/i,
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                name: "assets/media/[name].[hash:8].[ext]",
                            },
                        },
                        {
                            test: /\.svg/,
                            loader: "svg-url-loader",
                        },
                        {
                            exclude: /\.(js|mjs|jsx|ts|tsx|html|json)$/,
                            loader: "file-loader",
                            options: {
                                name: "assets/media/[name].[hash:8].[ext]",
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(mode),
                "process.env.BABEL_ENV": JSON.stringify(mode),
            }),
            isProduction && new CleanWebpackPlugin(),
            new HtmlWebpackPlugin(
                Object.assign(
                    {},
                    {
                        inject: true,
                        title: "Advanced React with Webpack Setup",
                        template: path.resolve(__dirname, "./public/index.html"),
                    },
                    isProduction
                        ? {
                              minify: {
                                  removeComments: true,
                                  collapseWhitespace: true,
                                  removeRedundantAttributes: true,
                                  useShortDoctype: true,
                                  removeEmptyAttributes: true,
                                  removeStyleLinkTypeAttributes: true,
                                  keepClosingSlash: true,
                                  minifyJS: true,
                                  minifyCSS: true,
                                  minifyURLs: true,
                              },
                          }
                        : undefined
                )
            ),
            isProduction &&
                new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
            new ModuleNotFoundPlugin(path.resolve(__dirname, "./")),
            useTypeScript &&
                new ForkTsCheckerWebpackPlugin({
                    async: isDevelopment,
                    typescript: {
                        diagnosticOptions: {
                            semantic: true,
                            syntactic: true,
                        },
                        mode: "write-references",
                    },
                }),
            new ESLintPlugin({
                extensions: ["js", "mjs", "jsx", "ts", "tsx"],
            }),
            isDevelopment && new CaseSensitivePathsPlugin(),
            isDevelopment &&
                new WatchMissingNodeModulesPlugin(
                    path.resolve(__dirname, "node_modules")
                ),
            isProduction &&
                new MiniCssExtractPlugin({
                    filename: "assets/css/[name].[contenthash:8].css",
                    chunkFilename: "assets/css/[name].[contenthash:8].chunk.css",
                }),
            isDevelopment && new webpack.HotModuleReplacementPlugin(),
            isDevelopment && new ReactRefreshWebpackPlugin(),
            shouldAnalyze &&
                new BundleAnalyzerPlugin({
                    analyzerMode: "static",
                    reportFilename: path.resolve(__dirname, "./build/report.html"),
                    openAnalyzer: false,
                }),
        ].filter(Boolean),
        devServer: isDevelopment
            ? {
                  compress: true,
                  contentBase: "./build",
                  hot: true,
                  historyApiFallback: true,
                  open: true,
              }
            : {},
        devtool: isProduction ? "source-map" : "inline-source-map",
    };
};
