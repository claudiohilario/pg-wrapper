/**
 * This file is a wrapper to interact with database (Postgres).
 */
const { Pool } = require('pg');

/**
 * Example of the use.
 * const pgPoolClient = require('./services/db');
 *
 * const config = {
 *   user: 'postgres',
 *   password: 'postgres',
 *   database: 'postgres',
 *   host: 'localhost',
 *   port: 5432,
 * }
 * global.poolDb = pgPoolClient(config);
 */
// eslint-disable-next-line func-names
module.exports = function (configs) {
  const pool = new Pool(configs);

  /**
   * This function allows execute the specific sql query.
   *
   * @example
   * const query = 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *';
   * const values = ['name', 'email@domain.com']
   * poolDb.query(query, values);
   *
   * @param {string} text - The string to be used on the query sql.
   * E.g.: 'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *'
   * @param {Array} values - Array to pass params to query sql.
   * E.g.: ['name', 'email@domain.com']
   * @param {Object} client - The client to run the query. Used for transactions.
   *
   * @returns {Promise} - Resolves with the query result or rejects with one error.
   */
  function query(text, values, client = null) {
    if (client) {
      return client.query(text, values);
    }
    return pool.query(text, values);
  }

  /**
   * This function is used to start a transaction and return the client of the
   * transaction.
   *
   * @example
   * const clientOfTheTransaction = await poolDb.startTransaction();
   *
   * @returns {Promise} Resolves with client of the transaction.
   */
  async function startTransaction() {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
  }

  /**
   * This function is used to end a transaction.
   * If an error has been passed, exetute ROLLBACK.
   *
   * @example
   * const clientOfTheTransaction = await poolDb.startTransaction();
   * const res1 = await poolDb.query('SELECT NOW()', [], clientOfTheTransaction);
   * const res2 = await poolDb.query('SELECT NOW()', [], clientOfTheTransaction);
   * await poolDb.endTransaction(undefined, clientOfTheTransaction)
   *
   * @param {Object} error - The error, is used to execure ROLLBACK.
   * @param {Object} client - The client of the transaction.
   *
   * @returns {Promise} Resolves with client of the transaction.
   */
  async function endTransaction(error, client) {
    await client.query(error ? 'ROLLBACK' : 'COMMIT');
    return client.release();
  }

  return {
    query,
    startTransaction,
    endTransaction,
  };
};