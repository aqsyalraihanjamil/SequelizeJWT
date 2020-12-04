const jwt = require("jsonwebtoken")

verify = (req,res,next) => {
    let headers = req.headers.authorization
    let token = null

    if(headers != null){
        token = headers.split(" ")[1]
        // headers = Bearer kode_token
        // split -> untuk mengkonversi string menjadi array
        // array = ["Bearer", "kode_token"]
    }

    if(token == null){
        res.json({
            message: "Unauthorized / tidak dikenali"
        })
    }else{
        let jwtHeader = {
            algorithm: "HS256"
        }

        let secretKey = "Customer"

        jwt.verify(token, secretKey, jwtHeader, err => {
            if(err){
                res.json({
                    message: "Invalid or expired token"
                })
            }else{
                next()
            }
        })
    }
}
module.exports = verify