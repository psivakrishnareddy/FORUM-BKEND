import log4js from 'log4js';
var logger = log4js.getLogger('userDelegate');
import { getDbConnection, closeConnection, beginTransaction, commitTransaction, rollbackTransaction } from '../../util/DbManager.js';
import * as userService from '../services/userService.js';
import * as notificationService from '../services/notificationService.js';
import * as savedPostService from '../services/savedPostService.js';
import { AgencyData, UserData, RoleData } from '../../models/dto/UserData.js';
import { populateAgencyDetails, populateMinimalDiscussionData, populateNotificationDetails, populateRoleDetails } from '../../util/DataPopulateUtility.js';
import { DiscussionResponse } from '../../models/dto/DiscussionResponse.js';
import { NotificationData } from '../../models/dto/NotificationData.js';

/**
 * Returns User Id from the user table for the respective User Email
 * @param {String} userEmail The email of the user whose id is to be retrieved
 * @returns {Promise.<Number|null>} User's ID will be returned or null will be returned
 */
export const getUserIdFromEmail = (userEmail) => {
    logger.info(`Entering userDelegate.getUserIdFromEmail`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let userId = await userService.getUserIdFromEmail(connection, userEmail);
            logger.info(`Exiting userDelegate.getUserIdFromEmail`);
            resolve(userId);
        } catch (err) {
            logger.error(`Error from userDelegate.getUserIdFromEmail ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get User details from the user email
 * @param {String} userEmail the user email
 * @return {Promise.<UserData>} the details of the user
 */
export const fetchUserDetailsFromUserEmail = (userEmail) => {
    logger.info(`Entering userDelegate.fetchUserDetailsFromUserEmail`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let userData = await userService.getUserDetailsByEmail(connection, userEmail);
            logger.info(`Exiting userDelegate.fetchUserDetailsFromUserEmail`);
            resolve(userData);
        } catch (err) {
            logger.error(`Error from userDelegate.fetchUserDetailsFromUserEmail ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get all User Saved Discussions Details
 * @param {Number} userId The user Id
 * @param {Number} offset The offset for query data
 * @param {Number} limit the limit for query data
 * @param {String|null} sort the sorting key
 * @param {String|null} text the search key
 * @returns {Promise.<DiscussionResponse>} User Saved Discussions Details
 */
export const getUserSavedDiscussions = (userId, offset, limit, sort, text) => {
    logger.info(`Entering userDelegate.getUserSavedDiscussions`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await savedPostService.getUserSavedDiscussions(connection, userId, sort, limit, offset, text);
            let response = {
                discussionData: [],
                totalCount: 0
            }
            data.forEach(result => {
                response.totalCount = result.TOTAL_COUNT;
                response.discussionData.push(populateMinimalDiscussionData(result));
            })
            logger.info(`Exiting userDelegate.getUserSavedDiscussions`);
            resolve(response);
        } catch (err) {
            logger.error(`Error from userDelegate.getUserSavedDiscussions ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get All User Created Discussions details
 * @param {String} filter The Filter key
 * @param {Number} limit The limit for the query data
 * @param {Number} offset The Offset for the query data
 * @param {Number} userId The user Id
 * @param {String|null} sort The sorting key
 * @returns {Promise.<DiscussionResponse>} User Created Discussions details
 */
export const getUserDiscussions = (filter, limit, offset, userId, sort) => {
    logger.info(`Entering userDelegate.getUserDiscussions`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await userService.getUserDiscussions(connection, filter, limit, offset, userId, sort);
            let response = {
                discussionData: [],
                totalCount: 0
            }
            data.forEach(result => {
                response.totalCount = result.TOTAL_COUNT;
                response.discussionData.push(populateMinimalDiscussionData(result));
            })
            logger.info(`Exiting userDelegate.getUserSavedDiscussions`);
            resolve(response);
        } catch (err) {
            logger.error(`Error from userDelegate.getUserDiscussions ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get User Data using user id
 * @param {Number} userId The user id
 * @returns {Promise.<UserData>} the user data
 */
export const getUserDetails = (userId) => {
    logger.info(`Entering userDelegate.getUserDetails`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let data = await userService.getUserDetails(connection, userId);
            logger.info(`Exiting userDelegate.getUserDetails`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userDelegate.getUserDetails ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Update User Name of the user using email
 * @param {String} firstName First name of the user to be updated
 * @param {String} lastName Last name of the user to be updated
 * @param {String} userEmail email of the user whose name is to be updated
 * @returns {Promise.<Boolean>} Returns true if updation is successfull
 */
export const updateUserName = (firstName, lastName, userEmail) => {
    logger.info(`Entering userDelegate.updateUserName`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await userService.updateUser(connection, firstName, lastName, userEmail);
            connection = await commitTransaction(connection);
            logger.info(`Exiting userDelegate.updateUserName`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userDelegate.updateUserName ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get All Agency details
 * @returns {Promise.<AgencyData[]>} All Agency details
 */
export const getAllAgencies = () => {
    logger.info(`Entering userDelegate.getAllAgencies`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let agencyData = await userService.getAllAgencies(connection);
            let data = [];
            agencyData.forEach(agen => {
                data.push(populateAgencyDetails(agen, null));
            })
            logger.info(`Exiting userDelegate.getAllAgencies`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userDelegate.getAllAgencies ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get All role details
 * @returns {Promise.<RoleData[]>} All role details
 */
export const getAllRoles = () => {
    logger.info(`Entering userDelegate.getAllRoles`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let roleData = await userService.getAllRoles(connection);
            let data = [];
            roleData.forEach(role => {
                data.push(populateRoleDetails(role));
            });
            logger.info(`Exiting userDelegate.getAllRoles`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userDelegate.getAllRoles ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Get All User Notifications
 * @returns {Promise.<NotificationData[]>} All notifications details of a user
 */
export const getUserNotifications = (userId) => {
    logger.info(`Entering userDelegate.getUserNotifications`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            let notificationData = await notificationService.getUserAllNotifications(connection, userId);
            let data = [];
            notificationData.forEach(noti => {
                data.push(populateNotificationDetails(noti));
            });
            logger.info(`Exiting userDelegate.getUserNotifications`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userDelegate.getUserNotifications ${err.message}`);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Mark User Notifications as Read
 * @param {Number|null} id the id of the notification record
 * @param {Number|null} userId the user id of the notification to be updated
 * @param {Number|null} postId the post id of which notifications to be updated
 * @param {String|null} filter filter to update operation
 * @returns {Promise.<Boolean>} Returns true if updation successfull
 */
export const markNotificationsRead = (id, userId, postId, filter) => {
    logger.info(`Entering userDelegate.markNotificationsRead`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            if(filter.trim().toLowerCase() == 'all') {
                await notificationService.markAllUserNotificationRead(connection, userId);
            } else {
                await notificationService.markUserNotificationRead(connection, id);
            }
            logger.info(`Exiting userDelegate.markNotificationsRead`);
            connection = await commitTransaction(connection);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userDelegate.markNotificationsRead ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * Delete User Notifications
 * @param {Number|null} id the id of the notification record
 * @param {Number|null} userId the user id of the notification to be deleted
 * @param {Number|null} postId the post id of which notifications to be deleted
 * @param {String|null} filter filter to delete operation
 * @returns {Promise.<Boolean>} Returns true if deletion successfull
 */
export const deleteUserNotification = (id, userId, postId, filter) => {
    logger.info(`Entering userDelegate.deleteUserNotification`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            if(filter.trim().toLowerCase() == 'all') {
                await notificationService.bulkDeleteUserNotifications(connection, userId);
            } else {
                await notificationService.deleteNotification(connection, id);
            }
            logger.info(`Exiting userDelegate.deleteUserNotification`);
            connection = await commitTransaction(connection);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userDelegate.deleteUserNotification ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * @param {Object} data 
 * @returns {Promise.<Boolean>} Returns true if migration is successful
 */
export const migrateDataFromDashboard = (data) => {
    logger.info(`Entering userDelegate.migrateDataFromDashboard`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await userService.updateAllUsers(connection, data["users"]);
            await userService.updateRoles(connection, data["role"]);
            await commitTransaction(connection);
            await userService.updateAllAgency(connection, data["agency"]);
            await userService.updateUserInAgency(connection, data["useragency"], "all");
            logger.info(`Exiting userDelegate.migrateDataFromDashboard`);
            connection = await commitTransaction(connection);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userDelegate.migrateDataFromDashboard ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}

/**
 * @param {User} user 
 * @param {UserAgency} useragency 
 * @param {String} type 
 * @returns {Promise.<Boolean>}
 */
export const updateUserDetails = async (user, useragency, type) => {
    logger.info(`Entering userDelegate.updateUserDetails`);
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getDbConnection();
            connection = await beginTransaction(connection);
            await userService.updateUserDetails(connection, user, type);
            await userService.updateUserInAgency(connection, useragency, "single");
            logger.info(`Exiting userDelegate.updateUserDetails`);
            connection = await commitTransaction(connection);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userDelegate.updateUserDetails ${err.message}`);
            connection = await rollbackTransaction(connection);
            reject(err);
        } finally {
            await closeConnection(connection);
        }
    });
}