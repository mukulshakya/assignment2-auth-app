let nodemailer = require("nodemailer");

 // create mail transporter
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mukulnodemailer@gmail.com",
        pass: "mukul@1234" 
    }
});


let mailFunc = (data) => {
    let mailOptions = {
        from: "mukulnodemailer@gmail.com",
        to: data.email,
        subject: data.subject,
        html: `<div style="color: black">
                    <b>${data.mailbody}</b><br/>
                    <b>Date : </b>${new Date().toDateString()}<br/>
                    <b>Time : </b>${new Date().toTimeString()}
                </div>`,
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email!');
        } else {
            console.log("Email successfully sent!");
        }
    });
}

module.exports = {mailFunc};