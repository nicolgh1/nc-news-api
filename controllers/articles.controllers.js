const app = require('../app')
const db = require('../db/connection')
const articleData = require('../db/data/test-data/index')
const {selectArticleById} = require('../modules/articles.models')

exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}