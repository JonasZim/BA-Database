const { Pool } = require('pg');

const pool = new Pool({
    user:'postgres',
    database: 'test',
    host: 'jonaszim.local',
    password: 'postgres',
    port: 5432,
});

function query(text,params){
    const start = Date.now();
    return pool.query(text, params)
        .then(res => {
            const duration = Date.now() - start;
            console.log('executed query', { text, duration, rows: res.rowCount });
            return res;
        })
        .catch(err => console.error('Error executing query', err.stack))
}

function connect(){
    return pool.connect();
}

module.exports = {
    query,
    connect
};