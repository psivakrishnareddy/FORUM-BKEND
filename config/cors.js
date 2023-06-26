import cors from 'cors';
import express from 'express';
import log4js from 'log4js';
var logger = log4js.getLogger('cors');

/**
 * Configuration of the Cors
 * @param {express.Express} app The Express application
 * @return {cors.CorsRequest} cors request along with cors options
 */
export const configureCors = (app) => {
    var whitelist = ['https://sbsd-dashboard-forum-ui-dev.sbsd-va.net', 'https://sbsd-dashboard-forum-ui-dev.sbsd-va.net/', //dev
      'https://sbsd-dashboard-forum-ui-qa.sbsd-va.net', 'https://sbsd-dashboard-forum-ui-qa.sbsd-va.net/',//qa
      'https://sbsd-dashboard-forum-ui-uat.sbsd-va.net', 'https://sbsd-dashboard-forum-ui-uat.sbsd-va.net/', // uat
      'https://dashboard-forum.sbsd.virginia.gov', 'https://dashboard-forum.sbsd.virginia.gov/', //production
      'http://localhost:4200', 'http://localhost:4200/','http://localhost',
      'http://localhost:3000', 'http://localhost:3000/','http://localhost']
    var corsOptions = {
      origin: function (origin, callback) {
        logger.info(`Incoming Cors Request from origin: `, origin);
        if (whitelist.indexOf(origin) >= 0) {
          callback(null,  { origin: true })
        } else {
          callback(null,  { origin: false })
        }
      },
      methods: "GET,POST,OPTIONS,PUT,PATCH,DELETE"
    }
    return cors(corsOptions);
}