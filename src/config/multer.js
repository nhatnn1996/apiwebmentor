const multer = require("multer");
var fs = require("fs");

const fileFilter = function(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = "uploads/" + file.fieldname + "/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limit: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

var upload = multer({ storage: storage });

module.exports = upload;
