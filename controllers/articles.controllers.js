const app = require('../app')
const db = require('../db/connection')
const articles = require('../db/data/test-data/articles')
const comments = require('../db/data/test-data/comments')
const articleData = require('../db/data/test-data/index')
const {selectsArticles,selectArticleById,selectArticleComments,checkItemExistsInTable} = require('../modules/articles.models')

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

exports.getArticleComments = (req,res,next) => {
    const {article_id} = req.params
    const promises = [selectArticleComments(article_id)]
    if(article_id){
        promises.push(checkItemExistsInTable('article_id',article_id,'articles'))
    }
    Promise.all(promises).then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    }).catch(next)
}