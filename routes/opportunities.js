const express= require("express");
const router = express.Router();
const {auth, authAdmin} = require("../middlewares/auth");
const {OpportunityModel, validateOpportunity, validateEditOpportunity} = require("../models/opportunity");

router.get('/', async (req, res) => {
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || -1;
    try{
        const opportunities = await OpportunityModel.find({status:true})
            .sort({[sort]:order});
        res.send(opportunities);
    }catch (e) {
        res.status(502 ).json({error:e.message});
    }
})
router.get('/single/:id', async (req, res) => {
    try{
        const opportunity = await OpportunityModel.findById(req.params.id);
        if(!opportunity) return res.status(404).json({msg:"Opportunity not found"});
        res.status(200).json(opportunity);
    }catch (e) {
        res.status(502).json({error:e.message});
    }
});
router.get('/oppPending', authAdmin, async (req, res) => {
    try{
        const opportunities = await OpportunityModel.find({status:false}).sort({createdAt:1});
        res.status(200).json(opportunities);
    }catch (e) {
        res.status(502 ).json({error:e.message});
    }
})
router.post('/', auth, async (req, res) => {
    const {error} = validateOpportunity(req.body);
    if (error) return res.status(400).json({error:error.details[0].message});
   try{
       const opportunity = new OpportunityModel(req.body);
       opportunity.status = req.tokenData.role === "admin";
       opportunity.userId = req.tokenData._id;
       opportunity.currentVolunteers = 0;
       await opportunity.save();
       res.status(200).json({msg:"Opportunity created successfully"});
   }catch (e) {
       res.status(502).json({error:e.message});
   }
});
router.patch('/:id', auth, async (req, res) => {
    const {error} = validateEditOpportunity(req.body);
    if (error) return res.status(400).json({error:error.details[0].message});
    if(req.body.status && req.tokenData.role !== "admin") return res.status(401).json({msg:"Just admin can change the status"});
    if(req.params.id !== req.tokenData._id && req.tokenData.role !== "admin") return res.status(401).json({msg:"You can't edit this opportunity"});
    try{
        const opportunity = await OpportunityModel.findById(req.params.id);
        if(!opportunity) return res.status(404).json({msg:"Opportunity not found"});
        if(!opportunity.status && req.body.currentVolunteers) return res.status(400).json({msg:"You can't change the current volunteers number"});
        await OpportunityModel.updateOne({ _id:req.params.id }, req.body, { new: true });
        res.status(200).json({msg:"Opportunity updated successfully"});
    }catch (e) {
        res.status(502).json({error:e.message});
    }
});
router.delete('/:id', auth, async (req, res) => {
    try{
        const opportunity = await OpportunityModel.findById(req.params.id).populate("userId");
        if(!opportunity) return res.status(404).json({msg:"Opportunity not found"});
       if(req.tokenData.role !== "admin" && req.tokenData._id !== opportunity.userId._id) return res.status(401).json({msg:"You can't delete this opportunity"});
        await OpportunityModel.deleteOne({ _id:req.params.id });
        res.status(200).json({msg:"Opportunity deleted successfully"});
    }catch (e) {
        res.status(502).json({error:e.message});
    }
})
module.exports = router;