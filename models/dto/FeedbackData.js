/**
 * Contains Complete feedback Data for a comment
 */
export class FeedbackData {
    /**
     * @type {Number} the identity column of the feedback table data
     */
    id;

    /**
     * @type {Number} Feedback's User Id
     */
    userId;

    /**
     * @type {String} Feedback's User Name
     */
    userName;

    /**
     * @type {Boolean} Is a Useful Feedback or not
     */
    isUseful;

    /**
     * @type {String} The feedback
     */
    feedback;
}