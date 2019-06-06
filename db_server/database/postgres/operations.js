const express = require('express');
const router = express.Router();
const pool = require('./db');

//Do not use pool.query if you need transactional integrity
pool.query("select * from employees")
    .then(result => {
        console.table(result.rows)
    });

async function createTable(tableName){

    const client = await pool.connect();

    const createTableText = `CREATE TABLE IF NOT EXISTS ${tableName} (data JSONB);`;
    console.log(createTableText);
    await client.query('BEGIN');
    await client.query(createTableText);
    await client.query('COMMIT');
    await client.release();
}

async function insertIntoTable(tableName, entry){
    const client = await pool.connect();

    await client.query('BEGIN');
    client.query(`INSERT INTO ${tableName}(data) VALUES($1)`, [entry]);
    await client.query('COMMIT');
    await client.release();
}


router.get('/klaus', function(req,res,next){
    pool.query(`select data from users where data ->> 'name' = 'klaus'`)
        .then(result => {
            console.table(result.rows)
        });
    res.send('funno')
});


module.exports = {
    createTable,
    insertIntoTable
};
