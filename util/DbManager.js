import * as db from '../config/db.js';
import log4js from 'log4js';
import { IConnection } from '../interfaces/database.js';
import { replaceAll } from './StringUtility.js';
import { v4 as uuidv4 } from 'uuid'
var logger = log4js.getLogger('DbManager');

let connection = null;

export const testDbConnection = async () => {
    logger.info(`Testing DB Connection`);
    let connection = null;
    try {
        connection = await getDbConnection();
        logger.info(`DB Connection Open: PASSED`);
        logger.info(`Trying to connect to a table: USERINAGENCY`);
        let query = `SELECT * FROM USERINAGENCY LIMIT 1`;
        await executeQuery(connection, query, [], 'fetchSingle');
        logger.info(`Fetching Data from USERINAGENCY table: SUCCESS`);
        logger.info(`DB Connection Test: PASSED`);
    } catch (err) {
        logger.error(`DB Connection Test: FAILED\n Error Details: `, err.message);
    } finally {
        connection && await closeConnection(connection);
    }
}

/**
 * Return a DB Connection Object
 * @returns {Promise.<IConnection>} the Connection Object
 */
export const getDbConnection = async () => {
    return new Promise((resolve, reject) => {
        logger.info(`Entering DbManager: getDbConnection`);
        try {
            if(!connection) {
                db.openConnection(async function (err, conn) {
                    if (err) {
                        logger.error(`Error from DbManager: getDbConnection`);
                        reject(err);
                    } else {
                        connection = conn;
                        logger.info(`Exiting DbManager: getDbConnection`);
                        resolve(conn);
                    }
                });
            } else 
                resolve(connection);
        } catch (err) {
            logger.error(`Error from DbManager: getDbConnection`, err.message);
            logger.info(`Exiting DbManager: getDbConnection`);
            reject(err);
        }
    });
}

/**
 * Returns a Transaction Initiated DB Connection
 * @param {IConnection} conn The Connection Object
 * @returns {Promise.<IConnection>} the transaction initiated connection Object
 */
export const beginTransaction = async (conn)=> {
    logger.info("Entering DbManager: beginTransaction");
    return new Promise((resolve, reject) => {
        try {
            conn.beginTransaction(async function (err) {
                if (err) {
                    throw new Error(err);
                } else {
                    logger.info("Exiting DbManager: beginTransaction");
                    resolve(conn);
                }
            });
        } catch (err) {
            logger.error("Error from DbManager: beginTransaction", err.message);
            logger.info("Exiting DbManager: beginTransaction");
            reject(err);
        }
    });
}

/**
 * Returns a Comitted Transaction DB Connection
 * @param {IConnection} conn The Connection Object
 * @returns {Promise.<IConnection>} the transaction comitted connection Object
 */
export const commitTransaction = async (conn) => {
    logger.info("Entering DbManager: commitTransaction");
    return new Promise(async (resolve, reject) => {
        try {
            conn.commitTransaction(function() {
                logger.info("Exiting DbManager: commitTransaction");
                resolve(conn);
            });
        } catch (err) {
            logger.error("Error from DbManager: commitTransaction", err.message);
            try {
                await rollbackTransaction(conn);
            } catch (ex) {}
            logger.info("Exiting DbManager: commitTransaction");
            reject(err);
        }
    });
}

/**
 * Returns a rollbacked Transaction DB Connection
 * @param {IConnection} conn The Connection Object
 * @returns {Promise.<IConnection>} the transaction rollbacked connection Object
 */
export const rollbackTransaction = async (conn) => {
    logger.info("Entering DbManager: rollbackTransaction");
    return new Promise((resolve, reject) => {
        try {
            conn.rollbackTransaction(function (rollbackErr) {
                if(rollbackErr)
                    throw new Error(rollbackErr);
                else {
                    logger.info("Exiting DbManager: rollbackTransaction");
                    resolve(conn);
                }
            });
        } catch (err) {
            logger.error("Error from DbManager: rollbackTransaction", err.message);
            logger.info("Exiting DbManager: rollbackTransaction");
            reject(err);
        }
    });
}

/**
 * Closes a DB Connection
 * @param {IConnection} conn The Connection Object
 * @returns {Promise.<Boolean>} Returns true if the connections are closed successfully
 */
export const closeConnection = async (conn) => {
    logger.info("Entering DbManager: closeConnection");
    return new Promise((resolve, reject) => {
        try {
            conn && conn.close(function() {
                logger.info("conn closed");
            });
            connection && connection.close(function() {
                logger.info("connection closed");
            })
            connection = null;
            logger.info("Exiting DbManager: closeConnection");
            resolve(true);
        } catch (err) {
            logger.error("Error from DbManager: closeConnection", err.message);
            logger.info("Exiting DbManager: closeConnection");
            reject(err);
        }
    });
}

/**
 * Executes a Query from Database
 * @param {IConnection} conn The Connection Object
 * @param {String} query The query to be ran in Database
 * @param {any[]} queryParams An ayyar of parameters for the query
 * @param {'fetchSingle'|'fetchMultiple'|'merge'|'insert'|'delete'|'select'|'update'} queryType Type of the query that is to be ran
 * @returns {Promise.<{}|[]>} Returns data from the database
 */
export const executeQuery = async (conn, query, queryParams, queryType) => {
    logger.info("Entry Method: dbManager.executeQuery");
    let query2 = query
    queryParams.forEach(param => {
        param = replaceAll(param, "'", "''");
        query2 = query2.replace('?', `'${param}'`)
    });
    
    logger.info(`QueryType: ${queryType}`);
    let queryId = uuidv4();
    logger.info(`\u001b[4;34m[${queryId}]\u001b[0m Query: ${query2}`);
    let timer = Date.now();
    return new Promise((resolve, reject) => {
      try {
        conn.query(query, queryParams, function(err, result){
        logger.info(`\u001b[4;34m[${queryId}]\u001b[0m Query Execution Time: ${(Date.now() - timer)/1000} seconds`);
          if (err) reject(err);
          else {
            logger.info("Is Result Available for "+ queryType + " : "  + (typeof result != "undefined" && result.length>0));
            if (queryType=='fetchSingle') {
              logger.info("Exit Method :dbManager.executeQuery");
              if (typeof result != "undefined" && result.length>0){
                resolve(result[0]);
              }else{
                resolve(null);
              }
            } else if(queryType=='fetchMultiple') {
              logger.trace("Exit Method :dbManager.executeQuery");
              if(typeof result != "undefined"){
                resolve(result);
              }else{
                resolve(null);
              }
            } else {
              logger.trace("Exit Method :dbManager.executeQuery");
              resolve(null);
            }
          }
        });
      } catch (err) {
        logger.error("Error from dbManager.executeQuery", err.message);
        logger.info("Exiting Method :dbManager.executeQuery");
        reject(err);
      }
    });
}