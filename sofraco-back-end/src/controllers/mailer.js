const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

const config = require('../../config.json');

const transporter = nodemailer.createTransport({
    pool: true,
    host: config.infomaniakHost,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.mailSenderInfomaniak,
        pass: config.mailPassInfomaniak
    }
});

exports.postMail = (req, res) => {
    console.log('post mail');
    const user = req.body.user;
    const emailDestination = user.email;

    const data = {
        firstName: user.firstName,
        lastName: user.lastName
    }
    ejs.renderFile(path.join(__dirname, '..', 'views', 'mail.ejs'), {data: data}, (err, str) => {
        if (err) {
            console.log(err);
        } else {
            const mailOptions = {
                from: config.mailSenderInfomaniak,
                to: emailDestination,
                subject: 'Send mail test',
                html: str,
                attachments: [
                    {
                        filename: path.join(__dirname, '..', '..', 'documents', 'masterExcel', 'Commissions5121.xlsx'),
                    }
                ]
            };
        
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    console.log('Email sent: ' + info.accepted);
                    res.send(info);
                }
            });
        }
    });
};