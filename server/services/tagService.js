import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
import { replaceAll } from '../../util/StringUtility.js';
var logger = log4js.getLogger('tagService');

/**
 * Get Tags for a Post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<[]>} Returns Array of tags for a post
 */
export const getTagsForPost = (conn, postId) => {
    logger.info(`Entering tagService.getTagsForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_TAGS_FOR_POST_ID, [postId], 'fetchMultiple');
            logger.info(`Exiting tagService.getTagsForPost`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from tagService.getTagsForPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Insert tag for a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @param {String} tagName The Tag Name
 * @param {Boolean} isDeleted Check if the tag has been deleted or not
 * @returns {Promise.<[]>} Returns Array of tags for a post
 */
export const insertTagForPost = (conn, postId, tagName, isDeleted) => {
    logger.info(`Entering tagService.insertTagForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            tagName = replaceAll(tagName, "'", "''");
            let query = queryConstants.MERGE_INTO_TAGS;
            query = query.replace(`USING (VALUES (?,?,?))`,
                `USING (VALUES (${postId},'${tagName}',${isDeleted}))`);
            let data = await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting tagService.insertTagForPost`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from tagService.insertTagForPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Bulk Insert tag for a post
 * @param {Connection} conn The DB Connection Object
 * @param {[]} tags The Tags Object
 * @returns {Promise.<Boolean>} Returns true if all tags has been inserted
 */
export const bulkInsertTagsForAPost = (conn, tags) => {
    logger.info(`Entering tagService.bulkInsertTagsForAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let promises = [];
            tags.forEach(tag => {
                promises.push(insertTagForPost(conn, tag.postId, tag.tagName, tag.isDeleted));
            });
            await Promise.all(promises);
            logger.info(`Exiting tagService.bulkInsertTagsForAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from tagService.bulkInsertTagsForAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * 
 * @param {Connection} conn DB connection object
 * @param {*} postId The post id for which the tags has to be deleted
 * @returns 
 */
export const bulkDeleteTagsForAPost = (conn, postId) => {
    logger.info(`Entering tagService.bulkDELETETagsForAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.RESET_ALL_TAGS;
            await executeQuery(conn, query, [postId], 'update');
            logger.info(`Exiting tagService.bulkDELETETagsForAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from tagService.bulkDELETEtTagsForAPost ${err.message}`);
            reject(err);
        }
    });
}
/**
 * Update tag for a post
 * @param {Connection} conn The DB Connection Object
 * @param {[]} tags The Tags Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Returns true if all tags has been updated
 */
export const updateTagsForPost = (conn, tags, postId) => {
    logger.info(`Entering tagService.updateTagsForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = tags.length > 0 ? `UPDATE TAGS SET IS_DELETED = 1 WHERE POST_ID = ? AND ID NOT IN (${tags.map(tag => tag.id).join(',')})`
                : `UPDATE TAGS SET IS_DELETED = 1 AND POST_ID = ?`;
            tags.length > 0 && await executeQuery(conn, query, [postId], 'update');
            let promises = [];
            tags.forEach(tag => {
                promises.push(insertTagForPost(conn, tag.id, tag.postId, tag.tagName, tag.isDeleted));
            });
            await Promise.all(promises);
            logger.info(`Exiting tagService.updateTagsForPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from tagService.updateTagsForPost ${err.message}`);
            reject(err);
        }
    });
}
