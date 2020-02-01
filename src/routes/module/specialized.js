const express = require('express')
const Router = express.Router()
const SpecializedController = require('../../controllers/specialized')

// mentorRouter.post( "/", MentorController.create )
Router.get( "/", SpecializedController.all )


module.exports = Router