const path = require("path")
const webpack = require("webpack")

module.exports = {
    mode: "production",
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "webpack-dist"),
        filename: "index.js",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: /\.txt$/i,
                use: [
                    {
                        loader: 'raw-loader',
                        options: {
                            esModule: false,
                        },
                    },
                ],
            }, {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".js", ".json", ".txt", ".ts", ".tsx"]
    },
    target: "node",
    plugins: [
        new webpack.DefinePlugin({
            'process.env.isWebpack': true,
            'process.env.installerVersion': JSON.stringify(require("./package.json").version)
        })
    ],
    externals: getKeyMirror([
        "yauzl",
        "appdata-path",
        "node-fetch",
        "cross-spawn"
    ])
}

function getKeyMirror(keys){
    let final = {}
    keys.forEach(e => final[e] = e)
    return final
}