import * as fs from "fs"
import Logger from "../Logger"
import { downloadPath, getLatestReleaseInfos, downloadFileToFile, getAsset, unzipFile, DiscordLink } from "../installer"
import * as path from "path"
import Percentage from "../Percentage"
import { moveFolder } from "../fsutil"
import { join } from "path"
import * as spawn from "cross-spawn"
import { pressAnyKeyToContinue } from "../pressKey"
import { exec } from "child_process"
import { Menu, defaultItems } from "../menus/Menu"
import { open } from "../linkOpener"

const win32Logger = new Logger("win32")

export async function start(isMain:boolean){ // detect if npx/npm was used or not
    if(isMain && process.argv.length === 2){ // directly install
        await download()
        // await for a key or exit after a 10s timeout
        setTimeout(() => {
            process.exit()
        }, 10000);
        await pressAnyKeyToContinue()
        process.exit()
    }else{
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
}

export async function download(){
    win32Logger.log("Killing instances of Lightcord")
    await killLightcord()

    win32Logger.log("Downloading Lightcord to "+downloadPath)
    let release = await getLatestReleaseInfos()
    win32Logger.log(`Downloading release ${release.tag_name} (${release.html_url})`)
    let asset = await getAsset(release.assets)

    await fs.promises.mkdir(path.dirname(downloadPath), {recursive: true})
    let percentage = new Percentage(0, asset.size)
    await downloadFileToFile(asset.browser_download_url, downloadPath, length => {
        percentage.update(length)
    })

    win32Logger.log(`Unzipping... This may take some minutes at worst`)
    let folderPath = await unzipFile(downloadPath)

    win32Logger.log(`\x1b[32mFinished unzipping\x1b[0m. Moving \x1b[31mLightcord\x1b[0m and cleaning stuff`)
    if(folderPath.toLowerCase().includes("appdata\\roaming")){
        await moveFolder(folderPath, join(folderPath, "..", "..", "..", "Local", "Lightcord"))
        await fs.promises.rmdir(folderPath, {recursive: true})
        folderPath = join(folderPath, "..", "..", "..", "Local", "Lightcord")
    }
    await fs.promises.unlink(downloadPath)

    win32Logger.log(`\x1b[32mFinished moving, launching...\x1b[0m`)
    let exePath = path.join(folderPath, "Lightcord.exe")

    await new Promise((resolve, reject) => {
        let child = spawn.spawn(exePath, {
            detached: true
        })
        child.on("error", (err) => {
            reject(err)
        })
        resolve()
    })
    win32Logger.log(`\x1b[31mLightcord\x1b[0m is \x1b[32mnow installed\x1b[0m !`)
}

export function killLightcord(){
    return new Promise(resolve => {
        exec("taskkill /im Lightcord.exe /t /F", () => resolve())
    })
}