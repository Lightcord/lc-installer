import { exec } from "child_process"

export function open(link:string){
    exec((process.platform == "win32" ? "start" : process.platform == "android" ? "xdg-open" : "open") + " " + link.replace(/&/g, "^&"), ()=>{});
}