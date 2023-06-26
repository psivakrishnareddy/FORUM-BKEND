import * as ibmdb from 'ibm_db';
import log4js from 'log4js';
var logger = log4js.getLogger('database');
var pool = new ibmdb.Pool({idleTimeout: 5000, autoCleanIdle: true});
var dbName = process.env.DB;
var hostName = process.env.DB_HOSTNAME;
var userName = process.env.DB_USERNAME;
var password = process.env.DB_PASSWORD;
var port = process.env.DB_PORT;
var schema = process.env.DB_SCHEMA;
var poolSize = process.env.DB_POOL_SIZE;
var connectionTimeOut = process.env.DB_CONNECTION_TIMEOUT;
var ibmdbLogs = process.env.IBM_DB_DEBUG_LOGS;
let initialPoolSize = process.env.DB_INITIAL_POOL_SIZE;
if(typeof ibmdbLogs !== "undefined"){
  if(ibmdbLogs =='false'){
    ibmdbLogs = false;
  }else{
    ibmdbLogs = true;
  }
}else{
  ibmdbLogs = false;
}
ibmdb.debug(ibmdbLogs);  // Enable console logs.
if(!poolSize){
  poolSize = 20;
}
if(!connectionTimeOut){
  connectionTimeOut = 50;
}
if (!initialPoolSize) {
  initialPoolSize = 25;
}
pool.setConnectTimeout(connectionTimeOut);
pool.setMaxPoolSize(poolSize);
var connString = 'dsn=certappDB';
pool.init(initialPoolSize, connString); // Initialize pool with n no of connections.
var conn;

export const openConnection = (callback) => {
    try{
      logger.info(`Connection String: ${connString.substring(0, connString.indexOf(";PWD")) + connString.substring(connString.indexOf(";PORT"), connString.length)}`);
      logger.info(`Database Name: ${dbName}
  Host: ${hostName}
  User: ${userName}
  Password: ******
  Port: ${port}
  Schema: ${schema}`);
      pool.open(connString, function (error , connection) {
          if (error){
            callback(error,null);
          } else{
            logger.trace("connection : pool opened",pool.availablePool[connString.split('PROTOCOL')[0]].length);
            callback(null,connection);
          }
      });
    }catch(error){
      callback(error,null);
    }
  }