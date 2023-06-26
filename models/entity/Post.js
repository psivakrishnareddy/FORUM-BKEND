export class Post {
    /**
     * @type {Number} The identity record of the post table
     */
    id;

    /**
     * @type {String} The title of the post
     */
    title;

    /**
     * @type {String} The Description of the post
     */
    description;

    /**
     * @type {String} The Timestamp of creation of the post
     */
    createdAt;

    /**
     * @type {Number} The User Id
     */
    userId;

    /**
     * @type {Number} the Category Id
     */
    categoryId;

    /**
     * @type {Boolean} Check if post is closed or not
     */
    isClosed;

    /**
     * @type {Number} Last updated user's Id
     */
    lastUpdatedUserId;

    /**
     * @type {Boolean} Check if post is deleted or not
     */
    isDeleted;

    /**
     * @type {Number} status Id of the post
     */
    statusId;

    /**
     * @type {Boolean} Check if post is FAQ or not
     */
    isFaq;

    /**
     * @type {Boolean} Check if post is reported or not
     */
    isReported;
}