export class UserInAgency {
    /**
     * @type {Number} the identity column of user in agency table
     */
    id;

    /**
     * @type {Number} the user id
     */
    userId;

    /**
     * @type {Number} the agency id
     */
    agencyId;

    /**
     * @type {Number} the role id
     */
    roleId;

    /**
     * @type {Boolean} Check if user is active or not
     */
    isActive;

    /**
     * @type {String} Last updated timestamp
     */
    updatedAt;

    /**
     * @type {String} the creation timestamp
     */
    createdAt;
}