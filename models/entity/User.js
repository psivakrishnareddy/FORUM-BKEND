export class User {
    /**
     * @type {Number} the identity column of the user table
     */
    userId;

    /**
     * @type {String} first name of the user
     */
    firstname;

    /**
     * @type {String} last name of the user
     */
    lastname;

    /**
     * @type {String} email of the user
     */
    email;

    /**
     * @type {Boolean} Check if user is active or not
     */
    isActive;

    /**
     * @type {String} User creation timestamp
     */
    createdAt;

    /**
     * @type {String} User's last login timestamp
     */
    lastLogin;

    /**
     * @type {String} User's last updation timestamp
     */
    updatedAt;

    /**
     * @type {String} User's status
     */
    status;

    /**
     * @type {Boolean} Check if user is deleted or not
     */
    isDeleted;
}