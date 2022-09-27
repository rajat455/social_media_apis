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
                id:join_id
            }
        })
    }
}

module.exports = new ConModel()