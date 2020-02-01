exports.checkNotExist = function (input , message ,res) {
    if(!input) {
      return res.status(422).send({
        type: "error",
        massage: message
      });
    }
  }

exports.resError = function(status, error, res) {
    return res.status(status).send({
      type: "error",
      massage: error
    });
  }

  exports.resSuccess  = function(res,status) {
    return res.status(status).send({
        type: "success",
      });
  }

  exports.resData  = function(status, data, res) {
    return res.status(status).send({
        ...data
      });
  }

  exports.resValidate  = function(validation, res) {
    return res.status(200).send({
      validation
    });
  }