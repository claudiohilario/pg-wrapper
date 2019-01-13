# PG Wrapper
[![Build Status](https://travis-ci.org/claudiohilario/pg-wrapper.svg?branch=master)](https://travis-ci.org/claudiohilario/pg-wrapper) [![Coverage Status](https://coveralls.io/repos/github/claudiohilario/pg-wrapper/badge.svg?branch=master)](https://coveralls.io/github/claudiohilario/pg-wrapper?branch=master)

# Usage Example

```js 
  const config = {
    user: 'postgres',
    password: 'vvnotes2019',
    database: 'vvnotes',
    host: 'localhost',
    port: 5432,
  }
  
  const pgClient = require('./src/index');
  global.poolDb = pgClient(config);
  
```

## Execute simple queries

```js
  const query = 'SELECT * FROM users WHERE uuid = $1';
  const queryParams = ['00000000-0000-0000-0000-000000000000'];
  poolDb.query(query, queryParams)
```

## Execute transaction

```js
  const transactionClient = await poolDb.startTransaction();

  try {
    await poolDb.query(query, queryParams, transactionClient);
    await poolDb.query(query1, queryParams1, transactionClient);
    await poolDb.query(query1, queryParams1, transactionClient);
    poolDb.endTransaction(undefined, transactionClient);
  } catch(err) {
    poolDb.endTransaction(err, transactionClient);
  }
```
