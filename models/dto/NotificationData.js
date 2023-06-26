export class NotificationData {
    /**
     * @type {Number} the identity column of the Notifications Table
     */
    id;

    /**
     * @type {Number} the user id
     */
    userId;

    /**
     * @type {Number} the post id
     */
    postId;

    /**
     * @type {String} the description of the notification
     */
    description;

    /**
     * @type {String} the trigger time of the notification
     */
    triggerTime;

    /**
     * @type {Boolean} Check if the notification is read or not
     */
    read;
}