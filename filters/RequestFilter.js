import log4js from 'log4js';
var logger = log4js.getLogger('RequestFilter');
import * as schema from '../config/schema.js';
import jwt from 'jsonwebtoken';
const {verify} = jwt;
import { getUserRole } from '../util/TokenUtility.js';
// import { allowedRoutes } from "../../cov.sbsd.dashboard.forum.services/routes/allowedRoutes.js";
const secretKeyForFileUpload = (typeof process.env.JWT_TOKEN_SECRET_KEY_FOR_UPLOAD == "undefined") ? schema.tokenKeys.jwtTokenSecretKeyForUpload : process.env.JWT_TOKEN_SECRET_KEY_FOR_UPLOAD;
export const AuthenticateRoles = function(req, res, callback) {
        try {
            var authorizationToken = req.get('authorization');
            logger.info(`Request URL: ${req.url}`);
            logger.debug("api hit successfull")
            logger.debug(req.get('host'));
            if (!authorizationToken)  throw new Error("No Authorization token found");
            let tokenRole = getUserRole(authorizationToken);
            // let roles = allowedRoutes[req.url];
            let isCurrentRoleAllowed = roles && roles.length > 0;
            isCurrentRoleAllowed = roles && roles.some(role => tokenRole == role);
            if(!isCurrentRoleAllowed) throw new Error(`Unauthorized Access`);
            logger.info(`Request URL: ${req.url} hit successfull`);
            callback();
        } catch (err) {
            logger.error(`Error from RequestFiler.AuthenticateRoles ${err.message}`);
            res.status(401).send(`Unauthorized Access`);
        }
}

export var CronAuthenticate = function(req, res, callback) {
    try {
      var authorizationToken = req.get('authorization');
      logger.debug(req.url);
      logger.debug("api hit successfull");
      if (!authorizationToken)  throw new Error("No Authorization token found");
      let decodedToken = verify(authorizationToken, secretKeyForFileUpload);
      if(decodedToken.iat) callback();
      else throw new Error("Unauthorized cron");
    } catch (err) {
      logger.error(err.message);
      res.status(401).send({Error: err.message, Status: "Unauthorized"});
    }
  }
