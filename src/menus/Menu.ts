import { DiscordLink } from "../installer"
import * as readline from "readline"
import { open } from "../linkOpener"
import { platform } from "../installer"

const LightcordTitle = require("../../messages/splash.txt")

export class Menu {
    constructor(props:Menu["props"], isSub:boolean = false){
        this.props = props

        this.state = {
            selected: props.selected || null
        }

        this.currentMenu = null
        this.isSub = isSub

        this.onKeypress = this.onKeypress.bind(this)
        this.setUpStdin()
    }

    isSub:boolean
    currentMenu?:Menu

    disabled = false

    props:{
        options: {
            id:string,
            label:string,
            onClick?:()=>void
        }[],
        selected: string|null
    }

    state:{
        selected: string
    }

    setUpStdin(){
        if(this.isSub)return

        process.stdin.setRawMode(true)
        process.stdin.resume()
        readline.emitKeypressEvents(process.stdin)
        process.stdin.on("keypress", this.onKeypress)
    }

    onKeypress(char, key){
        if(key.ctrl && (key.name === "c" || key.name === "d")){
            return process.exit()
        }

        if(key.code === "[A"){
            let selectedIndex = this.state.selected ? this.props.options.findIndex(e => e.id === this.state.selected) : 0
            let opt = this.props.options[selectedIndex - 1]
            if(!opt)opt = this.props.options[this.props.options.length - 1]
            this.state.selected = opt.id
            this.render()
        }else if(key.code === "[B"){
            let selectedIndex = this.state.selected ? this.props.options.findIndex(e => e.id === this.state.selected) : 0
            let opt = this.props.options[selectedIndex + 1]
            if(!opt)opt = this.props.options[0]
            this.state.selected = opt.id
            this.render()
        }else if(key.name === "return"){
            if(!this.state.selected)return
            let opt = this.props.options.find(e => e.id === this.state.selected)
            opt.onClick()
        }
    }

    fixLabel(label:string, maxLength:number):string{
        if(label.length === maxLength)return " " + label + " "
        let toFix = maxLength - label.length
        let text = " "
        for(let i = 0; i < toFix / 2; i++){
            text += " "
        }
        text += label
        for(let i = 0; i < toFix / 2; i++){
            text += " "
        }
        text += " "
        if(text.length > maxLength + 2){
            text = text.slice(0, -1)
        }
        return text
    }

    renderOption(maxLength, option:Menu["props"]["options"][0]):string{
        let text = option.label

        if(this.state.selected === option.id){
            text = `\x1b[4m${text}\x1b[0m`
        }

        text = "- " + text


        
        /*let text = ""
        if(this.state.selected === option.id)text += "\x1b[33m"

        text += "+"+"-".repeat(maxLength + 2)+"+\n"
        //text += "|"+" ".repeat(maxLength + 2)+"|\n"
        text += "|"+this.fixLabel(option.label, maxLength)+"|\n"
        text += "+"+"-".repeat(maxLength + 2)+"+"

        if(this.state.selected === option.id)text += "\x1b[0m"*/
        return text
    }

    render(){
        if(this.disabled){
            if(this.isSub)return ""
            return
        }

        let text = ""
        if(!this.isSub)text = `\n\n\x1b[31m${LightcordTitle}\x1b[0m\n\nThis is an interactive menu. \nYou should be able to choose with arrows keys and enter.\nFor help visit our Discord ${DiscordLink}\nYou're currently seeing the ${platform} menu.\n\n`

        if(this.currentMenu)text += this.currentMenu.render()
        else{
            let maxLabelSize = this.props.options.map(e => e.label.length).sort().reverse()[0]
            text += this.props.options.map(e => this.renderOption(maxLabelSize, e)).join("\n")+"\n\n"
        }
        

        if(this.isSub)return text
        process.stdout.write("\x1b[1;1H\x1b[0J"+text)
    }

    disable(){
        if(this.disabled)return
        this.disabled = true
        if(!this.isSub){
            process.stdin.removeAllListeners("keypress")
            process.stdin.setRawMode(false)
            process.stdin.pause()
            console.clear()
        }
    }

    enable(){
        if(!this.disabled)return
        this.disabled = false
        this.setUpStdin()
        this.render()
    }
}

export const defaultItems = [
    {
        id: "discord",
        label: "Join Our Discord",
        async onClick(){
            open(DiscordLink.replace(/\x1b\[\d+m/g, ""))
        }
    },
    {
        id: "close",
        label: "Quit",
        async onClick(){
            console.clear()
            process.exit()
        }
    }
]