const jwt = require("jsonwebtoken");
const {config} = require('./secret')

exports.auth = (req,res,next) => {
    const token= req.cookies['token'];
    if(!token){
        return res.status(401).json({msg:"You must send token in the header to this endpoint"})
    }
    try{
        req.tokenData = jwt.verify(token, config.tokenSecret);
        next();
    }
    catch(err){
        return res.status(401).json({msg:"Token invalid or expired"})
    }
}

exports.authAdmin = (req,res,next) => {
    const token= req.cookies['token'];
    if(!token){
        return res.status(401).json({msg:"You must send token in the header to this endpoint"})
    }
    try{
        let decodeToken = jwt.verify(token,config.tokenSecret);
        if(decodeToken.role !== "admin" && decodeToken.role !== "superAdmin"){
            return res.status(401).json({msg:"Just admin or superAdmin can be in this endpoint"})
        }
        req.tokenData = decodeToken;
        next();
    }
    catch(err){
        return res.status(401).json({msg:"Token invalid or expired"})
    }
}