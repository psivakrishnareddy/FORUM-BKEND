import log4js from 'log4js';
var logger = log4js.getLogger('PostDelegate');
import { getDbConnection, closeConnection, beginTransaction, commitTransaction, rollbackTransaction } from '../../util/DbManager.js';
import * as postService from '../services/postService.js';
import * as categoryService from '../services/categoryService.js';
import * as statusService from '../services/statusService.js';
import * as voteService from '../services/voteService.js';
import * as commentService from '../services/commentService.js';
import * as tagService from '../services/tagService.js';
import * as savedPostService from '../services/savedPostService.js';
import * as userService from '../services/userService.js';
import * as notificationService from '../services/notificationService.js';
import { getCurrentDateTime, parseDate } from '../../util/DateTimeUtility.js';
import { POST_STATUS_CONSTANTS } from '../../constants/ticketStatusContants.js';
import { NOTIFICATION_CONSTANTS } from '../../constants/notificationConstants.js';
import { populateCategoryData, populateCommentForAPost, populateFeedbackForAComment, populateInitialPostData, populateMinimalDiscussionData, populateStatusData, populateTagsForAPost } from '../../util/DataPopulateUtility.js';
import { DiscussionResponse } from '../../models/dto/DiscussionResponse.js';
import { CategoryCountData } from '../../models/dto/CategoryCountData.js';
import { StatusCountData } from '../../models/dto/StatusCountData.js';
import { DiscussionData } from '../../models/dto/DiscussionData.js';

/**
 * Get the trending discussions
 * @param {Number} userId the user id
 * @param {Number} limit The limit fo records to be pulled
 * @param {Number} offset The Offset index for records to be fetched
 * @returns {Promise.<DiscussionResponse>} the trending discussions
 */
