const express = require("express");
const Router = express.Router();
const RentController = require("../../controllers/contract");

Router.get("/", RentController.read);
// Router.put("/", RentController.update);
Router.get("/rate/:id", RentController.rate);
Router.put("/", RentController.update);

module.exports = Router;
