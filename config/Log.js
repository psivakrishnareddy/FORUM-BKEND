import log4js from 'log4js';
import log4js_extend from "log4js-extend";
import path from 'path';
import {fileURLToPath} from 'url';


export class LoggerManager {
/**
 * Get Logging Object
 * @param {String} loggerCategoryName the logger cateogry name
 * @returns {log4js.Logger} The loggin dobject
 */
static getLogger = (loggerCategoryName) => {
  var loggerLevel = process.env.APP_LOGGER_LEVEL;
    const __filename = fileURLToPath(import.meta.url);
    console.info(`loggerCategoryName ${loggerCategoryName}` ,"logex", log4js_extend);
    log4js_extend(log4js, {
        path: path.dirname(__filename),
        format: " (@file:@line:@column)"
    });
    if (!loggerLevel) {
        loggerLevel = 'trace';
    }
    let appenderList = ['console'];
    let appenders= {};
    appenderList.forEach((appenderKey) => {
    appenders[appenderKey] = { type: 'console' };
    });
    log4js.configure({
        appenders,
        replaceConsole: true,
        categories: {
          default: {
            appenders: appenderList ,
            level: loggerLevel
          }
        }
    });
    return log4js.getLogger(loggerCategoryName);
  }
}

