import * as fs from "fs"

export function patch(){
    if(!process.env.isWebpack){
        // Add .txt to the require extensions
        require.extensions[".txt"] = (m, filename) => {
            m.exports = fs.readFileSync(filename, "utf8")
            return m.exports
        }
    }
}