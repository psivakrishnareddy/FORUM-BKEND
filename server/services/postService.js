import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
import { replaceAll } from '../../util/StringUtility.js';
var logger = log4js.getLogger('PostService');

/**
 * Create/Insert a post
 * @param {Connection} conn The DB Connection
 * @param {Number|null} id The id of the post
 * @param {String} title The Title of the post
 * @param {String} description The Description for the post
 * @param {String} createdAt The timestamp of the post
 * @param {Number} userId The user Id
 * @param {Number} categoryId The Category Id
 * @param {Boolean} isClosed Check for application closure
 * @param {Number|null} lastUpdatedUserId Last updated actions' user id
 * @param {Boolean} isDeleted Check for Application Deletion
 * @param {Number} statusId The status id of the application
 * @param {Boolean} isFaq Check For application's FAQ status
 * @param {Boolean} isReported Check for Application's Reported
 * @returns {Promise.<{}>} Post Details
 */
export const savePost = (conn, id, title, description, createdAt, userId, categoryId, isClosed, lastUpdatedUserId, isDeleted, statusId, isFaq, isReported) => {
    logger.info(`Entering postService.savePost`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            title = replaceAll(title, "'", "''");
            //Escape Single Quotation
            description = replaceAll(description, "'", "''");
            let query = queryConstants.MERGE_INTO_POSTS;
            query = query.replace(`USING (VALUES(?,?,CAST('?' AS BLOB),?,?,?,?,?,?,?,?,?)) `,
                `USING (VALUES(${id},'${title}',CAST('${description}' AS BLOB),'${createdAt}',${userId},${categoryId},${isClosed},${lastUpdatedUserId},${isDeleted},${statusId},${isFaq},${isReported})) `);
            await executeQuery(conn, query, [], 'merge');
            let post = await executeQuery(conn, queryConstants.GET_POST_USING_TITLE_USER_ID_TIME, [title, userId, createdAt], 'fetchSingle');
            logger.info(`Exiting postService.savePost`);
            resolve(post);
        } catch (err) {
            logger.error(`Error from postService.savePost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get Post Details from Post Id
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<{}>} Post Details
 */
export const getPostDetails = (conn, postId) => {
    logger.info(`Entering postService.getPostDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_POST_DETAILS_USING_POST_ID, [postId], 'fetchSingle');
            logger.info(`Exiting postService.getPostDetails`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from postService.getPostDetails ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get Trending Discussions Array
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The User Id
 * @param {Number} limit limit of query
 * @param {Number} offset offset of query
 * @returns {Promise.<[]>} Trending Discussions Array
 */
export const getTrendingDiscussions = (conn, userId, limit, offset) => {
    logger.info(`Entering postService.getTrendingDiscussions`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_TRENDING_DISCUSSIONS, [userId, userId, limit, offset], 'fetchMultiple');
            logger.info(`Exiting postService.getTrendingDiscussions`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from postService.getTrendingDiscussions ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get All Discussions Data
 * @param {Connection} conn The DB Connection Object
 * @param {String} sort The User Id
 * @param {Number} limit limit of query
 * @param {Number} offset offset of query
 * @param {Number} categoryId The Category Id
 * @param {Number} statusId The Status Id
 * @param {String} filter The filter
 * @param {Number} userId The User Id
 * @param {[]} categoryCountData The Category and respective counts
 * @param {Number} faqCategoryId the faq cateogry id data
 * @returns {Promise.<[]>} All Discussions Array
 */
export const getAllDiscussionsData = (conn, sort, offset, limit, categoryId, statusId, filter, userId, categoryCountData, faqCategoryId) => {
    logger.info(`Entering postService.getAllDiscussionsData`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.GET_ALL_DISCUSSIONS;
            let queryParams = [userId, userId];
            //Category Conditions
            if(categoryId != 0 && categoryId == categoryCountData.find(category => category.NAME == 'FAQs').ID) {
                query += ` AND PO.IS_FAQ = 1`
                query += (faqCategoryId == 0 ? ` ` : ` AND PO.CATEGORY_ID IN (${faqCategoryId}) `);
            } else if (categoryId != 0) {
                query += ` AND PO.CATEGORY_ID IN (${categoryId}) `
            }
            //Status Conditions
            if(statusId != 0) {
                query += ` AND PO.STATUS_ID IN (${statusId}) `
            }
            //Filter Conditions
            if(filter == 'answered') {
                query += ` AND NVL(ACM.COMMENT_COUNT, 0) > 0 `
            } else if (filter == 'unanswered') {
                query += ` AND NVL(ACM.COMMENT_COUNT, 0) >= 0 `
            }
            

            query += ( ` ORDER BY PO.CREATED_AT ` + (sort == 'recent' ? ` DESC ` : ` ASC ` ));
            query += ` LIMIT ? OFFSET ? `;
            queryParams.push(limit, offset);
            let data = await executeQuery(conn, query, queryParams, 'fetchMultiple');
            logger.info(`Exiting postService.getAllDiscussionsData`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from postService.getAllDiscussionsData ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Search for a Discussion
 * @param {Connection} conn The DB Connection Object
 * @param {String} text The text to be searched for
 * @param {Number} limit limit of query
 * @param {Number} offset offset of query
 * @param {Number} userId The User Id
 * @param {[]} categoryCountData The Category and respective counts
 * @returns {Promise.<[]>} Searched Result Discussions Array
 */
export const searchDiscussion = (conn, text, offset, limit, userId) => {
    logger.info(`Entering postService.searchDiscussion`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            text = replaceAll(text, "'", "''");
            text = `%${text.trim().toLowerCase()}%`
            let query = queryConstants.SEARCH_DISCUSSION;
            let queryParams = [userId, userId, text, text, text, limit, offset];
            let data = await executeQuery(conn, query, queryParams, 'fetchMultiple');
            logger.info(`Exiting postService.searchDiscussion`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from postService.searchDiscussion ${err.message}`);
            reject(err);
        }
    });
}

/**
 * get Specific Discussion
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<{}>} Get the Discussion Object
 */
export const getDiscussion = (conn, postId) => {
    logger.info(`Entering postService.getDiscussion`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.GET_DISCUSSION_USING_ID;
            let queryParams = [postId];
            let data = await executeQuery(conn, query, queryParams, 'fetchSingle');
            logger.info(`Exiting postService.getDiscussion`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from postService.getDiscussion ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Delete a Post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Return true if deletion is successfull
 */
export const deletePost = (conn, postId) => {
    logger.info(`Entering postService.deletePost`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.DELETE_POST_USING_POST_ID, [postId], 'update');
            logger.info(`Exiting postService.deletePost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postService.deletePost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Close a Post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Return true if closure is successfull
 */
export const closePost = (conn, postId) => {
    logger.info(`Entering postService.closePost`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.CLOSE_POST_USING_POST_ID, [postId], 'update');
            logger.info(`Exiting postService.closePost`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postService.closePost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Toggle FAQ a Post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Return FAQ status of the post
 */
export const toggleFaqOfPost = (conn, postId) => {
    logger.info(`Entering postService.toggleFaqOfPost`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.TOGGLE_FAQ_ON_POST, [postId], 'update');
            let postDetails = await getPostDetails(conn, postId);
            logger.info(`Exiting postService.toggleFaqOfPost`);
            resolve(postDetails.IS_FAQ);
        } catch (err) {
            logger.error(`Error from postService.toggleFaqOfPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Report a Post
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @returns {Promise.<Boolean>} Return true if report is successfull
 */
export const toggleIsReportedOfAPost = (conn, postId) => {
    logger.info(`Entering postService.toggleIsReportedOfAPost`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.TOGGLE_IS_REPORTED_ON_POST, [postId], 'update');
            let postDetails = await getPostDetails(conn, postId);
            logger.info(`Exiting postService.toggleIsReportedOfAPost`);
            resolve(postDetails.IS_REPORTED);
        } catch (err) {
            logger.error(`Error from postService.toggleIsReportedOfAPost ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Update a Ticket's Status
 * @param {Connection} conn The DB Connection Object
 * @param {Number} postId The Post Id
 * @param {Number} statusId The Status Id
 * @returns {Promise.<Boolean>} Return true if statsu updation is successful
 */
export const updateTicketStatus = (conn, statusId, postId) => {
    logger.info(`Entering postService.updateTicketStatus`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UPDATE_TICKET_STATUS, [statusId, postId], 'update');
            logger.info(`Exiting postService.updateTicketStatus`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postService.updateTicketStatus ${err.message}`);
            reject(err);
        }
    });
}