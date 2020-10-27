import * as fs from "fs"
import Logger from "../Logger"
import { downloadPath, getLatestReleaseInfos, downloadFileToFile, getAsset, unzipFile } from "../installer"
import * as path from "path"
import Percentage from "../Percentage"
import { moveFolder } from "../fsutil"
import { join } from "path"
import * as spawn from "cross-spawn"
import { pressAnyKeyToContinue } from "../pressKey"
import { exec } from "child_process"
import { Menu, defaultItems } from "../menus/Menu"
import { open } from "../linkOpener"
import { homedir } from "os"

const linuxLogger = new Logger("linux")

export async function start(isMain:boolean){ // detect if npx was used or not
    console.clear()
    let menu = new Menu({
        options: [
            {
                id: "install",
                label: "Install Lightcord",
                async onClick(){
                    menu.disable()

                    await download()
                    // await for a key
                    await pressAnyKeyToContinue()
                    menu.enable()
                }
            },
            ...defaultItems
        ],
        selected: "install"
    })
    menu.render()
}

export async function download(){
    linuxLogger.log("Downloading Lightcord to "+downloadPath)
    let release = await getLatestReleaseInfos()
    linuxLogger.log(`Downloading release ${release.tag_name} (${release.html_url})`)
    let asset = await getAsset(release.assets)

    await fs.promises.mkdir(path.dirname(downloadPath), {recursive: true})
    let percentage = new Percentage(0, asset.size)
    await downloadFileToFile(asset.browser_download_url, downloadPath, length => {
        percentage.update(length)
    })

    linuxLogger.log(`Unzipping... This may take some minutes at worst`)
    let folderPath = await unzipFile(downloadPath)

    linuxLogger.log(`\x1b[32mFinished unzipping\x1b[0m. Moving \x1b[31mLightcord\x1b[0m and cleaning stuff`)

    let newPath = join(homedir(), "Lightcord")
    if(fs.existsSync(newPath)){
        linuxLogger.info(`Deleting actual Lightcord.`)
        await fs.promises.rmdir(newPath, {recursive: true})
    }
    await fs.promises.mkdir(newPath)
    await moveFolder(folderPath, newPath)
    await fs.promises.rmdir(folderPath, {recursive: true})
    folderPath = newPath

    await fs.promises.unlink(downloadPath)

    linuxLogger.log(`\x1b[32mFinished moving, launching...\x1b[0m`)
    let exePath = path.join(folderPath, "Lightcord")

    await new Promise((resolve, reject) => {
        let child = spawn.spawn(exePath, {
            detached: true
        })
        child.on("error", (err) => {
            reject(err)
        })
        resolve()
    })
    linuxLogger.log(`\x1b[31mLightcord\x1b[0m is \x1b[32mnow installed\x1b[0m !`)
}