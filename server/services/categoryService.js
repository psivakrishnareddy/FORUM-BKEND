import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
var logger = log4js.getLogger('categoryService');

/**
 * Get the Category Data and respective count of records
 * @param {Connection} conn DB Connection Object
 * @returns {Promise.<Number|null>} Category Data and respective count of records
 */
export const getCategoryCount = async (conn) => {
    logger.info(`Entering categoryService.getCategoryCount`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_CATEGORY_COUNT, [], 'fetchMultiple');
            logger.info(`Exiting categoryService.getCategoryCount`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from categoryService.getCategoryCount ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get the Category Data Object for the category Id
 * @param {Connection} conn DB Connection Object
 * @param {Number} categoryId The Category Id
 * @returns {Promise.<{}|null>} Category Object with Category ID
 */
export const getCategoryData = (conn, categoryId) => {
    logger.info(`Entering categoryService.getCategoryData`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_CATEGORY_DATA_USING_ID, [categoryId], 'fetchSingle');
            logger.info(`Exiting categoryService.getCategoryData`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from categoryService.getCategoryData ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get the Category Data Object for the category Name
 * @param {Connection} conn DB Connection Object
 * @param {String} categoryName The Category Name
 * @returns {Promise.<{}|null>} Category Object with Category Name
 */
export const getCategoryDataUsingName = (conn, categoryName) => {
    logger.info(`Entering categoryService.getCategoryDataUsingName`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_CATEGORY_DATA_USING_NAME, [categoryName], 'fetchSingle');
            logger.info(`Exiting categoryService.getCategoryDataUsingName`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from categoryService.getCategoryDataUsingName ${err.message}`);
            reject(err);
        }
    });
}