import * as byteSize from "byte-size"

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
        const progress40 = Math.round((from / to)*40)
        let progress = `\x1b[47m${" ".repeat(progress40)}\x1b[40m${" ".repeat(40-progress40)}`
        let percentage = (from / to *100).toFixed(2)
        const numberLength = percentage.split(".")[0].length
        if(numberLength < 2){
            percentage = "0"+percentage
        }
        return `[\x1b[31mLightcord\x1b[0m] [${progress}] ${byteSize(from)}/${byteSize(to)} ${percentage}%`
    }

    getElapsedTime(){
        return Date.now() - this.started
    }

    format: (from:number, to:number) => string

    update(plus: number):void{
        this.actual = this.actual + plus

        let stringFormatted = this.format(this.actual, this.to)
        process.stdout.write("\x1b[2K\x1b[0G"+stringFormatted)
    }
}