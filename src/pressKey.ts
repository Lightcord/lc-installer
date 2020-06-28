import * as readline from "readline"

export function pressAnyKeyToContinue():Promise<void>{
    if(!process.stdout.isTTY)return Promise.resolve()
    return new Promise(resolve => {
        console.log(`Press any key to continue...`)
        process.stdin.setRawMode(true)
        process.stdin.resume();
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false)
            process.stdin.pause()
            resolve()
        });
    })
}