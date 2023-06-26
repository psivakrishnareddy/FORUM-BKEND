import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
var logger = log4js.getLogger('notificationService');
import { getCurrentDateTime } from '../../util/DateTimeUtility.js';
import { replaceAll } from '../../util/StringUtility.js';

/**
 * Save or update a notification
 * @param {Connection} conn DB Connection Object
 * @param {Number|Null} id The id of the notification table
 * @param {Number} userId The user id
 * @param {Number} postId The post id
 * @param {String} description Description of the notification
 * @param {String} triggerTime Triggered time of the notification
 * @param {Boolean} isRead Check if the notification read or not
 * @returns {Promise.<Boolean>} Returns true if notification has been inserted
 */
export const saveNotification = (conn, id, userId, postId, description, triggerTime, isRead) => {
    logger.info(`Entering notificationService.saveNotification`);
    return new Promise(async (resolve, reject) => {
        try {
            //Escape Single Quotation
            description = replaceAll(description, "'", "''");
            let query = queryConstants.MERGE_INTO_NOTIFICATION;
            query = query.replace(`USING (VALUES(?,?,?,?,?,?)) `,
                `USING (VALUES(${id},${userId},${postId},'${description}','${triggerTime}',${isRead})) `);
            await executeQuery(conn, query, [], 'merge');
            logger.info(`Exiting notificationService.saveNotification`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.saveNotification ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Insert bulk notifications
 * @param {Connection} conn DB Connection Object
 * @param {[]} notifications An array of notifications object
 * @returns {Promise.<Boolean>} Returns true if all notification has been inserted
 */
export const saveBulkNotifications = (conn, notifications) => {
    logger.info(`Entering notificationService.saveBulkNotifications`);
    return new Promise(async (resolve, reject) => {
        try {
            let promises = [];
            for(let i=0; i<notifications.length; i++) {
                promises.push(saveNotification(conn, notifications[i].id, notifications[i].userId, notifications[i].postId, notifications[i].description, notifications[i].triggerTime, notifications[i].isRead));
            }
            await Promise.all(promises);
            logger.info(`Exiting notificationService.saveBulkNotifications`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.saveBulkNotifications ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Create a notification
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The user id
 * @param {Number} postId The post id
 * @param {String} description Description of the notification
 * @returns {Promise.<Boolean>} Returns true if notification has been inserted
 */
export const createNotification = (conn, userId, postId, description) => {
    logger.info(`Entering notificationService.createNotification`);
    return new Promise(async (resolve, reject) => {
        try {
            await saveNotification(conn, null, userId, postId, description, getCurrentDateTime(), false);
            logger.info(`Exiting notificationService.createNotification`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.createNotification ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get User unread notifications
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The user id
 * @returns {Promise.<[]>} Returns an array of user unread notifications
 */
export const getUserUnreadNotifications = (conn, userId) => {
    logger.info(`Entering notificationService.getUserUnreadNotifications`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_USER_UNREAD_NOTIFICATIONS, [userId], 'fetchMultiple');
            logger.info(`Exiting notificationService.getUserUnreadNotifications`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from notificationService.getUserUnreadNotifications ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Insert a notification
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The user id
 * @returns {Promise.<[]>} Returns an array of user all notifications
 */
export const getUserAllNotifications = (conn, userId) => {
    logger.info(`Entering notificationService.getUserAllNotifications`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_USER_ALL_NOTIFICATIONS, [userId], 'fetchMultiple');
            logger.info(`Exiting notificationService.getUserAllNotifications`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from notificationService.getUserAllNotifications ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Mark a Notification as read
 * @param {Connection} conn DB Connection Object
 * @param {Number} id The id of the notification table
 * @returns {Promise.<Boolean>} Returns true if the notification is marked as read
 */
export const markUserNotificationRead = (conn, id) => {
    logger.info(`Entering notificationService.markUserNotificationRead`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UPDATE_USER_NOTIFICATION_READ, [id], 'update');
            logger.info(`Exiting notificationService.markUserNotificationRead`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.markUserNotificationRead ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Mark all Notification of a user as read
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The user id
 * @returns {Promise.<Boolean>} Returns true if the notification is marked as read
 */
export const markAllUserNotificationRead = (conn, userId) => {
    logger.info(`Entering notificationService.markAllUserNotificationRead`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UPDATE_USER__ALL_NOTIFICATION_READ, [userId], 'update');
            logger.info(`Exiting notificationService.markAllUserNotificationRead`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.markAllUserNotificationRead ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Delete a Notification
 * @param {Connection} conn DB Connection Object
 * @param {Number} id The id of the notification record
 * @returns {Promise.<Boolean>} Returns true if the notification is deleted
 */
export const deleteNotification = (conn, id) => {
    logger.info(`Entering notificationService.deleteNotification`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.DELETE_NOTIFICATION, [id], 'delete');
            logger.info(`Exiting notificationService.deleteNotification`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.deleteNotification ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Delete bulk Notifications
 * @param {Connection} conn DB Connection Object
 * @param {Number} userId The userId of user who notifications to be deleted
 * @returns {Promise.<Boolean>} Returns true if the notification is deleted
 */
export const bulkDeleteUserNotifications = (conn, userId) => {
    logger.info(`Entering notificationService.bulkDeleteUserNotifications`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.DELETE_USER_ALL_NOTIFICATIONS, [userId], 'delete');
            logger.info(`Exiting notificationService.bulkDeleteUserNotifications`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from notificationService.bulkDeleteUserNotifications ${err.message}`);
            reject(err);
        }
    });
}