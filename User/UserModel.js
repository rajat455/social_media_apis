const { PrismaClient } = require("@prisma/client")

const Prisma = new PrismaClient()

class UserModel {
    constructor() { }

    async addNew(data) {
        return await Prisma.user.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                username:data.username
            }
        })
    }

    async NewOtp(otp, user, email) {
        return await Prisma.otp.create({
            data: {
                userid: user,
                otp: otp,
                email: email
            }
        })
    }

    async GetUser(email) {
        let to = new Date()
        let from = new Date()
        from.setMinutes(from.getMinutes() - 1)
        return await Prisma.otp.findFirst({
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

    async isEmailExist(email){
        return await Prisma.user.findFirst({
            where:{
                email:email
            }
        })
    }


}

module.exports = new UserModel()