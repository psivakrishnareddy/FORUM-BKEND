import log4js from 'log4js';
import log4js_extend from "log4js-extend";
import path from 'path';
import {fileURLToPath} from 'url';
import compression from 'compression';
import express from 'express';
import cfenv from 'cfenv';
import { ConfigureRoute } from './routes/route.js';
import { configureCors } from './config/cors.js';
import { ErrorHandler } from './handlers/ErrorHandler.js';
import { testDbConnection } from './util/DbManager.js';

var loggerLevel = process.env.APP_LOGGER_LEVEL;
    const __filename = fileURLToPath(import.meta.url);
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
var logger = log4js.getLogger('server');



var appEnv = cfenv.getAppEnv();
var app = express();
// app.use(configureCors(app));
app.use(compression());
app.use(express.json({ limit: '5mb', extended: true }));
app.enable('trust proxy');

ConfigureRoute(app);
app.get('/*', function (req, res) {
    logger.trace('Unknown path - redirect');
    res.redirect('/');
});
app.use(ErrorHandler);
process.on('unhandledRejection', (reason, p) => {
    logger.error(`Unhandled Rejection at Promise`, `Reason:`, reason);
}).on('uncaughtException', err => {
    logger.error(`Uncaught Exception thrown`, err);
    process.exit(1);
});
app.listen(appEnv.port, '0.0.0.0', async function() {
    logger.info(`Server Starting on `, appEnv.url);
    await testDbConnection();
});
export default app;






