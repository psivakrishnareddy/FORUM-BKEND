/**
 * Contains all user related data
 */
export class UserData {
    /**
     * @type {IndependentUserData} the User details
     */
    user;

    /**
     * @type {RoleData|{}|null} the role details
     */
    role;

    /**
     * @type {AgencyData[]} list of agency data for the user
     */
    agency;
}

/**
 * Contains the user data
 */
export class IndependentUserData {
    /**
     * @type {Number} the User Id
     */
    userId;

    /**
     * @type {String} the first name of the user
     */
    firstName;

    /**
     * @type {String} the last name of the user
     */
    lastName;

    /**
     * @type {String} the email of the user
     */
    email;

    /**
     * @type {Boolean} Check if user is active or not
     */
    active;

    /**
     * @type {String} the user creation timestamp
     */
    createdAt;

    /**
     * @type {String} the user creation timestamp
     */
    timestamp;

    /**
     * @type {String} the last login timestamp
     */
    lastLogin;

    /**
     * @type {String} the last updated at timestamp
     */
    updatedAt;

    /**
     * @type {String} the Status of the user
     */
    status;

    /**
     * @type {Boolean} Check if the user is deleted or not
     */
    deleted;
}

/**
 * Contains the role data specific to the agency
 */
export class RoleData {
    /**
     * @type {Number} The Identity column of the role table
     */
    roleId;

    /**
     * @type {String} The name of the role
     */
    roleName;

    /**
     * @type {Number} The role priority
     */
    rolePriority;

    /**
     * @type {String} The description of the role
     */
    description;
}

export class AgencyData {
    /**
     * @type {Number} The identity column of the agency table
     */
    agencyId;

    /**
     * @type {String} The name of the agency
     */
    agencyName;

    /**
     * @type {String} The Timestamp of updation of agency
     */
    updatedAt;

    /**
     * @type {String} The timestamp of agency creation
     */
    createdAt;

    /**
     * @type {String} The timestamp of agency creation
     */
    timestamp;

    /**
     * @type {String} The type of the agency
     */
    agencyType;

    /**
     * @type {Boolean} The leaf of agency
     */
    leaf;

    /**
     * @type {Boolean} Check if agency is active or not
     */
    active;

    /**
     * @type {Number} The agency code
     */
    agencyCode;

    /**
     * @type {Number} The agency gorup id
     */
    agencyGroupId;

    /**
     * @type {Boolean} is Self agency
     */
    self;

    /**
     * @type {String} The street address of the agency
     */
    streetAddress;

    /**
     * @type {String} The city of the agency
     */
    city;

    /**
     * @type {String} The state of the agency
     */
    state;

    /**
     * @type {Number} The zipcode of the agency
     */
    zipcode;

    /**
     * @type {RoleData|{}|null} The role of the user in the agency
     */
    role;
}