const {PrismaClient} = require("@prisma/client")

const Prisma = new PrismaClient()

class FeedModel{
    constructor(){}

    addFeed(data){
        return Prisma.feeds.createMany({
            data:data
        })
    }

    deleteFeed(id){
        return Prisma.feeds.delete({
            where:{
                id:id
            }
        })
    }

    GetByusers(users, from, to){
        return Prisma.feeds.findMany({
            select:{
                tital:true,
                desc:true,
                posted_at:true,
                posted_by:true,
                file:{
                    select:{
                        id:true,
                        mimtype:true,
                        path:true,
                        uploaded_by:true
                    },
                }
            },
            where:{
                posted_by:{
                    in:users
                }
            },
            orderBy:{
                posted_at:"desc"
            },
            skip:from,
            take:to
        })
    }

    GetAll(from,to){
        return Prisma.feeds.findMany({
            select:{
                tital:true,
                desc:true,
                posted_at:true,
                posted_by:true,
                file:{
                    select:{
                        id:true,
                        mimtype:true,
                        path:true,
                        uploaded_by:true
                    },
                }
            },
            orderBy:{
                posted_at:"desc"
            },
            skip:from,
            take:to
        })
    }
}

module.exports = new FeedModel()