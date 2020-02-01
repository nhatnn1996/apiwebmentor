const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config/main");
const router = require("./routes/router");
const socketEvents = require("./socketEvents");
const passport = require("passport");

// Connect to the database
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
// Start the server
app.use(cors());
const server = app.listen(config.port);
console.log("The server is running on port " + config.port + ".");

const io = require("socket.io").listen(server, {
    pingTimeout: 6000000,
    pingInterval: 2000
});
var obj = { ONLINES: [], SOCKET: [] };
socketEvents(io, obj);

// Middleware for Express requests
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads"));

//Enables CORS from client-side

router(app);
