const { GetConnectedPeoples, GetSuggations } = require("../Connection/ConModel")
const { addFeed, deleteFeed, GetByusers, GetAll } = require("./FeedModel")

class FeedController {
    constructor() { }

    async AddNewPost(req, res) {
        try {
            const { tital, desc, fileids, posted_by } = req.body
            let Data = fileids && fileids.length > 0 ? fileids.map((x) => {
                return {
                    tital: tital || undefined,
                    desc: desc || undefined,
                    posted_by: posted_by,
                    fileid: x || undefined
                }
            }) : null

            if (!posted_by) {
                return res.status(400).send({ message: "Missing depandency posted_by" })
            }
            if (!Data) {
                Data = [
                    {
                        tital: tital || undefined,
                        desc: desc || undefined,
                        posted_by: posted_by,
                    }
                ]
            }
            const addPost = await addFeed(Data)
            if (addPost) {
                return res.status(200).send({ message: "Success" })
            }
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (err) {
            if (err.code === "P2002") {
                return res.status(500).send({ message: "Duplicate entry with fileid" })
            }
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async Remove(req, res) {
        try {
            const { id } = req.query
            if (!id) {
                return res.status(400).send({ message: "Missing depandency id" })
            }
            const dlt = await deleteFeed(id)
            if (dlt) {
                return res.status(200).send({ message: "Success" })
            }
            return res.status(500).send({ message: "Somthing went wrong" })
        } catch (err) {
            return res.status(500).send({ message: "Internal server error", err: err.message })
        }
    }

    async GetAllFeeds(req, res) {
        try {
            const { userid } = req.query
            if (!userid) {
                return res.status(400).send({ message: "Missing depandency userid" })
            }
            let ConnectedPeoples = await GetConnectedPeoples(userid)
            ConnectedPeoples = ConnectedPeoples.map((x) => {
                return x.accepted_by || x.requested_by
            })
            if(!ConnectedPeoples.length > 0){
                let Feed = await GetAll(0,10)
                if(Feed){
                    Feed.map((x) => {
                        if(x.file){
                            x.file["url"] = `${process.env.APP_URL}${x.file.path}`
                        }
                    })
                    return res.status(200).send({message:"Success", TotalPost:Feed})
                }
                return res.status(500).send({message:"Somthing went wrong"})
            }
            let TotalPeoples = ConnectedPeoples
            const Suggations =await GetSuggations(TotalPeoples)
            if(Suggations.length > 0){
               let suggest = Suggations.map((x) => {
                return x.requested_by || x.accepted_by
               })
               TotalPeoples = [...TotalPeoples, ...suggest]
            }

            let Feeds = await GetByusers(TotalPeoples, 0, 10)
            if(Feeds){
                Feeds.map((x) => {
                    if(x.file){
                        x.file["url"] = `${process.env.APP_URL}${x.file.path}`
                    }
                })
                return res.status(200).send({message:'success', TotalPost:Feeds})
            }
            return res.status(500).send({message:"Somthing Went Wrong"})
        } catch (err) {
            return res.status(500).send({message:"Internal server error"})
        }
    }

}

module.exports = new FeedController()