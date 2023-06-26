import log4js from 'log4js';
var logger = log4js.getLogger('UserApi');
import { getUserEmail, getUserRole } from '../../util/TokenUtility.js';
import { fetchUserDetailsFromUserEmail, getUserIdFromEmail } from '../delegates/userDelegate.js';
import * as UserDelegate from '../delegates/userDelegate.js';
import Express from 'express';
import { InvalidRequestError } from '../../errors/InvalidRequestError.js';
import * as httpService from '../services/httpService.js'
import * as ReqFilter  from '../../filters/RequestFilter.js';

/**
 * The User API Endpoint Controller
 * @param {Express} app The Express Application
 */
export const UserApi = (app) => {
    app.get('/forum/api/getUser', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getUser");
        try {
            /** 
             * @type {String|null} The user of the email
             * */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userDetails = await fetchUserDetailsFromUserEmail(userEmail);
            logger.info("Exiting DiscussionApi: forum/api/getTrending");
            res.send(userDetails);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getUser ${err.message}`);
            next(err);
        }
    });

    
    app.post('/forum/api/updateUser', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getUser");
        try {
            /** 
             * @type {String|null} The first name of the user
             * */
            let firstName = req.body.firstName;
            if(!(firstName && firstName.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [firstName] found`);
            /** 
             * @type {String|null} The last name of the user
             * */
            let lastName = req.body.lastName;
            if(!(lastName && lastName.trim().length > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [lastName] found`);
            /** 
             * @type {String|null} The email of the user
             * */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let data = await UserDelegate.updateUserName(firstName, lastName, userEmail);
            logger.info("Exiting DiscussionApi: forum/api/getTrending");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getUser ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getAllAgencies', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getAllAgencies");
        try {
            let data = await UserDelegate.getAllAgencies();
            logger.info("Exiting DiscussionApi: forum/api/getAllAgencies");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getAllAgencies ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getAllRoles', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getAllRoles");
        try {
            let data = await UserDelegate.getAllRoles();
            logger.info("Exiting DiscussionApi: forum/api/getAllRoles");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getAllRoles ${err.message}`);
            next(err);
        }
    });

    app.get('/forum/api/getUserNotifications', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/getUserNotifications");
        try {
            /** 
             * @type {String|null} The email of the user
             * */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await UserDelegate.getUserNotifications(userId);
            logger.info("Exiting DiscussionApi: forum/api/getUserNotifications");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/getUserNotifications ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/markUserNotificationRead', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/markUserNotificationRead");
        try {
            /** 
             * @type {Number|null} The id of the notification record
             * */
            let id = req.body.id;
            /** 
             * @type {Number|null} The post id of the notification
             * */
            let postId = req.body.postId;
            /** 
             * @type {String|null} The filter of the Notification
             * */
            let filter = req.body.filter || '';
            if(!(filter && filter.trim().length > 0) && !(id && id > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [filter/id] found`);
            /** 
             * @type {String|null} The email of the user
             * */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await UserDelegate.markNotificationsRead(id, userId, postId, filter);
            logger.info("Exiting DiscussionApi: forum/api/markUserNotificationRead");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/markUserNotificationRead ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/deleteNotification', async function (req, res, next) {
        logger.info("Entering DiscussionApi: forum/api/deleteNotification");
        try {
            /** 
             * @type {Number|null} The id of the notification record
             * */
            let id = req.body.id;
            /** 
             * @type {Number|null} The id of the Post
             * */
            let postId = req.body.postId;
            /** 
             * @type {String|null} The filter of the notification process
             * */
            let filter = req.body.filter;
            if(!(filter && filter.trim().length > 0) && !(id && id > 0)) throw new InvalidRequestError(`Empty/Invalid Parameter [filter/id] found`);
            /** 
             * @type {String|null} The email of the user
             * */
            let userEmail = getUserEmail(String(req.get('authorization')));
            let userId = await getUserIdFromEmail(userEmail);
            let data = await UserDelegate.deleteUserNotification(id, userId, postId, filter);
            logger.info("Exiting DiscussionApi: forum/api/deleteNotification");
            res.send(data);
        } catch (err) {
            logger.error(`Error from DiscussionApi: forum/api/deleteNotification ${err.message}`);
            next(err);
        }
    });

    app.post('/forum/api/migrateDataFromDashboard', ReqFilter.CronAuthenticate, async function (req, res, next) {
        logger.info("Entering UserAPI: forum/api/migrateDataFromDashboard");
        try {
            /**
             * @type object Data from dashboard
             */
            let data = await httpService.getDashboardData(req.get('authorization'));
            await UserDelegate.migrateDataFromDashboard(data);
            logger.info("Exiting UserAPI: forum/api/migrateDataFromDashboard");
            res.send({message: `Cron Job Completed : Data migration from dashboard`,timestamp: new Date(), status: 200});
        } catch (err) {
            logger.error(`Error from UserAPI: forum/api/migrateDataFromDashboard ${err.message}`);
            res.status(500).send({error: err.message});
        }
    });

    app.post('/forum/api/updateUserDetails', async function (req, res, next) {
        logger.info("Entering UserAPI: forum/api/updateUserDetails");
        try {
            /**
             * @type object user from dashboard
             */
            let user = req.body.users;
            /**
             * @type Object useragency from dashboard
             */
            let useragency = req.body.useragency;
            /**
             * @type String type
             */
            let type = req.body.type;
            /**
             * @Type String authorizationToken
             */
            let token = req.headers.authorization;
            let role = getUserRole(token);
            logger.info("Triggered from dashboard for the endpoint ",type);
            if(role !== null)
            {
                await UserDelegate.updateUserDetails(user, useragency, type);
                logger.info("Exiting UserAPI: forum/api/updateUserDetails");
                res.send({message: `User details updation completed`,timestamp: new Date(), endpoint: type, status: 200});
                
            }else {
                logger.error("ERROR from UserAPI: forum/api/updateUserDetails");
                res.status(401).send({error: "Unauthorized", endpoint: type});
            }
        } catch (err) {
            logger.error(`Error from UserAPI: forum/api/updateUserDetails ${err.message}`);
            res.status(500).send({error: err.message});
        }
    });
}