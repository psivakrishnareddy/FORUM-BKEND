import { AgencyData, IndependentUserData, RoleData } from '../models/dto/UserData.js';
import { DiscussionMinimalData } from '../models/dto/DiscussionMinimalData.js';
import { CategoryCountData } from '../models/dto/CategoryCountData.js';
import { StatusCountData } from '../models/dto/StatusCountData.js';
import { DiscussionData } from '../models/dto/DiscussionData.js';
import { parseDate } from './DateTimeUtility.js';
import { FeedbackData } from '../models/dto/FeedbackData.js';
import { CommentData } from '../models/dto/CommentData.js';
import { Tags } from '../models/entity/Tags.js';
import { NotificationData } from '../models/dto/NotificationData.js';


/**
 * Populate the User Details from database records of user table
 * @param {{}} user the user object obtained from database
 * @returns {IndependentUserData} The user object
 */
export const populateUserDetails = (user) => {
    let data = {
        userId: user.USER_ID, 
        firstName: user.FIRSTNAME, 
        lastName: user.LASTNAME, 
        email: user.EMAIL, 
        active: user.IS_ACTIVE, 
        createdAt: new Date(user.CREATED_AT), 
        timestamp: new Date(user.CREATED_AT),
        lastLogin: user.LAST_LOGIN, 
        updatedAt: user.UPDATED_AT, 
        status: user.STATUS, 
        deleted: user.IS_DELETED
    } 
    return data;
}

/**
 * Populate the Agency Details from database records of agency and role table
 * @param {{}} agencyDetails the agency object obtained from database
 * @param {{}} roleDetails the role object obtained from database
 * @returns {AgencyData} the Agency data
 */
export const populateAgencyDetails = (agencyDetails, roleDetails) => {
    let data = !agencyDetails ? {} : {
        agencyId: agencyDetails.AGENCY_ID, 
        agencyName: agencyDetails.AGENCY_NAME, 
        updatedAt: agencyDetails.UPDATED_AT, 
        createdAt: new Date(agencyDetails.CREATED_AT), 
        timestamp: new Date(agencyDetails.CREATED_AT),
        agencyType: agencyDetails.AGENCY_TYPE, 
        leaf: agencyDetails.LEAF, 
        active: agencyDetails.IS_ACTIVE, 
        agencyCode: agencyDetails.AGENCY_CODE, 
        agencyGroupId: agencyDetails.AGENCY_GROUP_ID, 
        self: agencyDetails.IS_SELF, 
        streetAddress: agencyDetails.STREETADDRESS, 
        city: agencyDetails.CITY, 
        state: agencyDetails.STATE, 
        zipcode: agencyDetails.ZIPCODE,
        role: !roleDetails ? {} : {
            roleId: roleDetails.ROLE_ID, 
            roleName: roleDetails.ROLE_NAME, 
            rolePriority: roleDetails.ROLE_PRIORITY, 
            description: roleDetails.DESCRIPTION
        }
    }
    return data;    
}

/**
 * Populate the Role Details from database records of role table
 * @param {{}} roleDetails the role object obtained from database
 * @returns {RoleData} the role data
 */
export const populateRoleDetails = (roleDetails) => {
    let data = !roleDetails ? {} : {
        roleId: roleDetails.ROLE_ID, 
        roleName: roleDetails.ROLE_NAME, 
        rolePriority: roleDetails.ROLE_PRIORITY, 
        description: roleDetails.DESCRIPTION
    }
    return data;
}

/**
 * Populate the notification Details from database records of notifications table
 * @param {{}} noti the notification object obtained from database
 * @returns {NotificationData} the role data
 */
 export const populateNotificationDetails = (noti) => {
    let data = {
        id: noti.ID, 
        userId: noti.USER_ID, 
        postId: noti.POST_ID, 
        description: noti.DESCRIPTION, 
        triggerTime: parseDate(noti.TRIGGER_TIME), 
        read: noti.IS_READ
    }
    return data;
}

/**
 * Populate the Discussion Details from database records of posts table
 * @param {{}} result the post details object obtained from database
 * @returns {DiscussionMinimalData} the discussion minimal data
 */
