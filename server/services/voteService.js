import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
var logger = log4js.getLogger('voteService');

/**
 * Get Vote Count data for a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Number>} Returns Vote Count for a Post
 */
export const getVoteCountForPost = (conn, postId) => {
    logger.info(`Entering voteService.getVoteCountForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_VOTE_COUNT_FOR_POST_ID, [postId], 'fetchSingle');
            logger.info(`Exiting voteService.getVoteCountForPost`);
            resolve((data && data.VOTE_COUNT) || 0);
        } catch (err) {
            logger.error(`Error from voteService.getVoteCountForPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Check if user has voted a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The user Id
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Returns true if user has voted for the post
 */
export const checkIsVoted = (conn, userId, postId) => {
    logger.info(`Entering voteService.checkIsVoted`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.CHECK_IS_VOTED, [userId, postId], 'fetchMultiple');
            logger.info(`Exiting voteService.checkIsVoted`);
            resolve(data == null ? false : data.length > 0);
        } catch (err) {
            logger.error(`Error from voteService.checkIsVoted ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Vote for a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The user Id
 * @param {Number} postId The Post Id
 * @param {String} createdAt the time at which the like is posted
 * @returns {Promise.<Boolean>} Returns true if user has voted for the post
 */
export const voteForPost = (conn, userId, postId, createdAt) => {
    logger.info(`Entering voteService.voteForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.VOTE_POST;
            query = query.replace(` (VALUES (?, ?, ?)) `,
                ` (VALUES (${userId}, ${postId}, '${createdAt}')) `)
            await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting voteService.voteForPost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from voteService.voteForPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * UnVote for a post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The user Id
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Returns false if user has unvoted for the post
 */
export const unvoteForPost = (conn, userId, postId) => {
    logger.info(`Entering voteService.unvoteForPost`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UNVOTE_POST, [userId, postId], 'delete');
            logger.info(`Exiting voteService.unvoteForPost`);
            resolve(false);
        } catch (err) {
            logger.error(`Error from voteService.unvoteForPost ${err.message}`);
            reject(err);
        }
    });
}