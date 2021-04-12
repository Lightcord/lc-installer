import getAppDataPath from "appdata-path";
import { join, basename, dirname as _dirname, dirname } from "path";
import Logger from "./Logger";
import { fetch } from "./api";
import { pressAnyKeyToContinue } from "./pressKey";
import { Response } from "node-fetch";
import * as yauzl from "yauzl"
import { createWriteStream, WriteStream, mkdirSync } from "fs";
import { Downloader } from "bongodl"
import * as byteSize from "byte-size"
import {promises as fs} from "fs";
import Percentage from "./Percentage";

export const repoLink = "https://github.com/Lightcord/Lightcord"
export const releaseLink = repoLink + "/releases"
export const LightcordAppData = getAppDataPath("Lightcord")
export const downloadPath = join(LightcordAppData, "Lightcord.zip")
export const DiscordLink = "\x1b[33mhttps://discord.gg/7eFff2A\x1b[0m"

export const githubConstants = {
    baseUrl: "https://api.github.com",
    repoID: repoLink.split("github.com/")[1]
}

const logger = new Logger("installer")

export type User = {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    site_admin: boolean
}

export type Release = {
    url: string,
    assets_url: string,
    upload_url: string,
    html_url: string,
    id: number,
    node_id: string,
    tag_name: string,
    target_commitish: string,
    name: string,
    draft: boolean,
    author: User,
    prerelease: boolean,
    created_at: string,
    published_at: string,
    assets: {
        url: string,
        id: number,
        node_id: string,
        name: string,
        label?: string,
        uploader: User,
        content_type: string,
        state: string,
        size: number,
        download_count: number,
        created_at: string,
        updated_at: string,
        browser_download_url: string
    }[],
    tarball_url: string,
    zipball_url: string,
    body: string
  }

export async function getLatestReleaseInfos():Promise<Release>{
    let url = `${githubConstants.baseUrl}/repos/${githubConstants.repoID}/releases`
    logger.log(`Fetching latest release from \x1b[32m${url}\x1b[0m`)

    let res = await fetch(url).catch(e => [e]) as Response
    if(isError(res)){
        logger.error(`Couldn't fetch the latest release. Make sure you're connected to internet. Contact us on ${DiscordLink} for more help.`)
        logger.error(await formatFetchErrorResult(res))
        await pressAnyKeyToContinue()
        process.exit()
    }
    return (await res.json())[0]
}

export async function downloadFileToFile(url:string, path:string, useLightcordServers=true, useBongo=true):Promise<void>{
    let originalURL = url
    // https://github.com/Lightcord/Lightcord/releases/download/v0.10.1/lightcord-linux-x64.zip
    let fragments = url.split("/")
    url = `https://lightcord.org/api/v1/gh/releases/${fragments[fragments.length - 6]}/${fragments[fragments.length - 5]}/${fragments[fragments.length - 2]}/${fragments[fragments.length - 1]}`
    if(!useLightcordServers){
        url = originalURL
    }
    // Bongodl manifest
    const manifest = url+".manifest"
    logger.log(`Downloading \x1b[32m${url}\x1b[0m to ${path}`)

    if(useBongo){
        await new Promise<void>((resolve, reject) => {
            new Downloader({
                manifest_url: manifest,
                emitStatus: true,
                concurrent: 10
            }).on("status", status => {
                const progress40 = Math.round(status.ratio*40)
                let progress = `\x1b[47m${" ".repeat(progress40)}\x1b[40m${" ".repeat(40-progress40)}`
                let percentage = status.percentage.toFixed(2)
                const numberLength = percentage.split(".")[0].length
                if(numberLength < 2){
                    percentage = "0"+percentage
                }
                process.stdout.write(`\x1b[2K\x1b[0G[\x1b[31mLightcord\x1b[0m] [${progress}] ${byteSize(status.downloaded)}/${byteSize(status.total)} ${percentage}%`)
            }).on("end", async filepath => {
                process.stdout.write("\x1b[2K\x1b[0G")
                await fs.rename(filepath, path)
                await fs.rmdir(dirname(filepath), {recursive: true})
                resolve()
            }).on("error", err => {
                process.stdout.write("\x1b[2K\x1b[0G")
                console.error(err)
                logger.error(`Couldn't download the latest release from lightcord's servers, retrying...`)
                downloadFileToFile(originalURL, path, useLightcordServers, false).then(resolve, reject)
            })
        })
    }else{
        let res = await fetch(url).catch(e => [e]) as Response
        if(isError(res)){
            if(useLightcordServers){
                logger.error(`Couldn't download the latest release from lightcord's servers, retrying on github.`)
                logger.log(`You may experience longer downloading time.`)
                return await downloadFileToFile(originalURL, path, false, false)
            }
            logger.error(`Couldn't download the latest release. Make sure you're connected to internet. Contact us on ${DiscordLink} for more help.`)
            logger.error(await formatFetchErrorResult(res))
            await pressAnyKeyToContinue()
            process.exit()
        }
        return await new Promise((resolve, reject) => {
            const sizestr = res.headers.get("content-length")
            let size:number
            if(sizestr){
                size = parseInt(sizestr)
            }
            if(isNaN(size)){
                // 137 mb size of lightcord as of now
                size = 137.7*10**6
            }
            const percentage = new Percentage(0, size)
            let stream = createWriteStream(path)
            res.body
            .on("data", (data) => {
                stream.write(data)
                percentage.update(data.length)
            }).on("end", () => {
                process.stdout.write("\x1b[2K\x1b[0G")
                stream.end()
                resolve()
            }).on("error", (err) => {
                stream.end()
                reject(err)
            })
        })
    }
}

