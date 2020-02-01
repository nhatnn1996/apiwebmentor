"use strict"
const Deadline = require('../models/deadline');

exports.insert = function(req, res, next) { 
    const {title, deadline} = req.body;
    const user = req.user;
    if(!title) {
        return res.status(422).send({
          error: 'You must enter a title.'
        });
    }
    if(!deadline) {
        return res.status(422).send({
          error: 'You must enter a dealine.'
        });
    }
    if(!user) {
        return res.status(422).send({
          error: 'User is required.'
        });
    }

    // look for existing title and makes words if no duplicate are found
    Deadline.findOne({ title, user: user._id }, function(err, existingDealine) {
        if(err) {
            return next(err);
        }

        if (existingDealine) {
            return res.status(422).send({
              error: 'That title is already in use.'
            });
        }
    })

    let deadlineOj = new Deadline({
        title, 
        deadline, 
        user: user._id
    });

    deadlineOj.save(function(err, result){
        if(err) next(err); 

        if(result) {
            res.status(200).json({
                deadline: result,
                message: "Create new deadline success"
            })
        }
    })
}

exports.all = (req, res, next) => {
    const user = req.user
    Deadline.find({user: user._id}, (err, listDeadline) => {
        if(err) {
            return next(err);
        }

        if(listDeadline) {
            res.status(200).json({
                data: listDeadline
            })
        }
    })  
}
exports.getTrash = (req, res, next) => {
    Deadline.find({trash: true}, (err, listDeadline) => {
        if(err) {
            return next(err);
        }

        if(listDeadline) {
            res.status(200).json({
                data: listDeadline
            })
        }
    })  
}
exports.getNotTrash = (req, res, next) => {
    Deadline.find({trash: true}, (err, listDeadline) => {
        if(err) {
            return next(err);
        }
        if(listDeadline) {
            res.status(200).json({
                data: listDeadline
            })
        }
    })  
}

exports.update = async(req, res, next) => {
    const _id =  req.params.id
    const dealine =  req.body
    // check double title.
    Deadline.findOne({ title: dealine.title }, async function(err, result) {
        if(err) {
            return next(err);
        }
        if (result && result._id != _id) {
            console.log(result);
            return res.status(422).send({
              error: 'That title is already in use.'
            });
        }
        Deadline.updateOne({ _id }, {...dealine}, (err, result) =>{
            if(err) { 
                next(err) 
            }
            if(result) {
                res.status(200).json({
                    message: "Update Deadline success"
                })
            }
        })
    })
}
exports.delete = (req, res, next)=> {
    const _id = req.params.id;
    Deadline.updateOne({_id} , {trash: true},  (err, result) => {
        if(err) {
            next(err)
        }
        if(result) {
            res.status(200).json({
                message: "Trash Deadline success"
            })
        }
    });
}
exports.restore = (req, res, next)=> {
    const _id = req.params.id;
    Words.updateOne({_id} , {trash: false},  (err, result) => {
        if(err) {
            next(err)
        }
        if(result) {
            res.status(200).json({
                message: "Restore Words success"
            })
        }
    });
}
exports.destroy = (req, res, next)=> {
    const _id = req.params.id;
    Deadline.deleteOne({_id} , (err, result) => {
        if(err) {
            next(err)
        }
        if(result) {
            res.status(200).json({
                message: "Delete Words success"
            })
        }
    });
}