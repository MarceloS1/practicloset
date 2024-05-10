const { Pool } = require('pg');

class Database {
    constructor() {
        if (!Database.instance) {
            Database.instance = new Pool({
                user: 'Marcelo',
                host: '25.56.40.70',
                database: 'practicloset_db',
                password: 'Passw0rd',
                port: 5433,
            });
        }
    }

    getPool() {
        return Database.instance;
    }
}

module.exports = new Database().getPool();