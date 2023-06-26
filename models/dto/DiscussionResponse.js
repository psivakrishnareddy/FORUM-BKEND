import { DiscussionData } from './DiscussionData.js';

/**
 * Response Object for fetching bulk discussions
 */
export class DiscussionResponse {
    /**
     * @type {Number} the total count of records
     */
    totalCount;

    /**
     * @type {DiscussionData[]} the list of minimal data of discussions
     */
    discussionData;
}