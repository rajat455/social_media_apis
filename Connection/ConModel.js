const { PrismaClient } = require("@prisma/client")
const Prisma = new PrismaClient()

class ConModel {
    constructor() { }

    AddnewCon(data) {
        return Prisma.connection.create({
            data: {
                requested_by: data.requested_by,
                accepted_by: data.accepted_by,
                con_status: data.con_status
            }
        })
    }

    async Exist(data) {
        const root1 = await Prisma.connection.findFirst({
            where: {
                requested_by: data.requested_by,
                accepted_by: data.accepted_by,
            }
        })
        const root2 = await Prisma.connection.findFirst({
            where: {
                accepted_by: data.requested_by,
                requested_by: data.accepted_by
            }
        })
        return root1 || root2
    }

    UpdateCon(id, con_status) {
        return Prisma.connection.update({
            data: {
                con_status: con_status
            },
            where: {
                id: id
            },
        })
    }

    RejectReq(id) {
        return Prisma.connection.delete({
            where: {
                id: id
            }
        })
    }

    createGroup(data) {
        return Prisma.group.create({
            data: {
                name: data.name,
                created_by: data.created_by,
            }
        })
    }
    JoinGroup(data) {
        return Prisma.group_people.createMany({
            data: data
        })
    }
    MakeGroupAdmin(join_id, status) {
        return Prisma.group_people.update({
            data: {
                is_admin: status,
            },
            where: {
                id: join_id
            }
        })
    }
    async GetConnectedPeoples(userid) {
        const GetWithRequested = await Prisma.connection.findMany({
            select: {
                accepted_by: true
            },
            where: {
                requested_by: userid,
                con_status: "accept"
            }
        })
        const GetWithAccepted = await Prisma.connection.findMany({
            select: {
                requested_by: true
            },
            where: {
                accepted_by: userid,
                con_status: "accept"
            }
        })
        return [...GetWithAccepted || undefined, ...GetWithRequested || undefined]
    }

    async GetSuggations(userids){
        const GetWithRequested = await Prisma.connection.findMany({
            select:{
                accepted_by:true
            },
            where:{
                requested_by:{
                    in:userids
                },
                con_status:"accept"
            }
        })
        const GetWithAccepted = await Prisma.connection.findMany({
            select:{
                requested_by:true
            },
            where:{
                accepted_by:{
                    in:userids
                },
                con_status:"accept"
            }
        })

        return [...GetWithAccepted || undefined, ...GetWithRequested || undefined]
    }
}

module.exports = new ConModel()