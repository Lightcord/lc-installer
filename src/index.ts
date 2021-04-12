import * as extensions from "./extensions"
import Logger from "./Logger"
import { DiscordLink, platform, repoLink } from "./installer"
import { pressAnyKeyToContinue } from "./pressKey"
extensions.patch()

const isMain = require.main === module

let log = console.log
console.log = (...args:any[]) => {
    return log(`[\x1b[31mLightcord\x1b[0m]`, ...args)
}

console.info = (...args:any[]) => {
    return console.log(`[\x1b[34minfo\x1b[0m]`, ...args)
}

let bootstrapLogger = new Logger("Boostrap")
bootstrapLogger.log("Initialization")

let installer:typeof import("./platforms/win32")
switch(platform){
    case "win":
        installer = require("./platforms/win32")
        installer.start(isMain).catch((err) => {
            console.error(err)
            console.log(`An error occured in the main process. Please \x1b[33mhttps://github.com/Lightcord/lc-installer\x1b[0m join our Discord ${DiscordLink} for help.`)
            pressAnyKeyToContinue()
        })
        break
    case "linux":
    case "android":
        installer = require("./platforms/linux")
        installer.start(isMain)
        .catch((err) => {
            console.error(err)
            console.log(`An error occured in the main process. Please \x1b[33mhttps://github.com/Lightcord/lc-installer\x1b[0m join our Discord ${DiscordLink} for help.`)
            pressAnyKeyToContinue()
        })
        break

    default:
        console.log(`Uh oh, it looks like your platform \x1b[33m${platform}\x1b[0m is not supported. Learn how to build from source on ${repoLink}`)
        pressAnyKeyToContinue()
}