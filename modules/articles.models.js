const { response } = require('../app')
const db = require('../db/connection')
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