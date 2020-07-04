module.exports=function(e){var t={};function o(r){if(t[r])return t[r].exports;var s=t[r]={i:r,l:!1,exports:{}};return e[r].call(s.exports,s,s.exports,o),s.l=!0,s.exports}return o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(r,s,function(t){return e[t]}.bind(null,s));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=11)}([function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isError=t.formatFetchErrorResult=t.installerVersion=t.getFullCommand=t.getAsset=t.platform=t.getWriteStream=t.unzipFile=t.downloadFileToFile=t.getLatestReleaseInfos=t.githubConstants=t.DiscordLink=t.downloadPath=t.LightcordAppData=t.releaseLink=t.repoLink=void 0;const r=o(14),s=o(1),i=o(3),n=o(15),a=o(4),l=o(16),c=o(2);t.repoLink="https://github.com/Lightcord/Lightcord",t.releaseLink=t.repoLink+"/releases",t.LightcordAppData=r.default("Lightcord"),t.downloadPath=s.join(t.LightcordAppData,"Lightcord.zip"),t.DiscordLink="[33mhttps://discord.gg/7eFff2A[0m",t.githubConstants={baseUrl:"https://api.github.com",repoID:t.repoLink.split("github.com/")[1]};const d=new i.default("installer");function u(e,t){let o=s.basename(e),r=s.join(s.dirname(e),o.split(".").slice(0,-1).join(".")),i=s.join(r,t);return c.mkdirSync(s.dirname(i),{recursive:!0}),c.createWriteStream(i)}function p(e){let t="";return t=process.argv[1].endsWith("bin.js")?"lightcordInstaller":"node "+process.argv[1],t+=" "+e.join(" "),t}async function h(e){if(Array.isArray(e))return e[0];let t,o=await e.text();if(!o)return null;try{t=JSON.parse(o)}catch(e){t=null}return t?"string"==typeof t?t:"message"in t?t.message:"code"in t?t.code:t:o}function m(e){return Array.isArray(e)||200!==e.status}t.getLatestReleaseInfos=async function(){let e=`${t.githubConstants.baseUrl}/repos/${t.githubConstants.repoID}/releases/latest`;d.log(`Fetching latest release from [32m${e}[0m`);let o=await n.fetch(e).catch(e=>[e]);return m(o)&&(d.error(`Couldn't fetch the latest release. Make sure you're connected to internet. Contact us on ${t.DiscordLink} for more help.`),d.error(await h(o)),await a.pressAnyKeyToContinue(),process.exit()),await o.json()},t.downloadFileToFile=async function(e,o,r=(()=>{})){d.log(`Downloading [32m${e}[0m to ${o}`);let s=await n.fetch(e).catch(e=>[e]);return m(s)&&(d.error(`Couldn't download the latest release. Make sure you're connected to internet. Contact us on ${t.DiscordLink} for more help.`),d.error(await h(s)),await a.pressAnyKeyToContinue(),process.exit()),await new Promise((e,t)=>{let i=c.createWriteStream(o);s.body.on("data",e=>{i.write(e),r(e.length)}).on("end",()=>{i.end(),e()}).on("error",e=>{i.end(),t(e)})})},t.unzipFile=async function(e){return new Promise((t,o)=>{l.open(e,{lazyEntries:!0},(r,s)=>{if(r)return o(r);s.readEntry(),s.on("entry",(function(t){/\/$/.test(t.fileName)?s.readEntry():s.openReadStream(t,(function(o,r){if(o)throw o;r.on("end",(function(){s.readEntry()})),r.pipe(u(e,t.fileName))}))})),s.on("end",()=>{t(e.split(".").slice(0,-1).join("."))})})})},t.getWriteStream=u,t.platform=null,"win32"===process.platform?t.platform="win":"darwin"===process.platform?t.platform="mac":"android"===process.platform?t.platform="android":t.platform="linux",t.getAsset=async function(e){let o=e.find(e=>e.name.toLowerCase().startsWith("lightcord-"+t.platform)&&e.name.endsWith(".zip"));return o||(d.error(`Couldn't find a matching asset. Make sure your platform (${t.platform}) is supported. Contact us on ${t.DiscordLink} for more help.`),"mac"===t.platform?d.info("This is a reminder that mac OS is not entirely supported. You get this message because no asset was found for your system. Please build from source with "+p(["--build-from-source"])+"."):"android"===t.platform&&d.info("Android is not supported by Lightcord. We might drop a release on the Play Store/Expo. Please contact us to be sure "+t.DiscordLink),d.info(`Platform: [34m${t.platform}[0m`),d.info(`Requested file: [34mlightcord-${t.platform}*.zip[0m`),d.info("Found assets: "+e.map(e=>`[34m${e.name}[0m`).join(", ")),await a.pressAnyKeyToContinue(),process.exit()),o},t.getFullCommand=p,t.installerVersion="1.0.0",t.formatFetchErrorResult=h,t.isError=m},function(e,t){e.exports=require("path")},function(e,t){e.exports=require("fs")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=class{constructor(e){this.name=e}log(...e){console.log(`[[35m${this.name}[0m]`,...e)}error(...e){console.log(`[[35m${this.name}[0m] [[31mERROR[0m]`,...e)}info(...e){console.log(`[[35m${this.name}[0m] [[34minfo[0m]`,...e)}}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.pressAnyKeyToContinue=void 0,t.pressAnyKeyToContinue=function(){return process.stdout.isTTY?new Promise(e=>{console.log("Press any key to continue..."),process.stdin.setRawMode(!0),process.stdin.resume(),process.stdin.once("data",()=>{process.stdin.setRawMode(!1),process.stdin.pause(),e()})}):Promise.resolve()}},function(e,t){e.exports=require("node-fetch")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r="[[31mLightcord[0m] ";class s{constructor(e,t,o){this.from=0,this.to=0,this.actual=0,this.from=e,this.to=t,this.actual=this.from,this.format=o||s.format}static format(e,t){return`${e}/${t} ${Math.floor(e/t*100)}%`}update(e){if(process.stdout.isTTY)if(this.actual=this.actual+e,this.actual===this.to){let e=this.format(this.actual,this.to);process.stdout.write("[2K[0G"+r+e+" [32mFinished[0m\n")}else{let e=this.format(this.actual,this.to);process.stdout.write("[2K[0G"+r+e)}else{let e=this.format(this.actual,this.to);process.stdout.write(r+e+"\n")}}}t.default=s},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.copyFolder=t.moveFolder=t.copyFile=t.moveFile=void 0;const r=o(2),s=o(1);async function i(e,t){await r.promises.rename(e,t).catch(o=>"EXDEV"===o.code?n(e,t).then(t=>{r.promises.unlink(e)}):Promise.reject(o))}async function n(e,t){var o=r.createReadStream(e),s=r.createWriteStream(t);return new Promise((e,t)=>{o.on("error",t),s.on("error",t),o.on("close",(function(){e()})),o.pipe(s)})}t.moveFile=i,t.copyFile=n,t.moveFolder=async function e(t,o){let n=await r.promises.readdir(t,{withFileTypes:!0});await Promise.all(n.map(async n=>{n.isDirectory()?(await e(s.join(t,n.name),s.join(o,n.name)),await r.promises.rmdir(s.join(t,n.name),{recursive:!0})):n.isFile()&&(await r.promises.mkdir(o,{recursive:!0}),await i(s.join(t,n.name),s.join(o,n.name)))}))},t.copyFolder=async function e(t,o){let i=await r.promises.readdir(t,{withFileTypes:!0});await Promise.all(i.map(async r=>{(r.isDirectory()||r.isFile())&&await e(s.join(t,r.name),s.join(o,r.name))}))}},function(e,t){e.exports=require("cross-spawn")},function(e,t){e.exports=require("child_process")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.defaultItems=t.Menu=void 0;const r=o(0),s=o(18),i=o(19),n=o(0),a=o(20);t.Menu=class{constructor(e,t=!1){this.disabled=!1,this.props=e,this.state={selected:e.selected||null},this.currentMenu=null,this.isSub=t,this.onKeypress=this.onKeypress.bind(this),this.setUpStdin()}setUpStdin(){this.isSub||(process.stdin.setRawMode(!0),process.stdin.resume(),s.emitKeypressEvents(process.stdin),process.stdin.on("keypress",this.onKeypress))}onKeypress(e,t){if(t.ctrl&&("c"===t.name||"d"===t.name))return process.exit();if("[A"===t.code){let e=this.state.selected?this.props.options.findIndex(e=>e.id===this.state.selected):0,t=this.props.options[e-1];t||(t=this.props.options[this.props.options.length-1]),this.state.selected=t.id,this.render()}else if("[B"===t.code){let e=this.state.selected?this.props.options.findIndex(e=>e.id===this.state.selected):0,t=this.props.options[e+1];t||(t=this.props.options[0]),this.state.selected=t.id,this.render()}else if("return"===t.name){if(!this.state.selected)return;this.props.options.find(e=>e.id===this.state.selected).onClick()}}fixLabel(e,t){if(e.length===t)return" "+e+" ";let o=t-e.length,r=" ";for(let e=0;e<o/2;e++)r+=" ";r+=e;for(let e=0;e<o/2;e++)r+=" ";return r+=" ",r.length>t+2&&(r=r.slice(0,-1)),r}renderOption(e,t){let o=t.label;return this.state.selected===t.id&&(o=`[4m${o}[0m`),o="- "+o,o}render(){if(this.disabled)return this.isSub?"":void 0;let e="";if(this.isSub||(e=`\n\n[31m${a}[0m\n\nThis is an interactive menu. \nYou should be able to choose with arrows keys and enter.\nFor help visit our Discord ${r.DiscordLink}\nYou're currently seeing the ${n.platform} menu.\n\n`),this.currentMenu)e+=this.currentMenu.render();else{let t=this.props.options.map(e=>e.label.length).sort().reverse()[0];e+=this.props.options.map(e=>this.renderOption(t,e)).join("\n")+"\n\n"}if(this.isSub)return e;process.stdout.write("[1;1H[0J"+e)}disable(){this.disabled||(this.disabled=!0,this.isSub||(process.stdin.removeAllListeners("keypress"),process.stdin.setRawMode(!1),process.stdin.pause(),console.clear()))}enable(){this.disabled&&(this.disabled=!1,this.setUpStdin(),this.render())}},t.defaultItems=[{id:"discord",label:"Join Our Discord",onClick(){i.open(r.DiscordLink.replace(/\x1b\[\d+m/g,""))}},{id:"close",label:"Quit",onClick(){process.exit()}}]},function(e,t,o){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0});const r=o(13),s=o(3),i=o(0);r.patch();const n=o.c[o.s]===e;let a,l=console.log;switch(console.log=(...e)=>l("[[31mLightcord[0m]",...e),console.info=(...e)=>console.log("[[34minfo[0m]",...e),new s.default("Boostrap").log("Initialization"),i.platform){case"win":a=o(17),a.start(n).catch(e=>{console.error(e),console.log("An error occured in the main process. Please refer to [33mhttps://github.com/Lightcord/LightcordInstaller[0m to how to solve it or join our Discord "+i.DiscordLink)});break;case"linux":case"android":a=o(21),a.start(n).catch(e=>{console.error(e),console.log("An error occured in the main process. Please refer to [33mhttps://github.com/Lightcord/LightcordInstaller[0m to how to solve it or join our Discord "+i.DiscordLink)});break;default:console.log(`Uh oh, it looks like your platform [33m${i.platform}[0m is not supported. Learn how to build from source on ${i.repoLink}`)}}).call(this,o(12)(e))},function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.patch=void 0;o(2);t.patch=function(){1}},function(e,t){e.exports=require("appdata-path")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.fetch=void 0;const r=o(5),s=o(0);t.fetch=Object.assign((function(e,t){return"string"==typeof e||"href"in e?(t||(t={}),t.headers?t.headers instanceof r.Headers?t.headers.has("User-Agent")||t.headers.set("User-Agent","LightcordInstaller/"+s.installerVersion):Array.isArray(t.headers)?t.headers.find(e=>"User-Agent"===e[0])||t.headers.push(["User-Agent","LightcordInstaller/"+s.installerVersion]):t.headers["User-Agent"]="LightcordInstaller/"+s.installerVersion:t.headers={"User-Agent":"LightcordInstaller/"+s.installerVersion}):e instanceof r.Request&&(e.headers.has("User-Agent")||e.headers.set("User-Agent","LightcordInstaller/"+s.installerVersion)),r.default(e,t)}),o(5).default)},function(e,t){e.exports=require("yauzl")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.killLightcord=t.download=t.start=void 0;const r=o(2),s=o(3),i=o(0),n=o(1),a=o(6),l=o(7),c=o(1),d=o(8),u=o(4),p=o(9),h=o(10),m=new s.default("win32");async function f(){m.log("Killing instances of Lightcord"),await g(),m.log("Downloading Lightcord to "+i.downloadPath);let e=await i.getLatestReleaseInfos();m.log(`Downloading release ${e.tag_name} (${e.html_url})`);let t=await i.getAsset(e.assets);await r.promises.mkdir(n.dirname(i.downloadPath),{recursive:!0});let o=new a.default(0,t.size);await i.downloadFileToFile(t.browser_download_url,i.downloadPath,e=>{o.update(e)}),m.log("Unzipping... This may take some minutes at worst");let s=await i.unzipFile(i.downloadPath);m.log("[32mFinished unzipping[0m. Moving [31mLightcord[0m and cleaning stuff"),s.toLowerCase().includes("appdata\\roaming")&&(await l.moveFolder(s,c.join(s,"..","..","..","Local","Lightcord")),await r.promises.rmdir(s,{recursive:!0}),s=c.join(s,"..","..","..","Local","Lightcord")),await r.promises.unlink(i.downloadPath),m.log("[32mFinished moving, launching...[0m");let u=n.join(s,"Lightcord.exe");await new Promise((e,t)=>{d.spawn(u,{detached:!0}).on("error",e=>{t(e)}),e()}),m.log("[31mLightcord[0m is [32mnow installed[0m !")}function g(){return new Promise(e=>{p.exec("taskkill /im Lightcord.exe /t /F",()=>e())})}t.start=async function(e){if(e&&2===process.argv.length)await f(),setTimeout(()=>{process.exit()},1e4),await u.pressAnyKeyToContinue(),process.exit();else{console.clear();let e=new h.Menu({options:[{id:"install",label:"Install Lightcord",async onClick(){e.disable(),await f(),await u.pressAnyKeyToContinue(),e.enable()}},...h.defaultItems],selected:"install"});e.render()}},t.download=f,t.killLightcord=g},function(e,t){e.exports=require("readline")},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.open=void 0;const r=o(9);t.open=function(e){r.exec(("win32"==process.platform?"start":"android"==process.platform?"xdg-open":"open")+" "+e.replace(/&/g,"^&"),()=>{})}},function(e,t){e.exports="██╗     ██╗ ██████╗ ██╗  ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ \r\n██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗\r\n██║     ██║██║  ███╗███████║   ██║   ██║     ██║   ██║██████╔╝██║  ██║\r\n██║     ██║██║   ██║██╔══██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║\r\n███████╗██║╚██████╔╝██║  ██║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝\r\n╚══════╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ \r\n"},function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.download=t.start=void 0;const r=o(2),s=o(3),i=o(0),n=o(1),a=o(6),l=o(7),c=o(1),d=o(8),u=o(4),p=o(10),h=o(22),m=new s.default("linux");async function f(){m.log("Downloading Lightcord to "+i.downloadPath);let e=await i.getLatestReleaseInfos();m.log(`Downloading release ${e.tag_name} (${e.html_url})`);let t=await i.getAsset(e.assets);await r.promises.mkdir(n.dirname(i.downloadPath),{recursive:!0});let o=new a.default(0,t.size);await i.downloadFileToFile(t.browser_download_url,i.downloadPath,e=>{o.update(e)}),m.log("Unzipping... This may take some minutes at worst");let s=await i.unzipFile(i.downloadPath);m.log("[32mFinished unzipping[0m. Moving [31mLightcord[0m and cleaning stuff");let u=c.join(h.homedir(),"Lightcord");await l.moveFolder(s,u),await r.promises.rmdir(s,{recursive:!0}),s=u,await r.promises.unlink(i.downloadPath),m.log("[32mFinished moving, launching...[0m");let p=n.join(s,"Lightcord");await new Promise((e,t)=>{d.spawn(p,{detached:!0}).on("error",e=>{t(e)}),e()}),m.log("[31mLightcord[0m is [32mnow installed[0m !")}t.start=async function(e){console.clear();let t=new p.Menu({options:[{id:"install",label:"Install Lightcord",async onClick(){t.disable(),await f(),await u.pressAnyKeyToContinue(),t.enable()}},...p.defaultItems],selected:"install"});t.render()},t.download=f},function(e,t){e.exports=require("os")}]);