const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const Imap = require('node-imap');
const inspect = require('util').inspect;
const fs = require('fs');
const { Base64Decode } = require('base64-stream')

const excelMasterHandler = require('../../handlers/excelMasterHandler');
const filesService = require('../utils/files');

const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.INFOMANIAK_HOST,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.MAIL_SENDER_INFOMANIAK,
        pass: process.env.MAIL_PASS_INFOMANIAK
    }
});

exports.sendMail = async (emailDestination, emailCopiesDestination, data, courtier, year, month) => {
    try {
        if (emailDestination !== '') {
            const excelMasters = await excelMasterHandler.getExcelMastersCourtierByYearMonth(courtier, year, month, 'zip');
            let eMFinal = [];
            for (let eMs of excelMasters) {
                const eM = {
                    attachementPath: eMs.path,
                    fileNameAttachement: filesService.getFileName(eMs.path)
                };
                if (!eMFinal.some(e => { return e.attachementPath === eM.attachementPath })) {
                    eMFinal.push(eM);
                }
            }
            if (excelMasters.length > 0) {
                ejs.renderFile(path.join(__dirname, '..', '..', 'views', 'mail.ejs'), { data: data }, async (err, str) => {
                    if (err) {
                        console.log(err);
                    } else {
                        let attachments = [];
                        for (let excelMaster of eMFinal) {
                            attachments.push({
                                filename: excelMaster.fileNameAttachement,
                                path: excelMaster.attachementPath
                            });
                        }
                        const mailOptions = {
                            from: process.env.MAIL_SENDER_INFOMANIAK,
                            to: emailDestination,
                            cc: emailCopiesDestination,
                            subject: `VOS COMMISSIONS DU MOIS`,
                            html: str,
                            bcc: process.env.MAIL_SENDER_INFOMANIAK,
                            attachments
                        };

                        transporter.sendMail(mailOptions, (err, info) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            } else {
                                console.log('Email sent: ' + info.accepted[0]);
                                return info;
                            }
                        });
                    }
                });
            }
        }
    } catch (err) {
        throw err;
    }
};

const imap = new Imap({
    user: process.env.MAIL_SENDER_INFOMANIAK,
    password: process.env.MAIL_PASS_INFOMANIAK,
    host: process.env.INFOMANIAK_HOST,
    port: 993,
    tls: true
});

const openInbox = (cb) => {
    imap.openBox('INBOX', true, cb);
}


//Fetch the 'date', 'from', 'to', 'subject'
exports.getMail = () => {
    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;
            let f = imap.seq.fetch('1:3', {
                bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                struct: true
            });
            f.on('message', (msg, seqno) => {
                console.log('Message #%d', seqno);
                const prefix = '(#' + seqno + ') ';
                msg.on('body', (stream, info) => {
                    let buffer = '';
                    stream.on('data', (chunk) => {
                        buffer += chunk.toString('utf8');
                    });
                    stream.once('end', () => {
                        console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                    });
                });
                msg.once('attributes', (attrs) => {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', () => {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', (err) => {
                console.log('Fetch error: ' + err);
            });
            f.once('end', () => {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });

    imap.once('error', (err) => {
        console.log(err);
    });

    imap.once('end', () => {
        console.log('Connection ended');
    });

    imap.connect();
}

//'from' header and buffer the entire body of the newest message
exports.getMail2 = () => {
    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;
            var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)', 'TEXT'] });
            f.on('message', (msg, seqno) => {
                console.log('Message #%d', seqno);
                var prefix = '(#' + seqno + ') ';
                msg.on('body', (stream, info) => {
                    if (info.which === 'TEXT')
                        console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                    var buffer = '', count = 0;
                    stream.on('data', (chunk) => {
                        count += chunk.length;
                        buffer += chunk.toString('utf8');
                        if (info.which === 'TEXT')
                            console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                    });
                    stream.once('end', () => {
                        if (info.which !== 'TEXT')
                            console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                        else
                            console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                    });
                });
                msg.once('attributes', (attrs) => {
                    console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                });
                msg.once('end', () => {
                    console.log(prefix + 'Finished');
                });
            });
            f.once('error', (err) => {
                console.log('Fetch error: ' + err);
            });
            f.once('end', () => {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    })

    imap.once('error', (err) => {
        console.log(err);
    });

    imap.once('end', () => {
        console.log('Connection ended');
    });

    imap.connect();
}

exports.getMail3 = () => {
    let fileStream;
    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;
            imap.search(['UNSEEN', ['SINCE', 'May 20, 2010']], (err, results) => {
                if (err) throw err;
                var f = imap.fetch(results, { bodies: '' });
                f.on('message', (msg, seqno) => {
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', (stream, info) => {
                        console.log(prefix + 'Body');
                        stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                    });
                    msg.once('attributes', (attrs) => {
                        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                    });
                    msg.once('end', () => {
                        console.log(prefix + 'Finished');
                    });
                });
                f.once('error', (err) => {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', () => {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            });
        });
    });

    imap.once('error', (err) => {
        console.log(err);
    });

    imap.once('end', () => {
        console.log('Connection ended');
    });

    imap.connect();
}

