const { AddnewCon, Exist, UpdateCon, RejectReq, createGroup, JoinGroup, MakeGroupAdmin } = require("./ConModel")

class ConController {
    constructor() { }

    async Request(req, res) {
        try {
            const { requested_by, accepted_by, con_status } = req.body
            if (!requested_by) {
                return res.status(400).send({ message: "Missing depandency requested_by" })
            }
            if (!accepted_by) {
                return res.status(400).send({ message: "Missing depandency accepted_by" })
            }
            const CheckExist = await Exist(req.body)
            if (CheckExist) {
                const Update = await UpdateCon(CheckExist.id, con_status)
                if (Update) {
                    return res.status(200).send({ message: "Success" })
                }
                return res.status(500).send({ message: "Somthing went wrong" })
            }
            const createConnection = await AddnewCon(req.body)
            if (createConnection) {
                return res.status(200).send({ message: "Success" })
            }
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (err) {
            console.log(err)
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async RejectRequest(req, res) {
        try {
            const { requested_by, accepted_by } = req.body
            if (!requested_by) {
                return res.status(400).send({ message: "Missing depandency requested_by" })
            }
            if (!accepted_by) {
                return res.status(400).send({ message: "Missing depandency accepted_by" })
            }
            const exist = await Exist(req.body)
            if (exist) {
                const Remove = await RejectReq(exist.id)
                if (Remove) {
                    return res.status(200).send({ message: "Success" })
                }
                return res.status(500).send({ message: "Somthing went wrong" })
            }
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (err) {
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async CreateNewGroup(req, res) {
        try {
            const { name, created_by, joined_by } = req.body
            if (!name) {
                return res.status(400).send({ message: "Missing depandency accepted_by" })
            }
            if (!created_by) {
                return res.status(400).send({ message: "Missing depandency created_by" })
            }
            if (!joined_by || !joined_by.length > 0) {
                return res.status(400).send({ message: "Missing depandency joined_by" })
            }
            const Create = await createGroup(req.body)
            if (Create) {
                const peoples = joined_by.map((x) => {
                    return {
                        joined_by: x,
                        invited_by: created_by,
                        groupid: Create.id,
                        is_admin: x === created_by ? true : false
                    }
                })
                const InsertPeople = await JoinGroup(peoples)
                if (InsertPeople) {
                    return res.status(200).send({ message: "Success" })
                }
                return res.status(500).send({ message: "Somthing went wrong" })
            }
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (err) {
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async InviteGroup(req, res) {
        try {
            const {invited_by,joined_by, groupid} = req.body
            if(!invited_by){
                return res.status(400).send({message:"Missing depandency invited_by"})
            }
            if(!joined_by || !joined_by.length > 0){
                return res.status(400).send({message:"Missing depandency joined_by"})
            }
            if(!groupid){
                return res.status(400).send({message:"Missing depandency groupid"})
            }
            const Joined_people = joined_by.map((x) => {
                return {
                    joined_by:x,
                    invited_by:invited_by,
                    groupid:groupid,
                }
            })
            const Invite = await JoinGroup(Joined_people)
            if(Invite){
                return res.status(200).send({message:"Success"})
            }
            return res.status(500).send({message:"Somthing went wrong"})
        } catch (err) {
            if(err.code === "P2002"){
                return res.status(500).send({message:"Duplicate entry with gorup and people"})
            }
            return res.status(500).send({message:"Internal server error"})
        }
    }

    async makeAdmin(req,res) {
        try {
            const {join_id, status}  = req.body
            if(!join_id){
                return res.status(400).send({message:"Missing depandency join_id"})
            }
            const Result = await MakeGroupAdmin(join_id , (status || false))
            if(Result){
                return res.status(200).send({message:'Success'})
            }
            return res.status(500).send({message:"Somthing went wrong"})
        } catch (err) {
            return res.status(500).send({message:"Internal server error", err:err.message})
        }
    } 

}

module.exports = new ConController()