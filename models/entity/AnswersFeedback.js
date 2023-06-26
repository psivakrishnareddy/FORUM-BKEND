export class AnswersFeedback {
    /**
     * @type {Number} The identity column of the record
     */
    id;

    /**
     * @type {Number} The User Id of the feedback
     */
    userId;

    /**
     * @type {Number} The Comment Id for the feedback
     */
    commentId;

    /**
     * @type {Boolean} Is Useful Feedback
     */
    isUseful;

    /**
     * @type {String} Feedback for the comment
     */
    feedback;
}