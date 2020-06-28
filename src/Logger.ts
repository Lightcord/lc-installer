export default class Logger {
    name:string
    constructor(name:string){
        this.name = name
    }

    log(...args:any[]){
        console.log(`[\x1b[35m${this.name}\x1b[0m]`, ...args)
    }

    error(...args:any[]){
        console.log(`[\x1b[35m${this.name}\x1b[0m] [\x1b[31mERROR\x1b[0m]`, ...args)
    }

    info(...args:any[]){
        console.log(`[\x1b[35m${this.name}\x1b[0m] [\x1b[34minfo\x1b[0m]`, ...args)
    }
}