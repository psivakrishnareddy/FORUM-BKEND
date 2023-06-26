import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
import { replaceAll } from '../../util/StringUtility.js';
var logger = log4js.getLogger('savedPostService');

/**
 * Get Bookmark Data for a user and post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @param {Number} userId The User Id
 * @returns {Promise.<{}>} Return Bookmark data of the user and post
 */
export const getBookmarkForUserAndPost = (conn, userId, postId) => {
    logger.info(`Entering savedPostService.getBookmarkForUserAndPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.CHECK_SAVED_POST_FOR_USER, [userId, postId], 'fetchSingle');
            logger.info(`Exiting savedPostService.getBookmarkForUserAndPost`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from savedPostService.getBookmarkForUserAndPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Bookmark a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @param {Number} userId The User Id
 * @param {String} savedAt The time at which the post is bookmarked
 * @returns {Promise.<Boolean>} Return true if bookmark is successful
 */
export const bookmarkAPost = (conn, userId, postId, savedAt) => {
    logger.info(`Entering savedPostService.bookmarkAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.MERGE_INTO_SAVED_POSTS;
            query = query.replace(`USING (VALUES (?,?,?,?)) `, `USING (VALUES (${postId},${userId},${false},'${savedAt}'))`);
            await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting savedPostService.bookmarkAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from savedPostService.bookmarkAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * UnBookmark a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @param {Number} userId The User Id
 * @param {String} savedAt The time at which the post is unbookmarked
 * @returns {Promise.<Boolean>} Return false if unbookmark is successful
 */
export const unbookmarkAPost = (conn, userId, postId, savedAt) => {
    logger.info(`Entering savedPostService.unbookmarkAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.MERGE_INTO_SAVED_POSTS;
            query = query.replace(`USING (VALUES (?,?,?,?)) `, `USING (VALUES (${postId},${userId},${true},'${savedAt}')) `);
            await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting savedPostService.unbookmarkAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from savedPostService.unbookmarkAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get User Saved Discussions
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The User Id
 * @param {String} sort The Sort
 * @param {Number} limit The limit of query
 * @param {Number} offset The offset of a query
 * @param {String} text The text for searching
 * @returns {Promise.<Boolean>} Return true if bookmark is successful
 */
export const getUserSavedDiscussions = (conn, userId, sort, limit, offset, text) => {
    logger.info(`Entering savedPostService.getUserSavedDiscussions`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            text = replaceAll(text, "'", "''");
            let query = queryConstants.GET_USER_SAVED_DISCUSSIONS;
            let queryParams = [userId, userId];
            if( text != null && text.trim() != '' ) {
                query += ` AND (TRIM(LOWER(NVL(TV.TAGS,''))) LIKE ? OR TRIM(LOWER(PO.TITLE)) LIKE ? OR TRIM(LOWER(CA.NAME)) LIKE ?) `;
                queryParams.push(`%${text.trim().toLowerCase()}%`, `%${text.trim().toLowerCase()}%`, `%${text.trim().toLowerCase()}%`)
            }
            query += ` ORDER BY SP.SAVED_AT ${sort.trim().toLowerCase() == 'recent' ? ' DESC ' : ' ASC '},ID ${sort.trim().toLowerCase() == 'recent' ? ' DESC ' : ' ASC '} LIMIT ? OFFSET ? `;
            queryParams.push(limit, offset);
            let data = await executeQuery(conn, query, queryParams, 'fetchMultiple');
            logger.info(`Exiting savedPostService.getUserSavedDiscussions`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from savedPostService.getUserSavedDiscussions ${err.message}`);
            reject(err);
        }
    });
}