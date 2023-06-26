import { FeedbackData } from './FeedbackData.js';


/**
 * Contains Complete single comment Data
 */
export class CommentData {
    /**
     * @type {Number} the identity column of the comment table
     */
    id;

    /**
     * @type {Number} the user id
     */
    userId;

    /**
     * @type {Number} the user name
     */
    userName;

    /**
     * @type {Number} the post id
     */
    postId;

    /**
     * @type {String} the description of the comment
     */
    description;

    /**
     * @type {Boolean} Check if the comment is deleted or not
     */
    deleted;

    /**
     * @type {String} Timestamp of the coment
     */
    createdAt;

    /**
     * @type {Boolean|null} Check if the comment is useful or not
     */
    isUseful;

    /**
     * @type {String} the feedback of the comment
     */
    feedback;

    /**
     * @type {FeedbackData} the feedback data of the comment
     */
    feedbackData;
}