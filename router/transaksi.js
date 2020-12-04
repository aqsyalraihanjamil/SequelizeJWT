const express = require("express")
const { urlencoded } = require("express")
const app = express()
app.use(express.urlencoded({extended:true}))
const verify = require("./auth/verify")
//export model
const models = require('../models/index')
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi

app.get("/",verify, async (req, res) => {
    //get data
    let data = await transaksi.findAll({
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

app.get("/:transaksi_id", async (req, res) => {
    let param = { transaksi_id: req.params.transaksi_id }
    let data = await transaksi.findOne({
        where: param,
        include: [
            "customer",
            {
                model: models.detail_transaksi,
                as: "detail_transaksi",
                include: ["product"]
            }
        ]
    })
    res.json({
        data: data
    })
})

app.post("/", async (req, res) => {
    //insert data
    let data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }
    transaksi.create(data)
        .then(result => {
            let transaksi_id = result.transaksi_id
            let detail = JSON.parse(req.body.detail_transaksi)

            detail.forEach(element => {
                element.transaksi_id = transaksi_id
            });

            // create -> dibuat utk insert 1 data / row
            // bulkCreate-> dibuat utk insert multiple data/row
            detail_transaksi.bulkCreate(detail)
                .then(result => {
                    res.json({
                        message: "Data has been inserted"
                    })
                })
                .catch(error => {
                    res.json({
                        error: error.message
                    })
                })
        })
        .catch(error => {
            res.json({
                error: error.message
            })
        })

})

app.put("/", async (req, res) => {
    //edit data
    // tampung data yg direquest
    let data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }

    // tampung parameter
    let param = {
        transaksi_id: req.body.transaksi_id
    }

    // proses insert data ke table transaksi
    transaksi.update(data, {where: param})
    .then(result =>{
        detail_transaksi.destroy({where:param}).then().catch()

        let transaksi_id = param.transaksi_id
            let detail = JSON.parse(req.body.detail_transaksi)

            detail.forEach(element => {
                element.transaksi_id = transaksi_id
            });

            // create -> dibuat utk insert 1 data / row
            // bulkCreate-> dibuat utk insert multiple data/row
            detail_transaksi.bulkCreate(detail)
                .then(result => {
                    res.json({
                        message: "Data has been inserted"
                    })
                })
                .catch(error => {
                    res.json({
                        error: error.message
                    })
                })
    })
    .catch(error =>{
        res.json({
            error: error.message
        })
    })
})

app.delete("/:transaksi_id", async (req, res) => {
    //delete data
    let param = {
        transaksi_id : req.params.transaksi_id
    }
    try{
    await detail_transaksi.destroy({where:param})
    await transaksi.destroy({where:param})
    .then(result =>{
        res.json({
            result : "data has been deleted"
        })
    })
    .catch(error=>{
        res.json({
            error: error.message
        })
    })
    }
    catch{
        res.json({
            message: "error"
        })
    }
})


module.exports = app

