'use strict';

const {createLogger, format/*, transports*/} = require('winston'),
    moment = require('moment'),
    util = require('util'),
    DailyRotateFile = require('winston-daily-rotate-file'),
    config = require('config');

const timezone = config.timezone;

let timestamp = function(info) {
    return moment().utcOffset(timezone).format();
};

const myLogFormat = format.printf(({ level, message, label, timestamp }) => {
    if (typeof message === 'string') {
        return `${timestamp} - ${message}`;
    } else if (typeof message === 'object') {
        return `${timestamp} - ${util.inspect(message, {compact : true, depth : 5, breakLength : Infinity})}`;
    }
});

let webLogStream = {
    write: function(message, encoding) {
        webLog.info(message);
    }
};

let webLog = createLogger({
    level : config.webLog.level,
    format: format.combine(
        format.timestamp({format : timestamp}),
        myLogFormat,
    ),
    transports: [
        //new (winston.transports.Console)({level : config.log.level}),
        new DailyRotateFile(config.webLog)
    ]
});

let errLog = createLogger({
    level : config.errLog.level,
    format: format.combine(
        format.timestamp({format : timestamp}),
        myLogFormat,
    ),
    transports: [
        new DailyRotateFile(config.errLog)
    ]
});

let eosErrLog = createLogger({
    level : config.eosErrLog.level,
    format: format.combine(
        format.timestamp({format : timestamp}),
        myLogFormat,
    ),
    transports: [
        new DailyRotateFile(config.eosErrLog)
    ]
});

const Logs =  {
    webLogStream : webLogStream,
    webLog : webLog,
    errLog : errLog,
    eosErrLog : eosErrLog,
};

module.exports = exports = Logs;
