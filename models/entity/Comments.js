export class Comments {
    /**
     * @type {Number} The identity record of the comments table
     */
    id;

    /**
     * @type {Number} The user Id
     */
    userId;

    /**
     * @type {Number} The Post id
     */
    postId;

    /**
     * @type {String} The Description of the comment
     */
    description;

    /**
     * @type {Boolean} Check is deleted
     */
    isDeleted;

    /**
     * @type {String} The Created at timestamp
     */
    createdAt;
}
