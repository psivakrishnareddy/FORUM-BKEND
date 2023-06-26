import log4js from 'log4js';
var logger = log4js.getLogger('DbManager');
var url = process.env.JAVA_HOST_ENDPOINT;
import request from 'request';
import * as schema from '../../config/schema.js';
const secretKeyForFileUpload = (typeof process.env.JWT_TOKEN_SECRET_KEY_FOR_UPLOAD == "undefined") ? schema.tokenKeys.jwtTokenSecretKeyForUpload : process.env.JWT_TOKEN_SECRET_KEY_FOR_UPLOAD;
import jwt from 'jsonwebtoken';
const {sign} = jwt;
//to fetch the user, agency and userinagency details from the dashboard
 export const getDashboardData = async (token) => {
  logger.info("ENTRY : getData from Dashboard");
    return new Promise(async (resolve, reject) => {
      try {
        // let token = sign({ "iss": "sbsd.virginia.gov","name": "SBSD Lower Env"}, secretKeyForFileUpload, { algorithm: 'HS256' },{ expiresIn: 60 * 60 });
        if(!url){
          url = "http://localhost:8080/"
        }
        let connURL = url + "v1/users/getDataForForum";        
        var headers = {
          'content-type': 'application/json',
          'Authorization': token
      };
      request.get({url:connURL,formData: "",headers:headers}, function optionalCallback(err, httpResponse, body) {
          if (err) {
              logger.error("ERROR: Error occured on migrating data", err);
              callback(err,null);
          }else{
            try {
              if(httpResponse.statusCode == '200'){
                var obj = JSON.parse(body);
                logger.trace("EXIT: Data Migration successful");
                resolve(obj);
            }else{
                let err = {};
                err.message = "Unauthorized user. Access is forbidden";
                logger.error("ERROR: Error occured on migrating data", body);
                reject(err);
            }
            }
            catch(err){
              logger.error("ERROR : getData from Dashboard", err);
              reject(err);
            }
             
          }
      });
      }
      catch(err){
          logger.error("ERROR : getData from Dashboard", err);
          reject(err);
      }
  }); 
   
}
