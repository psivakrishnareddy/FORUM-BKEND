import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
var logger = log4js.getLogger('commentService');
import { getCurrentDateTime } from '../../util/DateTimeUtility.js';
import { replaceAll } from '../../util/StringUtility.js';

/**
 * Get all comments for a post
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The User Id
 * @param {Number} postId The Post Id
 * @returns {Promise.<[]|null>} Category Object with Category Name
 */
export const getAllCommentsForAPost = (conn, userId, postId) => {
    logger.info(`Entering commentService.getAllCommentsForAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_ALL_COMMENTS_FOR_POST_ID, [userId, postId], 'fetchMultiple');
            logger.info(`Exiting commentService.getAllCommentsForAPost`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from commentService.getAllCommentsForAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Add A comment for a post
 * @param {Connection} conn DB Connection Object
 * @param {Number} postId The Post Id
 * @param {String} description The comment description
 * @param {Number} userId The User Id
 * @returns {Promise.<Boolean>} Inserting a Comment for a Post
 */
export const addCommentForAPost = (conn, postId, description, userId) => {
    logger.info(`Entering commentService.addCommentForAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            description = replaceAll(description, "'", "''");
            let query = queryConstants.INSERT_INTO_COMMENT;
            query = query.replace(`(?, ?, CAST(? AS BLOB), ?, ?)`, 
                `(${userId}, ${postId}, CAST('${description}' AS BLOB), 0, '${getCurrentDateTime()}')`);
            await executeQuery(conn, query, [], 'insert');
            logger.info(`Exiting commentService.addCommentForAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from commentService.addCommentForAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Updates comments for a POST based on comment id
 * @param {Connection} conn DB connection object
 * @param {Number} postId The post id whose comment has to be updated
 * @param {Number} commentId The comment id which has to be updated in a post
 * @param {String} description The comment description
 * @returns 
 */
export const updateCommentForAPost = (conn, postId, commentId, description) => {
    logger.info(`Entering commentService.updateCommentForAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            description = replaceAll(description, "'", "''");
            let query = queryConstants.UPDATE_INTO_COMMENT;
            query = query.replace(`CAST(? AS BLOB) WHERE POST_ID = ? AND ID = ?`, `CAST('${description}' AS BLOB) WHERE POST_ID = ${postId} AND ID = ${commentId}`);
            await executeQuery(conn, query, [], 'update');
            logger.info(`Exiting commentService.updateCommentForAPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from commentService.updateCommentForAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * 
 * @param {Connection} conn The DB Connection Object
 * @param {Number} commentId The Comment Id
 * @param {Number} postId The Post Id
 * @returns 
 */
 export const deleteComment = (conn,commentId, postId) => {
    logger.info(`Entering postService.deleteComment`);
    return new Promise(async (resolve, reject) => {
        try {
            logger.info(commentId, postId);
            await executeQuery(conn, queryConstants.DELETE_COMMENT_FOR_POST_BY_ID, [commentId,postId], 'update');
            logger.info(`Exiting postService.deleteComment`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postService.deleteComment ${err.message}`);
            reject(err);
        }
    });
}


/**
 * Save feedback for a comment
 * @param {Connection} conn DB Connection Object
 * @param {Number|Null} id The Id of the Answer feedback table
 * @param {Number} userid The User Id
 * @param {Number} commentId The Comment Id for which the feedback is provided
 * @param {Boolean} isUseful If the Feedback is useful or not (true / false)
 * @param {String} feedback The Feedback String
 * @returns {Promise.<Boolean>} Inserting a Feedback for a comment
 */
export const saveAnswerFeedback = (conn, id, userId, commentId, isUseful, feedback) => {
    logger.info(`Entering commentService.saveAnswerFeedback`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            feedback = replaceAll(feedback, "'", "''");
            let query = queryConstants.MERGE_INTO_ANSWERS_FEEDBACK;
            query = query.replace(`USING (VALUES(?,?,?,?,?))`, 
                `USING (VALUES(${id},${userId},${commentId},${isUseful},'${feedback}'))`);
            await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting commentService.saveAnswerFeedback`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from commentService.saveAnswerFeedback ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Save feedback for a comment
 * @param {Connection} conn DB Connection Object
 * @param {Number} commentId The Comment Id for which the feedback is provided
 * @returns {Promise.<[]|null>} Feedbacks for a comment
 */
export const getFeedbackForComment = (conn, commentId) => {
    logger.info(`Entering commentService.getFeedbackForComment`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_COMMENT_FEEDBACK_USING_COMMENT_ID, [commentId], 'fetchMultiple');
            logger.info(`Exiting commentService.getFeedbackForComment`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from commentService.getFeedbackForComment ${err.message}`);
            reject(err);
        }
    });
}