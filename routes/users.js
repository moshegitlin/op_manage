const express= require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");
const {validateUser, UserModel, validateLogin,getToken,validateEditUser} = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async(req,res) => {
    let validBody = validateUser(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "***"
        res.status(200).json(user);
    }
    catch(err){
        if(err.code === 11000){
            return res.status(400).json({msg:"Email already in system",code:11000})
        }
        res.status(502).json({err})
    }
})

router.post("/login", async(req,res) => {
    let validBody = validateLogin(req.body);
    if(validBody.error){
        return res.status(400).json(validBody.error.details);
    }
    try{
        let user = await UserModel.findOne({email:req.body.email})
        if(!user){
            return res.status(401).json({msg:"Email Worng."})
        }
        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(401).json({msg:"Password Worng."})
        }
        let token = getToken(user._id, user.role);
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)
        }).json({token: token, msg: "login success",role:user.role}).status(200);
    }
    catch(err){
        res.status(502).json(err)
    }
})
router.post('/logout',async (req,res)=>{
    try {
        res.clearCookie('token').json({msg: "logout success"})
    }catch (e){
        console.log(e);
        res.status(500).json({msg: "server error",e})
    }
})
router.patch("/:id", auth, async(req, res) => {
    let validBody = validateEditUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details[0].message);
    }
    let id = req.params.id;
    if(req.tokenData.role === "user" && req.tokenData._id !== id){
        return res.status(401).json({msg:"You cannot edit another user"})
    }
    if(req.body.role && req.tokenData.role !== "admin"){
        return res.status(401).json({msg:"You cannot change the role"})
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
        const updatedUser = await UserModel.updateOne({ _id: id }, req.body, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(502).json(err);
    }
})
router.delete("/:id", auth, async(req, res) => {
    if (req.tokenData.role === "admin" && req.params.id === req.tokenData._id) {
        return res.status(401).json({ msg: `You cannot delete an administrator of type ${req.tokenData.role}` })
    }
    if(req.tokenData._id !== req.params.id && req.tokenData.role !== "admin"){
        return res.status(401).json({msg:"You cannot delete another user"})
    }
    try {
        const deletedUser = await UserModel.deleteOne({ _id: req.params.id });
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(502).json(err);
    }
})



module.exports = router;
