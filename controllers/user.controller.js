const User = require('../models/user.model')
const Token = require('../models/token.model')
var ph = require('password-hash')
exports.signup = async (req, res) => {
    tuser = await User.findOne({
        "email": req.body.email
    })
    if (tuser) {
        res.send("USER ALREADY EXISTS!!")
    } else {
        var user = new User({
            "name": req.body.name,
            "email": req.body.email,
            "password": ph.generate(req.body.password)
        })
        user = await user.save()
        var token = new Token({
            userid: user._id
        })
        token = await token.save()
        res.header("Authorization", token._id)
        res.status(200).send(user)
    }
}
exports.signin = async (req, res) => {
    var luser = await User.findOne({
        "email": req.body.email
    })
    if (luser) {
        if (ph.verify(req.body.password, luser.password)) {
            var token = new Token({
                "userid": luser._id
            })
            token = await token.save()
            res.header("Authorization", token._id)
            res.status(200).send(luser)
        } else {
            res.send("PASSWORD UNMATCHED!!")
        }
    } else {
        res.send("USER DOESN'T EXIST PLEASE REGISTETR!!")
    }
}
exports.signout = async (req, res) => {
    var asuser = await User.findOne({
        "email": req.body.email
    })
    if (asuser) {
        var v = await asuser._id
        if (ph.verify(req.body.password, asuser.password)) {
            var t = await Token.findOne({
                "userid": v
            })
            if (t) {
                await Token.findByIdAndRemove(t._id)
                res.send("Deleted!!")
            } else {
                res.send("PLEASE LOGIN FIRST!!")
            }
        } else {
            res.send("PASSWORD UNMATCHED!!")
        }
    } else {
        res.send("USER DOESN'T EXIST PLEASE REGISTETR!!")
    }
}
exports.signoutall = async (req, res) => {
    var pruser = await User.findOne({
        "email": req.body.email
    })
    if (pruser) {
        var v = await pruser._id
        if (ph.verify(req.body.password, pruser.password)) {
            var t = await Token.findOne({
                "userid": v
            })
            if (t) {
                while (t) {
                    await Token.findByIdAndRemove(t._id)
                    t = await Token.findOne({
                        "userid": v
                    })
                }
                res.send("Deleted!!")
            } else {
                res.send("PLEASE LOGIN FIRST!!")
            }
        } else {
            res.send("PASSWORD UNMATCHED!!")
        }
    } else {
        res.send("USER DOESN'T EXIST PLEASE REGISTETR!!")
    }
}
exports.retrieveuser = async (req, res) => {
    //TODO
    var user = await User.findById(req.userid);
    if (!user) {
        //
    }
    res.status(200).send(user);
}