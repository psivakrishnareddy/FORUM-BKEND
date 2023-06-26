export class Notifications {
    /**
     * @type {Number} The Identity Record of the Notifications Table
     */
    id;

    /**
     * @type {Number} The User Id
     */
    userId;

    /**
     * @type {Number} The Post Id
     */
    postId;

    /**
     * @type {String} The Description of the notification
     */
    description;

    /**
     * @type {String} The Trigger time of the notification
     */
    triggerTime;

    /**
     * @type {Boolean} Check if the notification is read or not
     */
    isRead;
}
