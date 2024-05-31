const { response } = require('../app')
const db = require('../db/connection')
const format = require('pg-format')

exports.removeComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1 RETURNING *`,[comment_id]).then((response) => {
        if(response.rows.length === 1){
            return 'Comment deleted'
        }
        else return Promise.reject({status: 404, msg: 'Not Found'})
    })
}

exports.calculateCommentVotes = (comment_id,inc_votes) => {
    const sqlQuery = `
    UPDATE comments 
    SET votes = votes + $1 
    WHERE comment_id = $2 RETURNING *`
    return db.query(sqlQuery,[inc_votes,comment_id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
        return response.rows[0]
    })
}