import * as fs from "fs"
import * as path from "path"

export async function moveFile(oldPath:string, newPath:string){
    await fs.promises.rename(oldPath, newPath)
    .catch((err) => {
        if (err.code === 'EXDEV') {
            return copyFile(oldPath, newPath).then(e => {
                fs.promises.unlink(oldPath)
            })
        }
        return Promise.reject(err)
    })
}

export async function copyFile(oldPath:string, newPath:string){
    var readStream = fs.createReadStream(oldPath);
    var writeStream = fs.createWriteStream(newPath);

    return new Promise<void>((resolve, reject) => {
        readStream.on('error', reject);
        writeStream.on('error', reject);
    
        readStream.on('close', function () {
            resolve()
        });
    
        readStream.pipe(writeStream);
    })
}

export async function copyFolder(oldPath:string, newPath:string){
    let files = await fs.promises.readdir(oldPath, {withFileTypes: true})
    await Promise.all(files.map(async file => {
        if(file.isDirectory()){
            await copyFolder(path.join(oldPath, file.name), path.join(newPath, file.name))
        }else if(file.isFile()){
            await copyFolder(path.join(oldPath, file.name), path.join(newPath, file.name))
        }
    }))
}