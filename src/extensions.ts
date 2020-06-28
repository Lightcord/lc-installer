import * as fs from "fs"

let isPackaged = process.env.isWebpack

export function patch(){
    if(isPackaged){
        // do nothing because we have the plugin to require .txt in webpack
    }else{
        require.extensions[".txt"] = (m, filename) => {
            m.exports = fs.readFileSync(filename, "utf8")
            return m.exports
        }
    }
}