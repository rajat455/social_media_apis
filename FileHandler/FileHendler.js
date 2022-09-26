const fs = require("fs");
var randomstring = require("randomstring");

// const readdir =  utils.promisify(fs.readdirSync)

class FileHandler {
    constructor() {
    }
    async Checkdir(path) {
        try {
            const result = await fs.readdirSync(path)
            if (result) {
                return true
            }
            return false
        } catch (err) {
            return false
        }
    }
    async createDir(path) {
        try {
            await fs.mkdirSync(path)
            return true
        } catch (err) {
            return false
        }
    }
    async StoreFile(File, Path, Response) {
        try {
            Path = Path.split("/")
            let p = "./uploads"
            const chack = new FileHandler().Checkdir
            const create = new FileHandler().createDir
            let i = 0
            while (i < Path.length) {
                p += `/${Path[i]}`
                const result = await chack(p)
                if (!result) {
                    await create(p)
                }
                i++
            }
            
            let FileName = randomstring.generate({
                length: 6,
                charset: "alphabetic"
            })
            let extantion = File.name.split(".")
            extantion = extantion[extantion.length - 1]
            FileName = `${FileName}.${extantion}`
            const FileLocation = `${p}/${FileName}`
            let mim = File.mimetype
            File.mv(FileLocation)
            Response.Report.push({path:FileLocation.substring(1,FileLocation.length), mim:mim,size:File.size, extantion:extantion, name:FileName })
            Response.success = true
            return Response
        } catch (err) {
            Response.success = false
            return Response
        }
    }
    async UploadFile(File, Path) {
        const StoreFile = new FileHandler().StoreFile
        let Response = {
            success: false,
            Report: [],
            TotalUploadedFile:0,
        }
        let count = 0
        if (!File.length) {
            await StoreFile(File, Path, Response)
            count++
        }
        let i = 0
        while (i < File.length) {
            await StoreFile(File[i], Path, Response)
            if (!Response.success) {
                Response.TotalUploadedFile = count
                return Response
            }
            count++
            i++
        }
        Response.TotalUploadedFile = count
        return Response
    }

}

module.exports = new FileHandler()