export const getTrendingDiscussions = (userId, limit, offset) => {
    logger.info(`Entering postDelegate.getTrendingDiscussions`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await postService.getTrendingDiscussions(connection, userId, limit, offset);
            let populatedData = {
                totalCount: 0,
                discussionData: []
            };
            data.forEach(result => {
                populatedData.totalCount = result.TOTAL_COUNT;
                populatedData.discussionData.push(populateMinimalDiscussionData(result));
            });
            logger.info(`Exiting postDelegate.getTrendingDiscussions`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getTrendingDiscussions ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get the Category data
 * @returns {Promise.<CategoryCountData[]>} the Category count Data
 */
export const getCategoryData = () => {
    logger.info(`Entering postDelegate.getCategoryData`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await categoryService.getCategoryCount(connection);
            let populatedData = [];
            data.forEach(result => {
                populatedData.push(populateCategoryData(result));
            });
            logger.info(`Exiting postDelegate.getTrendingDiscussions`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getTrendingDiscussions ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get the Status data
 * @returns {Promise.<StatusCountData[]>} the Status count Data
 */
export const getStatusCount = () => {
    logger.info(`Entering postDelegate.getStatusCount`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await statusService.getStatusCountData(connection);
            let populatedData = [];
            data.forEach(result => {
                populatedData.push(populateStatusData(result));
            });
            logger.info(`Exiting postDelegate.getStatusCount`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getStatusCount ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get the status data based on category
 * @param {Number} categoryId 
 * @returns {Promise.<StatusCountData[]>} the Status count Data
 */
export const getStatusCountByCategory = (categoryId) => {
    logger.info(`Entering postDelegate.getStatusCountByCategory`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await statusService.getStatusCountDataByCategory(connection, categoryId);
            let populatedData = [];
            data.forEach(result => {
                populatedData.push(populateStatusData(result));
            });
            logger.info(`Exiting postDelegate.getStatusCountByCategory`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getStatusCountByCategory ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get all Discussion Data details from the database
 * @param {String} sort The sorting key
 * @param {Number} offset The offset index for fetching records from database
 * @param {Number} limit The limit of records to be fetched from database
 * @param {Number|null} categoryId The Category Id of discussions that has to be filtered
 * @param {Number|null} statusId The Status id of the discussions that has to be filtered
 * @param {String|null} filter The filter for fetching records from database
 * @param {Number} userId The id of the user requesting the data
 * @param {Number} faqCategoryId The Faq Category Id for the data
 * @returns {Promise.<DiscussionResponse>} all Discussion Data details from the database
 */
export const getAllDiscussionData = (sort, offset, limit, categoryId, statusId, filter, userId, faqCategoryId) => {
    logger.info(`Entering postDelegate.getAllDiscussionData`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let categoryCountData = await categoryService.getCategoryCount(connection);
            let data = await postService.getAllDiscussionsData(connection, sort, offset, limit, categoryId, statusId, filter, userId, categoryCountData, faqCategoryId);
            let populatedData = {
                totalCount: 0,
                discussionData: []
            };
            data.forEach(result => {
                populatedData.totalCount = result.TOTAL_COUNT;
                populatedData.discussionData.push(populateMinimalDiscussionData(result));
            });
            logger.info(`Exiting postDelegate.getAllDiscussionData`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getAllDiscussionData ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get all Discussion Data details with respective key from the database
 * @param {String} text The text key to search in database
 * @param {Number} offset The offset index for fetching records from database
 * @param {Number} limit The limit of records to be fetched from database
 * @param {Number} userId The id of the user requesting the data
 * @returns {Promise.<DiscussionResponse>} all Discussion Data details with respective key from the database
 */
export const searchDiscussion = (text, offset, limit, userId) => {
    logger.info(`Entering postDelegate.searchDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await postService.searchDiscussion(connection, text, offset, limit, userId);
            let populatedData = {
                totalCount: 0,
                discussionData: []
            };
            data.forEach(result => {
                populatedData.totalCount = result.TOTAL_COUNT;
                populatedData.discussionData.push(populateMinimalDiscussionData(result));
            });
            logger.info(`Exiting postDelegate.searchDiscussion`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.searchDiscussion ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get complete details of the discussion using discussion id
 * @param {Number} discussionId the discussion id whose details is being requested
 * @param {Number} userId The id of the user requesting the data
 * @returns {Promise.<DiscussionData>} complete details of the discussion using discussion id
 */
export const getDiscussion = (discussionId, userId) => {
    logger.info(`Entering postDelegate.getDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let discussionData = await postService.getDiscussion(connection, discussionId);
            let populatedData = populateInitialPostData(discussionData);
            populatedData['voted'] = await voteService.checkIsVoted(connection, userId, discussionId);
            let categoryDataForPost = await categoryService.getCategoryData(connection, discussionData.CATEGORY_ID);
            populatedData['category'] = {
                id: categoryDataForPost.ID,
                name: categoryDataForPost.NAME
            }
            let statusDataForPost = await statusService.getStatusData(connection, discussionData.STATUS_ID);
            populatedData['status'] = statusDataForPost.STATUS;
            populatedData['voteCount'] = await voteService.getVoteCountForPost(connection, discussionId);
            let commentDataForPost = await commentService.getAllCommentsForAPost(connection, userId, discussionId);
            populatedData['comments'] = [];
            for(let i=0; i<commentDataForPost.length; i++) {
                let comment = commentDataForPost[i];
                let feedbackData = [];
                if(comment.USER_ID == userId) {
                    feedbackData = await commentService.getFeedbackForComment(connection, comment.ID);
                    feedbackData = feedbackData.map(feedback => populateFeedbackForAComment(feedback));
                }
                populatedData['comments'].push(populateCommentForAPost(comment, feedbackData));
            }
            let tagDataForPost = await tagService.getTagsForPost(connection, discussionId);
            populatedData['tags'] = [];
            populatedData['tags'].push(...tagDataForPost.map(tag => populateTagsForAPost(tag)));
            populatedData['bookmarked']  = await savedPostService.getBookmarkForUserAndPost(connection, userId, discussionId) ? true : false;
            let userData = await userService.getUserDetails(connection, discussionData.USER_ID);
            populatedData['userName'] = userData.user.firstName+' '+userData.user.lastName;
            populatedData['user'] = userData;
            logger.info(`Exiting postDelegate.getDiscussion`);
            resolve(populatedData);
        } catch (err) {
            logger.error(`Error from postDelegate.getDiscussion ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Create a new Dicussion
 * @param {String} title the title of the discussion
 * @param {String} description The description of the discussion
 * @param {Number} categoryId The Category id of the discussion
 * @param {String[]} tags An array of tag strings
 * @param {Number} userId The Id of the user who is craeting the discussion
 * @returns {Promise.<Number>} Returns the identity value of the created discussion
 */
export const createDiscussion = (title, description, categoryId, tags, userId) => {
    logger.info(`Entering postDelegate.createDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let statusData = await  statusService.getStatusDataByName(connection, POST_STATUS_CONSTANTS.PUBLISHED);
            let post = await postService.savePost(connection, 0, title, description, getCurrentDateTime(), userId, categoryId, false, userId, false, statusData.ID, false, false);
            await tagService.bulkInsertTagsForAPost(connection, tags.map(tag => {
                return { id: 0, postId: post.ID, tagName: tag, isDeleted: false }
            }));
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.createDiscussion`);
            resolve(post.ID);
        } catch (err) {
            logger.error(`Error from postDelegate.createDiscussion ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Edit a Dicussion
 * @param {Number} postId The id of the id discussion which has to be updated
 * @param {String} title the title of the discussion
 * @param {String} description The description of the discussion
 * @param {Number} categoryId The Category id of the discussion
 * @param {String[]} tags An array of tag strings
 * @param {Number} userId The Id of the user who is craeting the discussion
 * @returns {Promise.<Number>} Returns the identity value of the created discussion
 */
export const editDiscussion = (postId, title, description, categoryId, tags, userId) => {
    logger.info(`Entering postDelegate.editDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let post = await postService.getDiscussion(connection, postId);
            connection = await beginTransaction(connection);
            post = await postService.savePost(connection, postId, title, description, post.CREATED_AT, post.USER_ID, categoryId, post.IS_CLOSED, userId, post.IS_DELETED, post.STATUS_ID, post.IS_FAQ, post.IS_REPORTED);
            await tagService.bulkDeleteTagsForAPost(connection, postId);
            await tagService.bulkInsertTagsForAPost(connection, tags.map(tag => {
                return { id: 0, postId: post.ID, tagName: tag, isDeleted: false }
            }));
            await notificationService.createNotification(connection, post.USER_ID, postId, NOTIFICATION_CONSTANTS.DISCUSSION_UPDATED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.editDiscussion`);
            resolve(post.ID);
        } catch (err) {
            logger.error(`Error from postDelegate.editDiscussion ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Delete a discussion using the post id
 * @param {Number} postId the id of the post that has to be deleted
 * @returns {Promise.<Boolean>} Returns true if the discussion has been deleted
 */
export const deleteDiscussion = (postId) => {
    logger.info(`Entering postDelegate.deleteDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let post = await postService.getPostDetails(connection, postId);
            await postService.deletePost(connection, postId);
            await notificationService.createNotification(connection, post.USER_ID, postId, NOTIFICATION_CONSTANTS.DISCUSSION_DELETED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.deleteDiscussion`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postDelegate.deleteDiscussion ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}
/**
 * Deletes a comment from the post using the post id and comment id
 * @param {*} commentId The id of the comment which has to be deleted
 * @param {Number} userId The id of the user who is adding comment to the post
 * @param {Number} postId The id of the post to which the comments has to be deleted
 * @returns 
 */
export const deleteComment = (commentId, postId) => {
    logger.info(`Entering postDelegate.deleteComment`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let post = await postService.getPostDetails(connection, postId);
            await commentService.deleteComment(connection, commentId, postId);
            await notificationService.createNotification(connection, post.USER_ID, postId, NOTIFICATION_CONSTANTS.COMMENT_DELETED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.deleteComment`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postDelegate.deleteComment ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Close a discussion using the post id
 * @param {Number} postId the id of the post that has to be closed
 * @returns {Promise.<Boolean>} Returns true if the discussion has been closed
 */
export const closeDiscussion = (postId) => {
    logger.info(`Entering postDelegate.closeDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let post = await postService.getPostDetails(connection, postId);
            await postService.closePost(connection, postId);
            await notificationService.createNotification(connection, post.USER_ID, postId, NOTIFICATION_CONSTANTS.DISCUSSION_CLOSED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.closeDiscussion`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postDelegate.closeDiscussion ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Add comment to a post
 * @param {Number} userId The id of the user who is adding comment to the post
 * @param {Number} postId The id of the post to which the comments has to be added
 * @param {String} description The description of the comment
 * @returns {Promise.<DiscussionData>} The discussion data of the post that has been commented
 */
export const addComment = (userId, postId, description) => {
    logger.info(`Entering postDelegate.addComment`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await commentService.addCommentForAPost(connection, postId, description, userId);
            let commentUserDetails = await userService.getUserDetails(connection, userId);
            let isAdminComment = commentUserDetails.agency.some(agen => agen.role.roleName.trim().toLowerCase().includes('admin'));
            let post = await postService.getDiscussion(connection, postId);
            connection = await commitTransaction(connection);
            if(isAdminComment) {
                if(post.USER_ID !== userId)
                {
                    let ticketStatus = await statusService.getStatusDataByName(connection, POST_STATUS_CONSTANTS.ANSWERED);
                    await postService.updateTicketStatus(connection, ticketStatus.ID, postId);
                }
            }
            connection = await commitTransaction(connection);
            let postDetails = await getDiscussion(postId, userId);
            await notificationService.createNotification(connection, postDetails.userId, postId, NOTIFICATION_CONSTANTS.DISCUSSION_COMMENTED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.addComment`);
            resolve(postDetails);
        } catch (err) {
            logger.error(`Error from postDelegate.addComment ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * 
 * @param {Number} userId The id of the user
 * @param {Number} postId The id of the post whose comment has to be updated
 * @param {Number} commentId The id of the comment to be updated
 * @param {String} description The description of the comment
 * @returns 
 */
export const updateComment = (userId, postId, commentId, description) => {
    logger.info(`Entering postDelegate.updateComment`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await commentService.updateCommentForAPost(connection, postId,commentId, description);
            connection = await commitTransaction(connection);
            let postDetails = await getDiscussion(postId, userId);
            await notificationService.createNotification(connection, postDetails.userId, postId, NOTIFICATION_CONSTANTS.COMMENT_EDITED);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.updateComment`);
            resolve(postDetails);
        } catch (err) {
            logger.error(`Error from postDelegate.updateComment ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Toggle the bookmark flag of a post
 * @param {Number} userId The id of the user
 * @param {Number} postId The id of the post whose bookmark flag is to be toggled
 * @param {Boolean} action Action of the bookmark flag
 * @returns {Promise.<Boolean>} Returns the bookmark flag of the post
 */
export const toggleBookMarkForPost = (userId, postId, action) => {
    logger.info(`Entering postDelegate.toggleBookMarkForPost`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            if(action) {
                await savedPostService.bookmarkAPost(connection, userId, postId, getCurrentDateTime());
            } else {
                await savedPostService.unbookmarkAPost(connection, userId, postId, getCurrentDateTime());
            }
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.toggleBookMarkForPost`);
            resolve(action);
        } catch (err) {
            logger.error(`Error from postDelegate.toggleBookMarkForPost ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Vote/Unvote a Discussion
 * @param {Number} userId The id of the user
 * @param {Number} postId The id of the post whose vote flag is to be toggled
 * @param {Boolean} action Action of the vote flag
 * @returns {Promise.<Boolean>} Returns the vote flag of the post
 */
export const voteDiscussion = (userId, postId, action) => {
    logger.info(`Entering postDelegate.voteDiscussion`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            if(action) {
                await voteService.voteForPost(connection, userId, postId, getCurrentDateTime());
            } else {
                await voteService.unvoteForPost(connection, userId, postId);
            }
            let data = voteService.getVoteCountForPost(connection, postId)
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.voteDiscussion`);
            resolve(action);
        } catch (err) {
            logger.error(`Error from postDelegate.voteDiscussion ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Toggle FAQ for a Discussion
 * @param {Number} userId The id of the user
 * @param {Number} postId The id of the post whose FAQ flag is to be toggled
 * @param {Boolean} action Action of the FAQ flag
 * @returns {Promise.<Boolean>} Returns the FAQ flag of the post
 */
export const toggleFaqForPost = (userId, postId, action) => {
    logger.info(`Entering postDelegate.toggleFaqForPost`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let postData = await getDiscussion(postId, userId);
            postData.isFaq != action && await postService.toggleFaqOfPost(connection, postId);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.toggleFaqForPost`);
            resolve(action);
        } catch (err) {
            logger.error(`Error from postDelegate.toggleFaqForPost ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Toggle reported status for a Discussion
 * @param {Number} userId The id of the user
 * @param {Number} postId The id of the post whose reported flag is to be toggled
 * @param {Boolean} action Action of the reported flag
 * @returns {Promise.<Boolean>} Returns the reported flag of the post
 */
export const toggleIsReportedForAPost = (userId, postId, action) => {
    logger.info(`Entering postDelegate.toggleIsReportedForAPost`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            let postData = await getDiscussion(postId, userId);
            postData.isReported != action && await postService.toggleIsReportedOfAPost(connection, postId);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.toggleIsReportedForAPost`);
            resolve(action);
        } catch (err) {
            logger.error(`Error from postDelegate.toggleIsReportedForAPost ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Add Feedback to a comment
 * @param {Number} userId The id of the user who is adding feedback to the user
 * @param {Number|null} id The id of the answer feedback table
 * @param {Number} commentId The id of the comment for which the feedback is added
 * @param {Boolean} isUseful Check if the feedback is useful or not
 * @param {String} feedback The description of the feedback
 * @returns {Promise.<Boolean>} Returns true if feedback is added to the comment
 */
export const saveAnswerFeedback = (userId, id, commentId, isUseful, feedback) => {
    logger.info(`Entering postDelegate.saveAnswerFeedback`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await commentService.saveAnswerFeedback(connection, id, userId, commentId, isUseful, feedback);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.saveAnswerFeedback`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from postDelegate.saveAnswerFeedback ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Add a new Status to database
 * @param {String} status New Status Name to be added
 * @returns {Promise.<Number>} Returns the id of the new status record in database
 */
export const addNewTicketStatus = (status) => {
    logger.info(`Entering postDelegate.addNewTicketStatus`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await statusService.addNewTicketStatus(connection, status);
            let statusData = await statusService.getStatusDataByName(connection, status);
            connection = await commitTransaction(connection);
            logger.info(`Exiting postDelegate.addNewTicketStatus`);
            resolve(String(statusData.ID));
        } catch (err) {
            logger.error(`Error from postDelegate.addNewTicketStatus ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}