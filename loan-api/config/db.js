const { Pool } = require('pg');

let pool;

const connectDB = async () => {
    if (!pool) {
        pool = new Pool({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            password: process.env.PG_PASSWORD,
            port: process.env.PG_PORT,
            max: 5, 
        });
    }

    try {
        const client = await pool.connect();
        console.log('PostgreSQL Connected...');
        client.release(); 
    } catch (err) {
        console.error('Database Connection Error:', err.message);
        process.exit(1); 
    }
};

module.exports = {
    query: (text, params) => {
        if (!pool) {
            throw new Error('Database pool not initialized.');
        }
        return pool.query(text, params);
    },
    connectDB
};