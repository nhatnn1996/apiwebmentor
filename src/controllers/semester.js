"use strict"

const Specialized = require('../models/specialized');
const respone = require("../helper/response")

exports.create = function(req, res, next) { 
    const { title, background, description, specialized, image } = req.body,
    user = req.user._id;

    respone.checkNotExist(title,'Bạn cần điền nội dung vào tiêu đề.', res )
    respone.checkNotExist(background,'Bạn cần thêm hình background',res )
    respone.checkNotExist(description,'You must enter a description.',res )
    respone.checkNotExist(specialized,'You must enter a specialized.',res )
    respone.checkNotExist(image,'You must enter a image.', res )

    // look for existing title and makes words if no duplicate are found
    Mentor.findOne({ title }, function(err, result) {
        if(err) {
            return next(err);
        }
        if (result) {
            return res.status(422).send({
              error: 'Tiêu đề đã được sử dụng'
            });
        }
    })
    let mentor = new Mentor({
        title, user, background, description, specialized, image
    });

    mentor.save(function(err, result){
        if(err) next(err); 
        if(result) {
            res.status(200).json({
                data: result,
                type: "success",
                massage: "Create tutor success. User can use feature right now."
            })
        }
    })
}

exports.all = function(req, res, next) { 
    Specialized.find( {}, function(err, result) {
        if(err) {
            return next(err);
        }
        if(result) {
            return res.status(200).json({
                data: [...result],
                type: "success",
                message: "Get all user success."
            });
       }
    })
}
exports.status = async function(req, res, next) { 
    let {page, status, limit } = req.query
    let length = 0
    page = parseInt(page)
    limit = parseInt(limit)
    await Mentor.find({} ,function(err,result) {
       if(err) {
           throw err
       }
       length = result.length
    })
    Mentor.find({})
        .skip((page - 1)* limit)
        .limit(limit)
        .populate('specialized')
        .exec(function(err, result) {
            if(err) {
                return next(err);
            }
            if(result) {
                return res.status(200).json({
                    data: result,
                    type: "success",
                    message: "Get all user success.",
                    length: length
                });
           }
        })
}

exports.update = function(req, res, next) { 
    const _id = req.params.id
    const mentor = req.body
    Mentor.updateOne( {_id} ,{ $set: mentor } , function(err , reuslt ) {
        if(err) { 
            return res.status(400).json({
                type: "error",
                message: err
            });
        }
        if(reuslt) {
            return res.status(400).json({
                type: "success",
                message: "Update success"
            });
        }
    } )
}

exports.search = function(req, res, next) { 
    const {keyword} = req.query
    Mentor.find({ nickname: { $regex: '.*' + keyword + '.*', $options: 'i' } })
        .populate('specialized')
        .exec( function(err , result ) {
            if(err) { 
                return respone.resError(300, err, res);
            }
            if(result) {
                return res.status(200).json(result)
            }
        })
}

exports.delete = function(req, res, next) { 
    const _id = req.params.id
    Mentor.deleteOne({_id}, function(err, result) {
        if(result){
            return res.status(400).send({
                type: "success",
                message: "Delete Tutor success"
            });
        }
    })
}

exports.info = async function(req, res, next) { 
    const _id = req.params.id;
    
    let result = await Mentor.findOne({_id})
    respone.resData(res, 200, data)
}



exports.createMany = function(req, res, next) {
    Mentor.insertMany(mentors, function(error, result) {
        if(error) {
            res.status(404)
        }
        res.status(200).json(result)
    })
}

