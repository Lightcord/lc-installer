const config = require("./webpack.prod.js")

config.output.filename = "dev.js"
config.plugins[0].definitions["process.env.isDev"] = true
config.mode = "development"
config.devtool = false

module.exports = config