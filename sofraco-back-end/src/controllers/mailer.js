const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

const config = require('../../config.json');

exports.postMail = (req, res) => {
    console.log('post mail');
    const user = req.body.user;
    const emailDestination = user.email;
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        // smtp-mail.outlook.com
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: config.mailSender,
            pass: config.mailPass
        }
    });

    const data = {
        firstName: user.firstName,
        lastName: user.lastName
    }
    ejs.renderFile(path.join(__dirname, '..', 'views', 'mail.ejs'), {data: data}, (err, str) => {
        if (err) {
            console.log(err);
        } else {
            const mailOptions = {
                from: config.mailSender,
                to: emailDestination,
                subject: 'Send mail test',
                html: str,
                attachments: [
                    {
                        filename: path.join(__dirname, '..', '..', 'files', 'mon_fichier.xlsx'),
                    }
                ]
            };
        
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    console.log('Email sent: ' + info.accepted);
                    res.send(info);
                }
            });
        }
    });
};