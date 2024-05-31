const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query('SELECT * FROM topics').then((response) => {
        return response.rows
    })
}

exports.createTopic = (postObj) => {
    const {description, slug} = postObj
    if(!description || !slug){
        return Promise.reject({
            status:400,
            msg: 'Bad Request'
        })
    }
    return db.query(`
    INSERT INTO topics
    (description, slug)
    VALUES ($1,$2)
    RETURNING *;`,[description,slug]).then((response) => {

        return response.rows[0]
    })
}