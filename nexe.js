const { compile } = require('nexe')

compile({
    input: './webpack-dist/index.js',
    output: "LightcordSetup.exe",
    name: "LightcordSetup",
    cwd: __dirname,
    build: false,
    targets: [
        "windows-x86-"+process.version
    ],
    verbose: true
}).then(() => {
    console.log('success')
})

compile({
    input: './webpack-dist/index.js',
    output: "LightcordSetup",
    name: "LightcordSetup",
    cwd: __dirname,
    build: false,
    targets: [
        "linux-x86-"+process.version
    ],
    verbose: true
}).then(() => {
    console.log('success')
})