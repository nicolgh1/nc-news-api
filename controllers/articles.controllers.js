const app = require('../app')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')

const {selectsArticles,selectArticleById,selectArticleComments,checkItemExistsInTable,createComment,calculateVotes,createArticle,removeArticle} = require('../modules/articles.models')

exports.getArticleById = (req,res,next) => {
    const article_id = req.params.article_id
    selectArticleById(article_id).then((article) => {
        res.status(200).send({article})
    }).catch(next)
}

exports.getArticles = (req,res,next) => {
    const {topic,sort_by,order} = req.query
    selectsArticles(topic,sort_by,order).then((articles) => {
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

exports.postComment = (req,res,next) => {
    const insertObj = req.body
    const {article_id} = req.params
    createComment(article_id,insertObj).then((comment) => {
        res.status(201).send({comment})
    }).catch(next)
}

exports.updateVotes = (req,res,next) => {
    const {inc_votes} = req.body
    const {article_id} = req.params
    const promises = [calculateVotes(article_id,inc_votes)]
    if(article_id){
        promises.push(checkItemExistsInTable('article_id',article_id,'articles'))
    }
    Promise.all(promises).then((resolvedPromises) => {
        const article = resolvedPromises[0]
        res.status(200).send({article})
    }).catch(next)
}
exports.postArticle = (req,res,next) => {
    const postObj = req.body
    createArticle(postObj).then((article) => {
        res.status(201).send({article})
    }).catch(next)
}

exports.deleteArticle = (req,res,next) => {
    const {article_id} = req.params
    removeArticle(article_id).then((msg) => {
        res.status(204).send({})
    }).catch(next)
}
