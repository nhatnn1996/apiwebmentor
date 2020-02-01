
const Mentor = require("../models/mentor")
const response = require("../helper/response") 

exports.authMentor = async (req,res, next) => {
    const _id = req.body.mentor
        // Kiểm tra mentor có tồn tại hay không
    if(!_id) {
        return res.status(403).send({
            type: "error",
            massage: "Not exist mentor in request"
        });
    }
    Mentor.findById(_id, (err, result)=> {
        if(result !== null) {
            req.mentor = result
            return next()
        }else{ 
            response.resError(404, "Not found Mentor", res) 
        }
    })
}