export async function unzipFile(file:string):Promise<string>{
    return new Promise((resolve, reject) => {
        yauzl.open(file, {lazyEntries: true}, (err, zipfile) => {
            if(err)return reject(err)
            zipfile.readEntry();
            zipfile.on("entry", function(entry) {
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                } else {
                    zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) throw err;
                        readStream.on("end", function() {
                            zipfile.readEntry();
                        });
                        readStream.pipe(getWriteStream(file, entry.fileName))
                    });
                }
            });
            zipfile.on("end", () => {
                resolve(file.split(".").slice(0, -1).join("."))
            })
        })
    })
}

export function getWriteStream(file:string, fileName:string):WriteStream{
    let filename = basename(file)
    let dirname = join(_dirname(file), filename.split(".").slice(0, -1).join("."))
    let filepath = join(dirname, fileName)
    mkdirSync(_dirname(filepath), {recursive: true})
    return createWriteStream(filepath)
}

export let platform = null
if(process.platform === "win32"){
    platform = "win"
}else if(process.platform === "darwin"){
    platform = "mac"
}else if(process.platform === "android"){
    platform = "android"
}else platform = "linux"


export async function getAsset(assets:Release["assets"]):Promise<Release["assets"][0]>{
    /*return { // Local download - developpment only
        size: 157188332,
        browser_download_url: "http://127.0.0.1/img/lightcord-win32-ia32_7.zip"
    } as Release["assets"][0]*/
    let asset = assets.find(e => e.name.toLowerCase().startsWith("lightcord-"+platform) && e.name.endsWith(".zip"))
    if(!asset){
        logger.error(`Couldn't find a matching asset. Make sure your platform (${platform}) is supported. Contact us on ${DiscordLink} for more help.`)
        if(platform === "mac"){
            logger.info("This is a reminder that mac OS is not entirely supported. You get this message because no asset was found for your system. Please build from source with "+getFullCommand(["--build-from-source"])+".")
        }else if(platform === "android"){
            logger.info("Android is not supported by Lightcord. We might drop a release on the Play Store/Expo. Please contact us to be sure "+DiscordLink)
        }
        logger.info(`Platform: \x1b[34m${platform}\x1b[0m`)
        logger.info(`Requested file: \x1b[34mlightcord-${platform}*.zip\x1b[0m`)
        logger.info(`Found assets: ${assets.map(e => `\x1b[34m${e.name}\x1b[0m`).join(", ")}`)
        await pressAnyKeyToContinue()
        process.exit()
    }
    return asset
}

export function getFullCommand(args:string[]){
    let cmd = ""
    if(process.argv[1].endsWith("bin.js"))cmd = "lightcordInstaller"
    else{
        cmd = "node "+process.argv[1]
    }
    cmd += " " + args.join(" ")
    return cmd
}

export const installerVersion = process.env.installerVersion || require("../package.json").version

export async function formatFetchErrorResult(err: any[] | Response):Promise<any>{
    if(Array.isArray(err))return err[0]
    let text = await err.text()
    if(!text)return null
    let json
    try{
        json = JSON.parse(text)
    }catch(e){
        json = null
    }
    if(!json){
        return text
    }else{
        if(typeof json === "string")return json
        if("message" in json)return json.message
        if("code" in json)return json.code
        return json
    }
}

export function isError(err: any[] | Response):boolean{
    return (Array.isArray(err)) || (err.status !== 200)
}