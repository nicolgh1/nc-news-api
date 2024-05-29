const app = require('../app')
const db = require('../db/connection')
const articles = require('../db/data/test-data/articles')
const articleData = require('../db/data/test-data/index')
const {selectsArticles,selectArticleById} = require('../modules/articles.models')

exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}

exports.getArticles = (req,res,next) => {
    selectsArticles().then((articles) => {
        res.status(200).send({articles})
    }).catch(next)
}