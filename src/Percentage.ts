import * as filesize from "filesize"

const baseLog = `[\x1b[31mLightcord\x1b[0m] `

export default class Percentage {
    constructor(from:number, to:number, format?: (from:number, to:number) => string){
        this.from = from
        this.to = to
        this.actual = this.from
        this.format = format || Percentage.format
        this.started = Date.now()
    }

    from:number = 0
    to:number = 0
    actual:number = 0
    started:number = Date.now()

    static format(from:number, to:number):string{
        return `${filesize(from, {round: 1})}/${filesize(to, {round: 1})} ${Math.floor((from / to) * 100)}%`
    }

    get elapsedTime(){
        return Date.now() - this.started
    }

    format: (from:number, to:number) => string

    update(plus: number):void{
        if(process.stdout.isTTY){
            this.actual = this.actual + plus
    
            if(this.actual === this.to){
                let stringFormatted = this.format(this.actual, this.to)
                process.stdout.write("\x1b[2K\x1b[0G"+baseLog+stringFormatted+" \x1b[32mFinished\x1b[0m\n")
            }else{
                let stringFormatted = this.format(this.actual, this.to)
                process.stdout.write("\x1b[2K\x1b[0G"+baseLog+stringFormatted)
            }
        }else{
            let stringFormatted = this.format(this.actual, this.to)
            process.stdout.write(baseLog+stringFormatted+"\n")
        }
    }
}