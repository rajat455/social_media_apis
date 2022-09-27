const {PrismaClient} = require("@prisma/client")

const Prisma = new PrismaClient()

class FeedModel{
    constructor(){}

    addFeed(data){
        return Prisma.feeds.create({
            data:{
                tital:data.name || undefined,
                desc:data.desc || undefined,
                posted_by:data.posted_by,
                fileid:data.fileid || undefined
            }
        })
    }

    deleteFeed(id){
        return Prisma.feeds.delete({
            where:{
                id:id
            }
        })
    }

}

module.exports = new FeedModel()