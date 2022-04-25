const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, printf } = format;
const path = require('path');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const currentDate = new Date();
const day = currentDate.getDay();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();
require('winston-daily-rotate-file');

exports.logger = winston.createLogger({
    level: 'info',
    format: combine(
        label({ label: 'SOFRACO' }),
        timestamp(),
        myFormat
    ),
    exitOnError: false,
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'infos', `info_${day}_${month}_${year}.log`), level: 'info' }),
        new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'warnings', `warning_${day}_${month}_${year}.log`), level: 'warning' }),
        new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'errors', `error_${day}_${month}_${year}.log`), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, '..', '..', 'logs', 'all', `all_${day}_${month}_${year}.log`) }),
        new winston.transports.Console()
        // new winston.transports.DailyRotateFile({
        //     filename: path.join(__dirname, '..', '..', 'logs', 'all', `log_file_%DATE%.log`),
        //     datePattern: 'DD-MM-YYYY',
        //     json: false,
        //     zippedArchive: true,
        //     maxFiles: 7
        // }),
    ],
});
