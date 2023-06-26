import { UnauthorizedError } from '../errors/UnauthorizedError.js';

/**
 * Get User Eamil From Token
 * @param {String} token The Authorization Token
 * @returns {String|Null} Returns email from the decoded authorization token
 * @throws {UnauthorizedError} UnauthorizedError
 */
export const getUserEmail = (token) => {
    if (token == 'undefined' || !token || token.trim().length == 0) throw new UnauthorizedError(`Missing Authorization Token`);
    var tokenString = String(token);
    var tokenArray = tokenString.split(".");
    if(tokenArray[2]){
      var salt = tokenArray[2].split(";");
      tokenArray[2] = salt[0];
    }
    tokenArray[1] = JSON.parse(new Buffer(tokenArray[1], 'base64').toString('ascii'));
    if(tokenArray[1].exp == null || (new Date(tokenArray[1].exp*1000) <= new Date())) {
      throw new UnauthorizedError(`Invalid Authorization Token`);
    }
    return tokenArray[1][Object.keys(tokenArray[1]).find(key => key.includes('email'))] || null
}

/**
 * Get User role From Token
 * @param {String} token The Authorization Token
 * @returns {String|Null} Returns Role from the decoded authorization token
 * @throws {UnauthorizedError} UnauthorizedError
 */
export const getUserRole = (token) => {
  if (token == 'undefined' || !token || token.trim().length == 0) throw new UnauthorizedError(`Missing Authorization Token`);
  var tokenString = String(token);
  var tokenArray = tokenString.split(".");
  if(tokenArray[2]){
    var salt = tokenArray[2].split(";");
    tokenArray[2] = salt[0];
  }
  tokenArray[1] = JSON.parse(new Buffer(tokenArray[1], 'base64').toString('ascii'));
  if(tokenArray[1].exp == null || (new Date(tokenArray[1].exp*1000) <= new Date())) {
    throw new UnauthorizedError(`Invalid Authorization Token`);
  }
  return tokenArray[1][Object.keys(tokenArray[1]).find(key => key.includes('role'))] || null
  // return tokenArray[1];
}