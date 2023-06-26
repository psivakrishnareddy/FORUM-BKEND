import { Tags } from '../entity/Tags.js';
import { Category } from '../entity/Category.js';

/**
 * Minimal Data describing a post
 */
export class DiscussionMinimalData {
    /**
     * @type {Number} the identity column of the post table
     */
    id;

    /**
     * @type {String} the title of the post
     */
    title;

    /**
     * @type {String} the description of the post
     */
    description;

    /**
     * @type {Number} the category id of the post
     */
    categoryId;

    /**
     * @type {String} the category name of the post
     */
    categoryName;

    /**
     * @type {Tags[]} the tags list of the post
     */
    tags;

    /**
     * @type {Number} the comunt of the comments of the post
     */
    commentCount;

    /**
     * @type {Number} the vote count of the post
     */
    voteCount;

    /**
     * @type {Boolean} check if the post is voted or not
     */
    voted;

    /**
     * @type {Boolean} check if the post is bookmarked or not
     */
    bookmarked;

    /**
     * @type {Number} the id of the user who created the post
     */
    userId;

    /**
     * @type {String} the name of the user who created the post
     */
    userName;

    /**
     * @type {String} the timestamp of when the post was created
     */
    timestamp;

    /**
     * @type {String} the status of the post
     */
    status;

    /**
     * @type {Number} the count of list of all posts
     */
    totalCount;

    /**
     * @type {Category} the cateogry object of the post
     */
    category;
}