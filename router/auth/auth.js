const express = require("express")
const customer = require("../../models/index").customer
const app = express()
const SECRET_KEY_CUSTOMER = "Customer"

app.use(express.urlencoded({extended:true}))
const jwt = require("jsonwebtoken")
app.post('/',async (req,res)=>{
    let parameter = {
        name: req.body.name
    }

    let costumer = await customer.findOne({where:parameter})
    let jwtHeader = {
        algorithm: "HS256",
        expiresIn: "1h"
    }
    let payload = JSON.stringify(costumer)
    res.json({
        data: costumer,
        token: jwt.sign(payload,SECRET_KEY_CUSTOMER)
    })
})

module.exports = app