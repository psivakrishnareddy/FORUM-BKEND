import { Category } from '../entity/Category.js';
import { Tags } from '../entity/Tags.js';
import { CommentData } from './CommentData.js';

/**
 * Contains Complete Discussion Data
 */
export class DiscussionData {
    /**
     * @type {Number} the post id
     */
    postId;

    /**
     * @type {String} the title of the post
     */
    title;

    /**
     * @type {String} the description of the post
     */
    description;

    /**
     * @type {String} the timestamp of post creation
     */
    timestamp;

    /**
     * @type {String} the user name of the user who created the post
     */
    userName;

    /**
     * @type {Category} the category object of the post
     */
    category;

    /**
     * @type {Boolean} check if the post is closed or not
     */
    closed;

    /**
     * @type {String} The Status of the object
     */
    status;

    /**
     * @type {Boolean} Check if the post is FAQ
     */
    faq;

    /**
     * @type {Boolean} Check if the post is reported
     */
    reported;

    /**
     * @type {Tags[]} List of tags attached to the post
     */
    tags;

    /**
     * @type {Boolean} Check if the post is bookmarked
     */
    bookmarked;

    /**
     * @type {CommentData[]} List of comment data for the post
     */
    comments;

    /**
     * @type {Number} VoteCount of the post
     */
    voteCount;

    /**
     * @type {Boolean} Check if the post is voted
     */
    voted;

    /**
     * @type {Number} User id of the post
     */
    userId;
}