export const populateMinimalDiscussionData = (result) => {
    let data = {
        id: result.ID,
        title: result.TITLE,
        description: Buffer.from(result.DESCRIPTION).toString(),
        categoryId: result.CATEGORY_ID,
        categoryName: result.CATEGORY,
        tags: result.TAGS.split('//'),
        commentCount: result.COMMENT_COUNT,
        voteCount: result.VOTE_COUNT,
        voted: result.IS_VOTED,
        bookmarked: result.IS_BOOKMARKED,
        userId: result.USER_ID,
        userName: result.USER_NAME,
        timestamp: parseDate(result.CREATED_AT),
        status: result.STATUS,
        totalCount: result.TOTAL_COUNT,
        category: {
            id: result.CATEGORY_ID,
            name: result.CATEGORY
        }
    };
    return data;
}  

/**
 * Populate the Category Details along count from database records of Category table
 * @param {{}} result the category details object obtained from database
 * @returns {CategoryCountData} the Category and count data
 */
export const populateCategoryData = (result) => {
    let data = {
        id: result.ID,
        name: result.NAME,
        count: result.COUNT
    }
    return data;
}

/**
 * Populate the status Details along count from database records of status table
 * @param {{}} result the status details object obtained from database
 * @returns {StatusCountData} the status and count data
 */
 export const populateStatusData = (result) => {
    let data = {
        id: result.ID,
        status: result.STATUS,
        count: result.COUNT
    }
    return data;
}

/**
 * Populate the inital post Details from database records of posts table
 * @param {{}} discussionData the post details object obtained from database
 * @returns {DiscussionData} the post details data
 */
 export const populateInitialPostData = (discussionData) => {
    let data = {
        postId: discussionData.ID, 
        title: discussionData.TITLE, 
        description: Buffer.from(discussionData.DESCRIPTION).toString(), 
        createdAt: parseDate(discussionData.CREATED_AT), 
        timestamp: parseDate(discussionData.CREATED_AT),
        userId: discussionData.USER_ID, 
        categoryId: discussionData.CATEGORY_ID, 
        closed: discussionData.IS_CLOSED, 
        lastUpdatedUserId: discussionData.LAST_UPDATED_USER_ID, 
        isDeleted: discussionData.IS_DELETED, 
        statusId: discussionData.STATUS_ID, 
        faq: discussionData.IS_FAQ, 
        reported: discussionData.IS_REPORTED
    }
    return data;
}

/**
 * Populate the feedback for comment's Details from database records of answersFeedback table
 * @param {{}} feedback the feedback details object obtained from database
 * @returns {FeedbackData} the feedback data
 */
 export const populateFeedbackForAComment= (feedback) => {
    let data = {
        id: feedback.ID,
        userId: feedback.USER_ID,
        commentId: feedback.COMMENT_ID,
        isUseful: feedback.IS_USEFUL,
        feedback: feedback.FEEDBACK,
        userName: feedback.USER_NAME
    }
    return data;
}

/**
 * Populate the comment Details from database records of comments table
 * @param {{}} comment the comment details object obtained from database
 * @param {FeedbackData[]} feedbackData the list of feedback data for the comment
 * @returns {CommentData} the feedback data
 */
 export const populateCommentForAPost = (comment, feedbackData) => {
    let data = {
        id: comment.ID,
        userId: comment.USER_ID,
        userName: comment.USER_NAME,
        postId: comment.POST_ID,
        description: Buffer.from(comment.DESCRIPTION_AS_BYTE).toString(),
        createdAt: parseDate(comment.CREATED_AT),
        timestamp: parseDate(comment.CREATED_AT),
        isDeleted: comment.IS_DELETED,
        isUseful: comment.IS_USEFUL,
        feedback: comment.FEEDBACK,
        feedbackData: feedbackData
    }
    return data;
}

/**
 * Populate the tags Details from database records of tags table
 * @param {{}} tag the tag details object obtained from database
 * @returns {Tags} the tag data
 */
 export const populateTagsForAPost = (tag) => {
    let data = {
        id: tag.ID,
        postId: tag.POST_ID,
        tagName: tag.TAG_NAME,
        isDeleted: tag.IS_DELETED
    }
    return data;
}