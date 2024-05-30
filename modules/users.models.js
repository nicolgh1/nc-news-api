const { response } = require('../app')
const db = require('../db/connection')
const format = require('pg-format')

exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users`).then((response) => {
        return response.rows
    })
}
exports.selectUserByUsername = (username) => {
    return db.query(`
    SELECT * FROM users WHERE username = $1`,[username]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
        return response.rows[0]
    })
}
