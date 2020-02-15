const Token = require("../models/token.model");
module.exports = async function(req,res,next) {
    var token = req.headers["authorization"];
    if(!token)
    return res.send({message:"no token provided"});

    token = await Token.findById(token)
    
    if(!token)
    return res.send({message:"invalid token"});

    // set here so next functions can access the userid by calling
    // req.userid
    req.userid = token.userid;
    next();
}