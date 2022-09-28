const { PrismaClient } = require("@prisma/client")

const Prisma = new PrismaClient()

class UserModel {
    constructor() { }

    addNew(data) {
        return Prisma.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                username: data.username
            }
        })
    }

    NewOtp(otp, user, email) {
        return Prisma.otp.create({
            data: {
                userid: user,
                otp: otp,
                email: email
            }
        })
    }

    GetUser(email) {
        let to = new Date()
        let from = new Date()
        from.setMinutes(from.getMinutes() - 1)
        return Prisma.otp.findFirst({
            select: {
                otp: true,
                user: true
            },
            where: {
                email: email,
                created_at: {
                    gt: from,
                    lt: to,
                }
            }
        })
    }

    isEmailExist(email) {
        return Prisma.user.findFirst({
            where: {
                email: email
            }
        })
    }

    UploadedFileData(data) {
        return Prisma.files.createMany({
            data: data,
        })
    }

    GetFileWithName(names){
        return Prisma.files.findMany({
            select:{
                id:true,
                path:true,
                mimtype:true
            },
            where:{
                name:{
                    in:names
                }
            }
        })
    }

}

module.exports = new UserModel()