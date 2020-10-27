const { compile } = require('nexe')

let sources = [
    {
        production: true,
        platform: "windows",
        arch: "x86"
    },
    {
        production: false,
        platform: "windows",
        arch: "x86"
    },
    {
        production: true,
        platform: "linux",
        arch: "x86"
    },
    {
        production: false,
        platform: "linux",
        arch: "x86"
    },
]

;(async () => {
    for(let source of sources){
        console.info(`Compiling ${source.production?"production":"development"} for ${source.platform}`)
        await compile({
            input: `./webpack-dist/${source.production?"index":"dev"}.js`,
            output: `LightcordSetup${source.production?"":"-dev"}${source.platform==="windows"?".exe":""}`,
            name: "LightcordSetup",
            cwd: __dirname,
            build: false,
            targets: [
                source.platform+"-"+source.arch+"-"+process.version
            ],
            verbose: true
        })
        console.log(`Successfully compiled for ${source.platform}`)
    }
})()