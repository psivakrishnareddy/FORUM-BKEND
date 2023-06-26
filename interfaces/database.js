export class IDatabase {
    /**
     * @return {Promise.<IConnection>} provides the Connection Object
     */
     openConnection

    /**
     * @type {IConnection} the Connection Object
     */
    connection;

     /**
     * @param {Promise.<IConnection>} connection the Connection Object
     */
    constructor(connection) {
        this.connection = connection;
    }
}

export class IConnection {
    /**
     * @return {Promise.<IConnection>} Perform a Query Operation
     */
    query

    /**
     * @return {Promise.<IConnection>} Transaction initiated Connection Object
     */
    beginTransaction

    /**
     * @return {Promise.<IConnection>} Commit a Transaction
     */
     commitTransaction

    /**
     * @return {Promise.<IConnection>} Rollback a Transaction
     */
    rollbackTransaction

    /**
     * @return {Promise.<IConnection>} close a Connection
     */
    close

    /**
     * @param {String} query The query to be ran
     * @param {any[]} queryParams The params of the query
     * @param {(err, result)} callback Callback Function
     */
    query
}