const toUpper = (thing) => { return thing && thing.toUpperCase ? thing.toUpperCase() : thing; }

const findAttachmentParts = (struct, attachments) => {
    attachments = attachments || [];
    for (var i = 0, len = struct.length, r; i < len; ++i) {
        if (Array.isArray(struct[i])) {
            findAttachmentParts(struct[i], attachments);
        } else {
            if (struct[i].disposition && ['INLINE', 'ATTACHMENT'].indexOf(toUpper(struct[i].disposition.type)) > -1) {
                attachments.push(struct[i]);
            }
        }
    }
    return attachments;
}

const buildAttMessageFunction = (attachment) => {
    var filename = attachment.params.name;
    var encoding = attachment.encoding;

    return (msg, seqno) => {
        var prefix = '(#' + seqno + ') ';
        msg.on('body', function (stream, info) {
            //Create a write stream so that we can stream the attachment to file;
            console.log(prefix + 'Streaming this attachment to file', filename, info);
            var writeStream = fs.createWriteStream(path.join(__dirname, '..', '..', 'documents', 'attachments', filename));
            writeStream.on('finish', function () {
                console.log(prefix + 'Done writing to file %s', filename);
            });

            //stream.pipe(writeStream); this would write base64 data to the file.
            //so we decode during streaming using 
            if (toUpper(encoding) === 'BASE64') {
                //the stream is base64 encoded, so here the stream is decode on the fly and piped to the write stream (file)
                stream.pipe(new Base64Decode()).pipe(writeStream);
            } else {
                //here we have none or some other decoding streamed directly to the file which renders it useless probably
                stream.pipe(writeStream);
            }
        });
        msg.once('end', function () {
            console.log(prefix + 'Finished attachment %s', filename);
        });
    };
}

exports.find = () => {
    imap.once('ready', function () {
        imap.openBox('INBOX', true, function (err, box) {
            if (err) throw err;
            imap.search(['UNSEEN', ['FROM', 'dirishony@gmail.com']], (err, results) => {
                if (err) throw err;
                let f = imap.fetch(results, { bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'], struct: true });
                f.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);
                    var prefix = '(#' + seqno + ') ';
                    msg.on('body', function (stream, info) {
                        var buffer = '';
                        stream.on('data', function (chunk) {
                            buffer += chunk.toString('utf8');
                        });
                        stream.once('end', function () {
                            console.log(prefix + 'Parsed header: %s', Imap.parseHeader(buffer));
                        });
                    });
                    msg.once('attributes', function (attrs) {
                        var attachments = findAttachmentParts(attrs.struct);
                        console.log(prefix + 'Has attachments: %d', attachments.length);
                        for (var i = 0, len = attachments.length; i < len; ++i) {
                            var attachment = attachments[i];
                            /*This is how each attachment looks like {
                                partID: '2',
                                type: 'application',
                                subtype: 'octet-stream',
                                params: { name: 'file-name.ext' },
                                id: null,
                                description: null,
                                encoding: 'BASE64',
                                size: 44952,
                                md5: null,
                                disposition: { type: 'ATTACHMENT', params: { filename: 'file-name.ext' } },
                                language: null
                              }
                            */
                            console.log(prefix + 'Fetching attachment %s', attachment.params.name);
                            var f = imap.fetch(attrs.uid, { //do not use imap.seq.fetch here
                                bodies: [attachment.partID],
                                struct: true
                            });
                            //build function to process attachment message
                            f.on('message', buildAttMessageFunction(attachment));
                        }
                    });
                    msg.once('end', function () {
                        console.log(prefix + 'Finished email');
                    });
                });
                f.once('error', function (err) {
                    console.log('Fetch error: ' + err);
                });
                f.once('end', function () {
                    console.log('Done fetching all messages!');
                    imap.end();
                });
            })
        });
    });

    imap.once('error', function (err) {
        console.log(err);
    });

    imap.once('end', function () {
        console.log('Connection ended');
    });

    imap.connect();
}
