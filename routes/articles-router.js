const {getArticles,getArticleById,getArticleComments,postComment,updateVotes,postArticle,deleteArticle} = require('../controllers/articles.controllers')

const articlesRouter = require('express').Router();

articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(updateVotes)
    .delete(deleteArticle)

articlesRouter
    .route('/:article_id/comments')
    .get(getArticleComments)
    .post(postComment)  

module.exports = articlesRouter