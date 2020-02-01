const nodemailer = require("nodemailer");
const TemplateVerify = require("../template/verify");
const TemplateForget = require("../template/forget");
const dotenv = require("dotenv");
dotenv.config();

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASS // generated ethereal password
    }
});

let message = (email, code, name) => ({
    from: '" Mentor Poly 👻" <mentorpoly@email.com>', // Sender address
    to: email, // List of recipients
    subject: "Xát nhận tài khoản PolyMentor", // Subject line
    html: TemplateVerify(code, name) // Plain text body
});

let reset_password = (email, code, name) => ({
    from: '" Mentor Poly 👻" <mentorpoly@email.com>', // Sender address
    to: email, // List of recipients
    subject: "Đặt lại mật khẩu", // Subject line
    html: TemplateForget(code, name, email) // Plain text body
});

const sendMail = (email, code, name, type = "verify") => {
    let template = null;
    console.log("send");
    if (type === "verify") {
        template = message(email, code, name);
    } else {
        template = reset_password(email, code, name);
    }

    transport.sendMail(template, function(err, info) {
        if (err) {
            return false;
        } else {
            return true;
        }
    });
};
module.exports = sendMail;
