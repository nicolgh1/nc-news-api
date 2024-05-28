const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows
    })
}