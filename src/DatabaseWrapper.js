const { Pool } = require('pg');

class PgWorker {
    /**
     * The contructor of the Class
     * 
     * @example
     * const pgConfig = {
     *      user: '',
     *      host: '',
     *      database: '',
     *      password: '',
     *      port: 3211
     * }
     * 
     * @param {Object} pgConfig
     * @param {string} pgConfig.user - User to connect a database.
     * @param {string} pgConfig.host - Host of the postgres.
     * @param {string} pgConfig.database - Specific Database.
     * @param {string} pgConfig.password - Password to connect.
     * @param {number} pgConfig.port - Port to connect.
     */
    constructor(pgConfig) {
        this.pool = new Pool(pgConfig);
    }
}

module.exports = PgWorker;
