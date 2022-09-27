const { addFeed, deleteFeed } = require("./FeedModel")

class FeedController {
    constructor() { }

    async AddNewPost(req, res) {
        try {
            const {tital, desc, fileid, posted_by} = req.body
            if(!posted_by){
                return res.status(400).send({message:"Missing depandency posted_by"})
            }
            const addPost = await addFeed(req.body)
            if(addPost){
                return res.status(200).send({message:"Success"})
            }
            return res.status(500).send({message:"Somthing went wrong"})
        } catch (err) {
            return res.status(500).send({message:"Internal server error", err:err.message})
        }
    }

    async Remove(req,res){
        try {
            const {id} = req.query
            if(!id){
                return res.status(400).send({message:"Missing depandency id"})
            }
            const dlt = await deleteFeed(id)
            if(dlt){
                return res.status(200).send({message:"Success"})
            }
            return res.status(500).send({message:"Somthing went wrong"})
        } catch (err) {
            return res.status(500).send({message:"Internal server error", err:err.message})
        }
    }
}

module.exports = new FeedController()