import log4js from 'log4js';
import * as queryConstants from '../../constants/queryConstants.js';
import { executeQuery } from '../../util/DbManager.js';
import { populateAgencyDetails, populateUserDetails } from '../../util/DataPopulateUtility.js';
import { UserData } from '../../models/dto/UserData.js';
var logger = log4js.getLogger('userService');

/**
 * Get User Id From Email
 * @param {Connection} conn The DB Connection Object
 * @param {String} userEmail The user email
 * @returns {Promise.<Number|null>} Returns User id
 */
export const getUserIdFromEmail = (conn, userEmail) => {
    logger.info(`Entering userService.getUserIdFromEmail`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_USER_ID_USING_EMAIL, [userEmail], 'fetchSingle');
            logger.info(`Exiting userService.getUserIdFromEmail`);
            resolve(data.ID || null);
        } catch (err) {
            logger.error(`Error from userService.getUserIdFromEmail ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get User data from user id
 * @param {Connection} conn The DB Connection Object
 * @param {Number} userId The user id
 * @returns {Promise.<UserData>} Returns User data
 */
export const getUserDetails = (conn, userId) => {
    logger.info(`Entering userService.getUserDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await executeQuery(conn, queryConstants.GET_USER_DATA_USING_ID, [userId], 'fetchSingle');
            let userInAgency = await executeQuery(conn, queryConstants.GET_USER_IN_AGENCY_DATA_USING_ID, [userId], 'fetchMultiple');
            let userData = {
                user: {},
                role: {},
                agency: []
            }
            userData.user = populateUserDetails(user);
            for(let i=0; i<userInAgency.length; i++) {
                let agencyDetails = userInAgency[i].AGENCY_ID ? await executeQuery(conn, queryConstants.GET_AGENCY_DATA_USING_ID, [userInAgency[i].AGENCY_ID], 'fetchSingle') : null; 
                let roleDetails = userInAgency[i].ROLE_ID ? await executeQuery(conn, queryConstants.GET_ROLE_DATA_USING_ID, [userInAgency[i].ROLE_ID], 'fetchSingle') : null; 
                userData.agency.push(populateAgencyDetails(agencyDetails, roleDetails));
            }
            userData.role = userData.agency[0].role || {};
            logger.info(`Exiting userService.getUserDetails`);
            resolve(userData);
        } catch (err) {
            logger.error(`Error from userService.getUserDetails ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get User Data From Email
 * @param {Connection} conn The DB Connection Object
 * @param {String} userEmail The user email
 * @returns {Promise.<UserData>} Returns User details
 */
export const getUserDetailsByEmail = (conn, userEmail) => {
    logger.info(`Entering userService.getUserDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await executeQuery(conn, queryConstants.GET_USER_DATA_USING_EMAIL, [userEmail], 'fetchSingle');
            let userId = user.USER_ID;
            let userInAgency = await executeQuery(conn, queryConstants.GET_USER_IN_AGENCY_DATA_USING_ID, [userId], 'fetchMultiple');
            let userData = {
                user: {},
                role: {},
                agency: []
            };
            userData.user = populateUserDetails(user);
            for(let i=0; i<userInAgency.length; i++) {
                let agencyDetails = userInAgency[i].AGENCY_ID ? await executeQuery(conn, queryConstants.GET_AGENCY_DATA_USING_ID, [userInAgency[i].AGENCY_ID], 'fetchSingle') : null; 
                let roleDetails = userInAgency[i].ROLE_ID ? await executeQuery(conn, queryConstants.GET_ROLE_DATA_USING_ID, [userInAgency[i].ROLE_ID], 'fetchSingle') : null; 
                userData.agency.push(populateAgencyDetails(agencyDetails, roleDetails));
            }
            userData.role = userData.agency[0].role || {};
            logger.info(`Exiting userService.getUserDetails`);
            resolve(userData);
        } catch (err) {
            logger.error(`Error from userService.getUserDetails ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Update user first and last name using email
 * @param {Connection} conn The DB Connection Object
 * @param {String} email The user email
 * @param {String} firstName The user first name
 * @param {String} lastName The user last name
 * @returns {Promise.<Boolean>} Returns true after update
 */
export const updateUser = (conn, firstName, lastName, email) => {
    logger.info(`Entering userSerice.updateUser`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UPDATE_USER_NAME, [firstName, lastName, email], 'update');
            logger.info(`Exiting userSerice.updateUser`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userSerice.updateUser ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get ALl Role Data
 * @param {Connection} conn The DB Connection Object
 * @returns {Promise.<[]>} Returns All Role details
 */
export const getAllRoles = (conn) => {
    logger.info(`Entering userService.getAllRoles`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_ALL_ROLES, [], 'fetchMultiple');
            logger.info(`Exiting userService.getAllRoles`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userService.getAllRoles ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get ALl Agency Data
 * @param {Connection} conn The DB Connection Object
 * @returns {Promise.<[]>} Returns All Agency details
 */
export const getAllAgencies = (conn) => {
    logger.info(`Entering userService.getAllAgencies`);
    return new Promise(async (resolve, reject) => {
        try {
            let data = await executeQuery(conn, queryConstants.GET_ALL_AGENCY, [], 'fetchMultiple');
            logger.info(`Exiting userService.getAllAgencies`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userService.getAllAgencies ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Update Role id for an user in an agency
 * @param {Connection} conn The DB Connection Object
 * @param {Number} roleId The Role id to which to update
 * @param {Number} agencyId The Agency id on which to update
 * @param {Number} userid The User id for which to update
 * @returns {Promise.<Boolean>} Returns true if updation is successful
 */
export const updateUserRoleInAgency = (conn, roleId, agencyId, userId) => {
    logger.info(`Entering userSerice.updateUserRoleInAgency`);
    return new Promise(async (resolve, reject) => {
        try {
            await executeQuery(conn, queryConstants.UPDATE_USER_ROLE_IN_AGENCY, [roleId, agencyId, userId], 'update');
            logger.info(`Exiting userSerice.updateUserRoleInAgency`);
            resolve(true);
        } catch (err) {
            logger.error(`Error from userSerice.updateUserRoleInAgency ${err.message}`);
            reject(err);
        }
    });
}

/**
 * Get all User Created Discussions
 * @param {Connection} conn The DB Connection Object
 * @param {String} filter The filter for query
 * @param {Number} limit The limit of query
 * @param {Number} offset The offset of query
 * @param {String} sort The sort for query
 * @returns {Promise.<[]>} Returns all User Created Discussions
 */
export const getUserDiscussions = (conn, filter, limit, offset, userId, sort) => {
    logger.info(`Entering userService.getUserDiscussions`);
    return new Promise(async (resolve, reject) => {
        try {
            let query = queryConstants.GET_USER_DISCUSSIONS;
            let queryParams = [userId, userId, userId, userId, userId];
            if(filter.trim().toLowerCase() == 'answered') {
                query += ` AND NVL(ACM.COMMENT_COUNT, 0) > 0 `;
            } else if (filter.trim().toLowerCase() == 'unanswered') {
                query += ` AND NVL(ACM.COMMENT_COUNT, 0) = 0 `;
            }
            query += ` ORDER BY 
            CASE WHEN PO.CREATED_AT > VP.CREATED_AT
            THEN CASE WHEN PO.CREATED_AT >  NVL(COM.CREATED_AT, PO.CREATED_AT) THEN PO.CREATED_AT ELSE NVL(COM.CREATED_AT, PO.CREATED_AT) END
            ELSE CASE WHEN  NVL(VP.CREATED_AT, PO.CREATED_AT) >  NVL(COM.CREATED_AT, PO.CREATED_AT) THEN  NVL(VP.CREATED_AT, PO.CREATED_AT) ELSE  NVL(COM.CREATED_AT, PO.CREATED_AT) END
            END
            ${sort.trim().toLowerCase() == 'recent' ? ' DESC ' : ' ASC '} LIMIT ? OFFSET ? `;
            queryParams.push(limit, offset);
            let data = await executeQuery(conn, query, queryParams, 'fetchMultiple');
            logger.info(`Exiting userService.getUserDiscussions`);
            resolve(data);
        } catch (err) {
            logger.error(`Error from userService.getUserDiscussions ${err.message}`);
            reject(err);
        }
    });
}

/**
* @param {Connection} conn The DB Connection Object
* @param {User} users The user object from dashboard
 * @returns ""
 */
export const updateAllUsers = (conn , users) => {
    logger.info(`Entering userService.updateAllUsers`);
    return new Promise(async (resolve, reject) => {
        try {
            let userArray = users.map(user => `(${user.userId},  ${getValuesForQuery(user.firstname)}, ${getValuesForQuery(user.lastname)},
             ${getValuesForQuery(user.email)}, ${user.isActive}, ${getValuesForQuery(user.createdAt)}, ${getValuesForQuery(user.lastLogin)},
             ${getValuesForQuery(user.updatedAt)}, ${getValuesForQuery(user.status)}, ${user.isDeleted})`).join(', ');
            let queryParams =[];
            let query = `MERGE INTO USER user
            USING (VALUES ${userArray}) userData(USER_ID, FIRSTNAME, LASTNAME, EMAIL, IS_ACTIVE, CREATED_AT, LAST_LOGIN, UPDATED_AT, STATUS, IS_DELETED)
            ON user.USER_ID = userData.USER_ID
            WHEN MATCHED THEN UPDATE SET 
            user.FIRSTNAME = userData.FIRSTNAME,
            user.LASTNAME = userData.LASTNAME,
            user.EMAIL = userData.EMAIL,
            user.IS_ACTIVE = userData.IS_ACTIVE,
            user.CREATED_AT = userData.CREATED_AT,
            user.LAST_LOGIN = userData.LAST_LOGIN,
            user.UPDATED_AT = userData.UPDATED_AT,
            user.IS_DELETED = userData.IS_DELETED,
            user.STATUS = userData.STATUS
            WHEN NOT MATCHED THEN INSERT (USER_ID,FIRSTNAME, LASTNAME, EMAIL, IS_ACTIVE, CREATED_AT, LAST_LOGIN, UPDATED_AT, STATUS, IS_DELETED) 
            VALUES (userData.USER_ID,userData.FIRSTNAME,userData.LASTNAME, userData.EMAIL, userData.IS_ACTIVE, userData.CREATED_AT, userData.LAST_LOGIN, userData.UPDATED_AT, userData.STATUS, userData.IS_DELETED)`;
            await executeQuery(conn, query, queryParams, 'merge');
            logger.info(`Exiting userService.updateAllUsers`);
            resolve("");
        } catch (err) {
            logger.error(`Error from userService.updateAllUsers ${err.message}`);
            reject(err);
        }
    });
}

/**
 * @param {Connection} conn The DB Connection Object
 * @param {Agency} agencies Agency object from dashboard
 * @returns ""
 */
export const updateAllAgency = (conn , agencies) => {
    logger.info(`Entering userService.updateAllAgency`);
    return new Promise(async (resolve, reject) => {
        try {
            let agencyArray = agencies.map(agency => `(${agency.agencyId}, ${getValuesForQuery(agency.agencyName)}, ${getValuesForQuery(agency.updatedAt)},
             ${getValuesForQuery(agency.createdAt)}, ${getValuesForQuery(agency.agencyType)}, ${agency.leaf}, ${agency.isActive}, 
             ${getValuesForQuery(agency.agencyCode)}, ${agency.agencyGroupId}, ${agency.isSelf})`).join(', ');
            let queryParams = [];
            let query = `MERGE INTO AGENCY agency
            USING (VALUES ${agencyArray}) agencyData(AGENCY_ID, AGENCY_NAME, UPDATED_AT, CREATED_AT, AGENCY_TYPE, LEAF, IS_ACTIVE, AGENCY_CODE, AGENCY_GROUP_ID, IS_SELF)
            ON agency.AGENCY_ID = agencyData.AGENCY_ID
            WHEN MATCHED THEN UPDATE SET 
            agency.AGENCY_NAME = agencyData.AGENCY_NAME,
            agency.AGENCY_TYPE = agencyData.AGENCY_TYPE,
            agency.LEAF = agencyData.LEAF,
            agency.IS_ACTIVE = agencyData.IS_ACTIVE,
            agency.CREATED_AT = agencyData.CREATED_AT,
            agency.AGENCY_CODE = agencyData.AGENCY_CODE,
            agency.UPDATED_AT = agencyData.UPDATED_AT,
            agency.AGENCY_GROUP_ID = agencyData.AGENCY_GROUP_ID,
            agency.IS_SELF = agencyData.IS_SELF
            WHEN NOT MATCHED THEN INSERT (AGENCY_ID, AGENCY_NAME, UPDATED_AT, CREATED_AT, AGENCY_TYPE, LEAF, IS_ACTIVE, AGENCY_CODE, AGENCY_GROUP_ID, IS_SELF) 
            VALUES (agencyData.AGENCY_ID,agencyData.AGENCY_NAME, agencyData.UPDATED_AT, agencyData.CREATED_AT, agencyData.AGENCY_TYPE, agencyData.LEAF, agencyData.IS_ACTIVE, agencyData.AGENCY_CODE, agencyData.AGENCY_GROUP_ID, agencyData.IS_SELF)`;
            await executeQuery(conn, query, queryParams, 'merge');
            logger.info(`Exiting userService.updateAllAgency`);
            resolve("");
        } catch (err) {
            logger.error(`Error from userService.updateAllAgency ${err.message}`);
            reject(err);
        }
    });
}

/**
 * @param {Connection} conn The DB Connection Object
 * @param {UserAgency} userinagency useragency object from dashboard
 * @returns ""
 */
export const updateUserInAgency = (conn , userinagency, type) => {
    logger.info(`Entering userService.updateUserInAgency`);
    return new Promise(async (resolve, reject) => {
        try {
            let userinagencyArray = userinagency.map(user => `(${user.userId}, ${user.agencyId},
            ${user.roleId}, ${user.isActive}, ${getValuesForQuery(user.updatedAt)}, ${getValuesForQuery(user.createdAt)})`).join(', ');
            let queryParams =[];
            let query = `delete from userinagency where`;
            if(type === "single"){
                queryParams = [userinagency[0].userId];
                query += ` user_id = ?`;
            }
            else {
                query += ` id > 0`;
            }
            await executeQuery(conn, query, queryParams, 'delete');

            if(userinagency.length !== 0){
                query = `insert into userinagency(USER_ID, AGENCY_ID, ROLE_ID, IS_ACTIVE, UPDATED_AT, CREATED_AT) (VALUES ${userinagencyArray})`;
                queryParams = [];
                await executeQuery(conn, query, queryParams, 'insert');
            }
            logger.info(`Exiting userService.updateUserInAgency`);
            resolve("");
        } catch (err) {
            logger.error(`Error from userService.updateUserInAgency ${err.message}`);
            reject(err);
        }
    });
}

/**
 * @param {Connection} conn The DB Connection Object
 * @param {UserAgency} roles role object from dashboard
 * @returns ""
 */
 export const updateRoles = (conn , roles) => {
    logger.info(`Entering userService.updateRoles`);
    return new Promise(async (resolve, reject) => {
        try {
            let roleArray = roles.map(role => `(${role.roleId}, ${getValuesForQuery(role.roleName)}, ${role.rolePriority},
                ${getValuesForQuery(role.description)})`).join(', ');
            let queryParams =[];
            let query = "delete from ROLE where role_id > 0";
            await executeQuery(conn, query, queryParams, 'delete');

            query = `insert into role (ROLE_ID, ROLE_NAME, ROLE_PRIORITY, DESCRIPTION) (VALUES ${roleArray})`;
            queryParams = [];
            await executeQuery(conn, query, queryParams, 'insert');
            logger.info(`Exiting userService.updateRoles`);
            resolve("");
        } catch (err) {
            logger.error(`Error from userService.updateRoles ${err.message}`);
            reject(err);
        }
    });
}

/**
 * @param {String} value 
 * @returns query formated string
 */
export const getValuesForQuery = (value) => {
    if(value === ''){ return "''"; }
    return value ? "'" + value.replace(/'/g, "''") + "'" : null
}

/**
 * @param {Connection} conn The DB Connection Object
 * @param {Object} userData 
 * @returns ""
 */
export const updateUserDetails = (conn , userData, type) => {
    logger.info(`Entering userService.updateUserDetails`);
    return new Promise(async (resolve, reject) => {
        try {
            if(type === "inviteUser"){
             let query = `insert into user(USER_ID,FIRSTNAME,LASTNAME,EMAIL,IS_ACTIVE,CREATED_AT,LAST_LOGIN,UPDATED_AT,STATUS , IS_DELETED) 
             values (?,?,?,?,?,?,?,?,?,?)`;
             let queryParams = [userData.userId,userData.firstname, userData.lastname, userData.email,
                userData.isActive, userData.createdAt, userData.lastLogin, userData.updatedAt, userData.status, userData.isDeleted,
                userData.userId];
               await executeQuery(conn, query, queryParams, 'insert');
            } else{
                let query = `update user set 
                FIRSTNAME = ?,
                LASTNAME = ?,
                EMAIL = ?,
                IS_ACTIVE = ?,
                CREATED_AT = ?,
                LAST_LOGIN = ?,
                UPDATED_AT = ?,
                IS_DELETED = ?,
                STATUS = ?
                where USER_ID = ?;`
                let queryParams = [userData.firstname, userData.lastname, userData.email,
                    userData.isActive, userData.createdAt, userData.lastLogin, userData.updatedAt, userData.isDeleted, userData.status,
                    userData.userId];
                await executeQuery(conn, query, queryParams, 'update');
            }
            
            logger.info(`Exiting userService.updateUserDetails`);
            resolve("");
        } catch (err) {
            logger.error(`Error from userService.updateUserDetails ${err.message}`);
            reject(err);
        }
    });
}