import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
var logger = log4js.getLogger('statusService');

/**
 * Get All Status and Count Data
 * @param {Connection} conn The DB Connection Object
 * @returns {Promise.<[]>} Return All Status and Count Data
 */
export const getStatusCountData = (conn) => {
    logger.info(`Entering statusService.getStatusCountData`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_STATUS_COUNT_DATA, [], 'fetchMultiple');
            logger.info(`Exiting statusService.getStatusCountData`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from statusService.getStatusCountData ${err.message}`);
            reject(err);
        }
    });
}

/**
 * 
 * @param {Connection} conn The DB Connection object
 * @param {*} categoryId The category id on which the data has to be fetched
 * @returns {Promise.<[]>} Return All Status and Count Data based on category
 */
export const getStatusCountDataByCategory = (conn, categoryId) => {
    logger.info(`Entering statusService.getStatusCountDataByCategory`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_STATUS_COUNT_DATA_BY_CATEGORY, [categoryId, categoryId], 'fetchMultiple');
            logger.info(`Exiting statusService.getStatusCountDataByCategory`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from statusService.getStatusCountDataByCategory ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get Status data for specific status id
 * @param {Connection} conn The DB Connection Object
 * @param {Number} statusId The Status Id
 * @returns {Promise.<{}>} Return Status data for specific status id
 */
export const getStatusData = (conn, statusId) => {
    logger.info(`Entering statusService.getStatusData`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_STATUS_DATA_USING_ID, [statusId], 'fetchSingle');
            logger.info(`Exiting statusService.getStatusData`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from statusService.getStatusData ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get Status data for specific status id
 * @param {Connection} conn The DB Connection Object
 * @param {String} statusName The Status Name
 * @returns {Promise.<{}>} Return Status data for specific status id
 */
export const getStatusDataByName = (conn, statusName) => {
    logger.info(`Entering statusService.getStatusDataByName`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_STATUS_DATA_USING_NAME, [statusName], 'fetchSingle');
            logger.info(`Exiting statusService.getStatusDataByName`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from statusService.getStatusDataByName ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Add a New ticket status
 * @param {Connection} conn The DB Connection Object
 * @param {String} statusName The Status Name
 * @returns {Promise.<Boolean>} Returns true if status had been added
 */
export const addNewTicketStatus = (conn, statusName) => {
    logger.info(`Entering statusService.addNewTicketStatus`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.INSERT_STATUS, [statusName], 'insert');
            logger.info(`Exiting statusService.addNewTicketStatus`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from statusService.addNewTicketStatus ${err.message}`);
            reject(err);
        }
    });
}
