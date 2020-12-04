const express = require("express")
const multer = require("multer")
const app = express()

const verify = require("./auth/verify")
//export model
const models = require('../models/index')
const customer = models.customer

//multer
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./customer_image")
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage})

app.get("/",  async (req, res) => {
    //get data
    customer.findAll()
        .then(hasil => {
            res.json({
                data: hasil
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.get("/:customer_id", async (req, res) => {
    //get data based on id
    let param = { customer_id: req.params.customer_id }
    customer.findOne({ where: param })
        .then(hasil => {
            res.json({
                data: hasil
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

app.post("/", upload.single("image"), (req,res) => {
    if (!req.file) {
        res.json({
            message: "no uploaded file"
        })
    } else {
        let data = {
            name: req.body.name,
            phone : req.body.phone,
            address: req.body.address,
            image : req.file.filename
        }
        // insert data
        customer.create(data)
        .then(result => {
            res.json({
                message : "data has been inserted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
    }
})

app.put("/", upload.single("image"), async (req, res) => {
    //edit data
    let param = { customer_id: req.body.customer_id }
    let data = {
        name: req.body.name,
        phone : req.body.phone,
        address: req.body.address
    }
    if (req.file) {
        const row = await customer.findOne({ where: param })
        let oldFileName = row.image

        // hapus file lama
        let dir = path.join(__dirname, "../customer_image", oldFileName)
        fs.unlink(dir, err => console.log(err))

        // set filename baru
        data.image = req.file.filename
    }
    customer.update(data, {where : param})
    .then(hasil => {
        res.json({
            data: "data has been updated"
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:customer_id", async (req, res) => {
    //delete data
    let param = {customer_id: req.body.customer_id}
    let result = await customer.findOne({where:param})
    let oldFileName = result.image

    // hapus file lama
    let dir = path.join(__dirname, "../customer_image", oldFileName)
    fs.unlink(dir, err => console.log(err))

    customer.destroy({where: param})
    .then(hasil => {
        res.json({
            data: "data has been deleted"
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app