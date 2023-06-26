import Express from 'express';
import log4js from 'log4js';
import { getUserEmail } from '../../util/TokenUtility.js';
import { getUserIdFromEmail } from '../delegates/userDelegate.js';
import *  as PostDelegate from '../delegates/postDelegate.js';
import *  as UserDelegate from '../delegates/userDelegate.js';
import { InvalidRequestError } from '../../errors/InvalidRequestError.js';
var logger = log4js.getLogger('DiscussionApi');

/**
 * The Discussion API Endpoint Controller
 * @param {Express} app The Express Application
 */
export const DiscussionApi = (app) => {
    app.get('/forum/api/getTrendingDiscussions', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getTrending");
        try {
            /**
             * @type {Number} The offset index for fetching data from database
             */
            var offset = req.query.offset || 0;
            /**
             * @type {Number} The limit of records for fetching data from database
             */
            var limit = req.query.limit || 5;
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.getTrendingDiscussions(userId, limit, offset);
            logger.info("Exiting DiscussionApi: forum/api/getTrending");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getTrendin ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getCategoryData', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getCategoryData");
        try {
            let data = await PostDelegate.getCategoryData();
            logger.info("Exiting DiscussionApi: forum/api/getCategoryData");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getCategoryData ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getTicketStatusData', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getTicketStatusData");
        try {
            let data = await PostDelegate.getStatusCount();
            logger.info("Exiting DiscussionApi: forum/api/getTicketStatusData");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getTicketStatusData ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getTicketStatusDataByCategory', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getTicketStatusDataByCategory");
        try {
            /**
             * @type {Number} The category id on which the data has to be fetched
             */
            var categoryId = req.query.categoryId;
            let data = await PostDelegate.getStatusCountByCategory(categoryId);
            logger.info("Exiting DiscussionApi: forum/api/getTicketStatusDataByCategory");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getTicketStatusDataByCategory ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getAllDiscussions', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getAllDiscussions");
        try {
            /**
             * @type {String} The sort key for ordering data
             */
            var sort = req.query.sort || 'recent';
            /**
             * @type {Number} The offset index for the records to be fetched from database
             */
            var offset = req.query.offset || 0;
            /**
             * @type {Number} The limit of records to be fetched from database
             */
            var limit = req.query.limit || 5;
            /**
             * @type {Number} The Category Id on which data has to be filtered
             */
            var categoryId = req.query.categoryId || 0;
            /**
             * @type {Number} The faq Category Id on which data has to be filtered
             */
            var faqCategoryId = req.query.faqCategoryId || 0;
            /**
             * @type {Number} The Status Id on whcih data has to be filtered
             */
            var statusId = req.query.statusId || 0;
            /**
             * @type {String} The filter key
             */
            var filter = req.query.filter || '';
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.getAllDiscussionData(sort, offset, limit, categoryId, statusId, filter, userId, faqCategoryId);
            logger.info("Exiting DiscussionApi: forum/api/getAllDiscussions");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getAllDiscussions ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/searchDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/searchDiscussion");
        try {
            /**
             * @type {String} The text on which discussions are to be searched
             */
            var text = req.query.text
            if(!(text && text.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [text] found`);
            /**
             * @type {Number} The offset index on which data has to be fetched from database
             */
            var offset = req.query.offset || 0;
            /**
             * @type {Number} The limit of records to fetched from database
             */
            var limit = req.query.limit || 5;
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.searchDiscussion(text, offset, limit, userId);
            logger.info("Exiting DiscussionApi: forum/api/searchDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/searchDiscussion ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getDiscussion', async function (req, res, next) {        
        logger.info("Entering DiscussionApi: forum/api/getDiscussion");
        try {
            /**
             * @type {Number} The discussion id whose details are to be fethced from database
             */
            var discussionId = req.query.discussionId;
            if(!(discussionId && discussionId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [discussionId] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.getDiscussion(discussionId, userId);
            logger.info("Exiting DiscussionApi: forum/api/getDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getDiscussion ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getRelatedDiscussion', function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getRelatedDiscussion");
        var discussionId = req.query.discussionId;
        res.send("");
    });

    app.get('/forum/api/getSavedDiscussions', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getSavedDiscussions");
        try {
            /**
             * @type {Number} The limit of the records to be fethced from database
             */
            var limit = req.query.limit || 5;
            /**
             * @type {Number} The offset index for fetching data from the database
             */
            var offset = req.query.offset || 0;
            /**
             * @type {String} The sort key for ordering data
             */
            var sort = req.query.sort || 'recent';
            /**
             * @type {String} search key text
             */
            var search = req.query.search || '';
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await UserDelegate.getUserSavedDiscussions(userId, offset, limit, sort, search);
            logger.info("Exiting DiscussionApi: forum/api/getDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getDiscussion ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getUserDiscussions', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getUserDiscussions");
        try {
            /**
             * @type {Number} The limit of records to be fetched from database
             */
            var limit = req.query.limit || 5;
            /**
             * @type {Number} The offset index for which records to be fetched from database
             */
            var offset = req.query.offset || 0;
            /**
             * @type {String} The sort key to order the data
             */
            var sort = req.query.sort || 'recent';
            /**
             * @type {String} The filter key for filtering data in database
             */
            var filter = req.query.filter || 'all';
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await UserDelegate.getUserDiscussions(filter, limit, offset, userId, sort);
            logger.info("Exiting DiscussionApi: forum/api/getUserDiscussions");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getUserDiscussions ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/createDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/createDiscussion");
        try {
            /**
             * @type {String} The title of the discussion
             */
            var title = req.body.title;
            if(!(title && title.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [title] found`);
            /**
             * @type {String} The description of the discussion
             */
            var description = req.body.description;
            if(!(description && description.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [description] found`);
            /**
             * @type {Number} The cateogry Id of the discussion
             */
            var categoryId = req.body.categoryId;
            if(!(categoryId && categoryId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [categoryId] found`);
            /**
             * @type {String[]} The tags for the post
             */
            var tags = req.body.tags || [];
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.createDiscussion(title, description, categoryId, tags, userId);
            logger.info("Exiting DiscussionApi: forum/api/createDiscussion");
            res.send(String(data));
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/createDiscussion ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/editDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/editDiscussion");
        try {
            /**
             * @type {String} The title of the discussion
             */
            var title = req.body.title;
            if(!(title && title.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [title] found`);
            /**
             * @type {String} The description of the discussion
             */
            var description = req.body.description;
            if(!(description && description.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [description] found`);
            /**
             * @type {Number} The cateogry id of the discussion
             */
            var categoryId = req.body.categoryId;
            if(!(categoryId && categoryId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [categoryId] found`);
            /**
             * @type {String[]} The tags for the post
             */
            var tags = req.body.tags || [];
            /**
             * @type {Number} The id of the post to be edited
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.editDiscussion(postId, title, description, categoryId, tags, userId);
            logger.info("Exiting DiscussionApi: forum/api/editDiscussion");
            res.send(String(data));
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/editDiscussion ${err.message}`);
            next(err);
        }
    });

    app.delete('/forum/api/deleteDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/deleteDiscussion");
        try {
            /**
             * @type {Number} The id of the post to be deleted
             */
            var postId = req.query.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            let data = await PostDelegate.deleteDiscussion(postId);
            logger.info("Exiting DiscussionApi: forum/api/deleteDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/deleteDiscussion ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/closeDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/closeDiscussion");
        try {
            /**
             * @type {Number} The id of the post to be closed
             */
            var postId = req.query.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            let data = await PostDelegate.closeDiscussion(postId);
            logger.info("Exiting DiscussionApi: forum/api/closeDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/closeDiscussion ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/addComment', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/addComment");
        try {
            /**
             * @type {Number} The id of the post where comment is added
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {String} The description of the comment
             */
            var description = req.body.description;
            if(!(description && description.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [description] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.addComment(userId, postId, description);
            logger.info("Exiting DiscussionApi: forum/api/addComment");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/addComment ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/updateComment', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/updateComment");
        try {
            /**
             * @type {Number} The id of the post where comment is updated
             */
            var postId = req.body.postId;
            /**
             * @type {Number} The id of the comment to be updated
             */
            var commentId = req.body.commentId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            if(!(commentId &&commentId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [commentId] found`);
            /**
             * @type {String} The description of the comment
             */
            var description = req.body.description;
            if(!(description && description.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [description] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.updateComment(userId, postId,  commentId,description);
            logger.info("Exiting DiscussionApi: forum/api/updateComment");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/updateComment ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/deleteComment', async function (req, res, next) {        
        logger.info("Entering DiscussionApi: forum/api/deleteComment");
        try {
            /**
             * @type {Number} The comment id which has to be deleted from the post
             */
            var commentId = req.body.commentId;
            /**
             * @type {Number} The post id in which the comment has to be deleted
             */
            var postId = req.body.postId;
            if(!(commentId && commentId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [commentId] found`);
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            let data = await PostDelegate.deleteComment(commentId,postId);
            logger.info("Exiting DiscussionApi: forum/api/deleteComment");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/deleteComment ${err.message}`);
            next(err);
        }
    });


    app.post('/forum/api/bookmark', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/bookmark");
        try {
            /**
             * @type {Number} The id of the post
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {Boolean} The bookmark action
             */
            var action = req.body.action;
            if(!(action !== null)) throw new InvalidRequestError(`Empty/Invalid Parameter [action] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.toggleBookMarkForPost(userId, postId, action);
            logger.info("Exiting DiscussionApi: forum/api/bookmark");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/bookmark ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/voteDiscussion', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/voteDiscussion");
        try {
            /**
             * @type {Number} The post id
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {Boolean} The voting action
             */
            var action = req.body.action;
            if(!(action !== null)) throw new InvalidRequestError(`Empty/Invalid Parameter [action] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.voteDiscussion(userId, postId, action);
            logger.info("Exiting DiscussionApi: forum/api/voteDiscussion");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/voteDiscussion ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/faqAction', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/faqAction");
        try {
            /**
             * @type {Number} The post id
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {Boolean} The action for FAQ
             */
            var action = req.body.action;
            if(!(action !== null)) throw new InvalidRequestError(`Empty/Invalid Parameter [action] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.toggleFaqForPost(userId, postId, action);
            logger.info("Exiting DiscussionApi: forum/api/faqAction");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/faqAction ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/reportAction', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/reportAction");
        try {
            /**
             * @type {Number} The post id
             */
            var postId = req.body.postId;
            if(!(postId && postId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [postId] found`);
            /**
             * @type {Boolean} The action for report
             */
            var action = req.body.action;
            if(!(action !== null)) throw new InvalidRequestError(`Empty/Invalid Parameter [action] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.toggleIsReportedForAPost(userId, postId, action);
            logger.info("Exiting DiscussionApi: forum/api/reportAction");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/reportAction ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/saveAnswerFeedback', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/saveAnswerFeedback");
        try {
            /**
             * @type {number} The id of the answer feedback column
             */
            var id = req.body.id || 0;
            /**
             * @type {Number} The id of the comment to which feedback is provided
             */
            var commentId = req.body.commentId;
            if(!(commentId && commentId > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [commentId] found`);
            /**
             * @type {Boolean} Boolean if the feedback is useful or not
             */
            var isUseful = req.body.isUseful || false;
            /**
             * @type {String} The feedback description
             */
            var feedback = req.body.feedback;
            if(!(feedback && feedback.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [feedback] found`);
            /**
             * @type {String} The user email who is requesting the data
             */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await PostDelegate.saveAnswerFeedback(userId, id, commentId, isUseful, feedback);
            logger.info("Exiting DiscussionApi: forum/api/saveAnswerFeedback");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/saveAnswerFeedback ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/addNewTicketStatus', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/addNewTicketStatus");
        try {
            /**
             * @type {String} The status name that has to be added into database
             */
            var status = req.body.status;
            if(!(status && status.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [status] found`);
            let data = await PostDelegate.addNewTicketStatus(status);
            logger.info("Exiting DiscussionApi: forum/api/addNewTicketStatus");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/addNewTicketStatus ${err.message}`);
            next(err);
        }
    });
}