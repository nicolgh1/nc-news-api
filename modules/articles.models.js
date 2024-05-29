const { response } = require('../app')
const db = require('../db/connection')
const format = require('pg-format')
const { matchArraysOnKey } = require('../db/seeds/utils')

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,[article_id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
        return response.rows[0]
    })
}

exports.selectsArticles = () => {
    return db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author,articles.created_at, articles.votes, articles.article_img_url,
    COALESCE(CAST(countTable.comment_count AS INTEGER),0) AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT COUNT(comment_id) AS comment_count, article_id
        FROM comments
        GROUP BY article_id
    ) countTable
    ON articles.article_id = countTable.article_id
    ORDER BY articles.created_at DESC;
    `).then((response) => {
        return response.rows
    })
}

exports.selectArticleComments = (article_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;`,[article_id])
    .then((response) => {
        return response.rows
    })
}

exports.checkItemExistsInTable = (column_name,item_id,table_name) => {
    const queryText = `SELECT * FROM ${table_name} WHERE ${column_name} = $1`
    return db.query(queryText, [item_id]).then((response) => {
        if(response.rows.length===0){
            return Promise.reject({status: 404, msg:'Not Found'})
        }
    })
}

exports.createComment = (article_id,insertObj) => {
    const {author, body} = insertObj
    return db.query(`
    INSERT INTO comments (article_id,author, body)
    VALUES ($1,$2,$3) RETURNING *;`,[article_id,author,body]).then((response) => {
        return response.rows[0]
    })
}

exports.calculateVotes = (article_id,inc_votes) => {
    const sqlQuery = `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 RETURNING *`
    return db.query(sqlQuery,[inc_votes,article_id]).then((response) => {
        return response.rows[0]
    })
}