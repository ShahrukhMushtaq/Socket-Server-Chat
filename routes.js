var express = require('express')
var router = express.Router()
var User = require('./user')

router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.send({ message: "Invalid email or password", status: 400, content: "" })
        let passwordMatcher = user.password == req.body.password;
        if (passwordMatcher) {
            return res.send({ message: "User Authenticated", status: 200, content: user })
        }
        res.send({ message: "Password Wrong", status: 404, content: '' })
    }
    else {
        res.send({ message: "Incomplete Details", status: 400, content: "" })
    }
})

router.post('/signup', async (req, res) => {
    if (req.body.email && req.body.username && req.body.password) {
        let user = await User.findOne({ email: req.body.email })
        if (user) return res.send({ message: "You have already registered", status: 400, content: "" })
        user = new User({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        })
        await user.save();
        res.send({ message: "Successfully Registered", status: 200, content: user })
    }
    else {
        res.send({ message: "Incomplete Details", status: 400, content: "" })
    }
})
// router.get('/', ()=>{})
// router.get('/', ()=>{})

module.exports = router;