const { response } = require('../app')
const db = require('../db/connection')
const format = require('pg-format')

exports.selectArticleById = (article_id) => {
    const sqlQuery = `
    SELECT articles.*,
    COALESCE(CAST(countTable.comment_count AS INTEGER),0) AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT COUNT(comment_id) AS comment_count, article_id
        FROM comments
        GROUP BY article_id
    ) countTable
    ON articles.article_id = countTable.article_id
    WHERE articles.article_id = $1
    `
    return db.query(sqlQuery,[article_id]).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: 'Not Found'
            })
        }
        return response.rows[0]
    })
}

exports.selectsArticles = (topic = 'none', sort_by = 'created_at', order = 'DESC', limit = 10, p = 1) => {
    let sqlQuery = `SELECT articles.article_id, articles.title, articles.topic, articles.author,articles.created_at, articles.votes, articles.article_img_url,
    COALESCE(CAST(countTable.comment_count AS INTEGER),0) AS comment_count
    FROM articles
    LEFT JOIN (
        SELECT COUNT(comment_id) AS comment_count, article_id
        FROM comments
        GROUP BY article_id
    ) countTable
    ON articles.article_id = countTable.article_id`

    const queryValues = [];
    const validSortByQueries = ['author','title','article_id','topic','created_at','votes','article_img_url','comment_count']
    const validOrderQueries = ["ASC", "asc", "DESC", "desc"]

    if(!validSortByQueries.includes(sort_by)){
        return Promise.reject({status:400,msg:'Bad Request'})
    }
    if(!validOrderQueries.includes(order)){
        return Promise.reject({status:400,msg:'Bad Request'})
    }

    if(topic!=='none'){
        sqlQuery += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }

    if(sort_by){
        sqlQuery += ` ORDER BY articles.${sort_by}`
    }

    if(order){
        sqlQuery += ` ${order}`
    }

    const offset = (p-1)*limit
    sqlQuery += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
    queryValues.push(limit, offset)

    return db.query(sqlQuery,queryValues).then((response) => {
        if(response.rows.length === 0){
            return Promise.reject({status:404, msg: 'Not Found'})
        }
        return response.rows
    })
}

exports.selectArticleComments = (article_id,limit = 10,p = 1) => {
    let queryValues = [article_id]
    let sqlQuery = `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`

    const offset = (p-1)*limit
    sqlQuery += ` LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
    queryValues.push(limit, offset)

    return db.query(sqlQuery,queryValues)
    .then((response) => {
        if(p>1 && response.rows.length === 0){
            return Promise.reject({status:404, msg: 'Not Found'})
        }
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

exports.createArticle = (postObj) => {
    const {title,topic,author,body,article_img_url} = postObj
    return db.query(`
    INSERT INTO articles 
    (title,topic,author,body,article_img_url) 
    VALUES ($1,$2,$3,$4,$5) 
    RETURNING *;`,[title,topic,author,body,article_img_url]).then((response) => {
        return response.rows[0]
    })
}
exports.removeArticle = (article_id) => {
    return db.query(`
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;`, [article_id]).then((response) => {
        if(response.rows.length === 1){
            return 'Article Deleted'
        }
        else return Promise.reject({
            status:400,
            msg: 'Bad Request'
        })
    })
}

