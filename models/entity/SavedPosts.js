export class SavedPosts {
    /**
     * @type {Number} the identity record for Saved Posts Table
     */
    id;

    /**
     * @type {Number} the User id
     */
    userId;

    /**
     * @type {Number} the Post Id
     */
    postId;

    /**
     * @type {Boolean} Check if the record is deleted
     */
    isDeleted;

    /**
     * @type {String} Time at which the post is saved 
     */
    savedAt;
}