const express = require("express")
const app = express()
const {getInstructions,getTopics} = require('./controllers/topics.controllers')
const {getArticles,getArticleById,getArticleComments} = require('./controllers/articles.controllers')

app.get('/api',getInstructions)

app.get('/api/topics', getTopics)

app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.all('*', (req, res) => {
    res.status(404).send({msg: "Route not found"})
})
app.use((err, req, res, next)=>{
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    }
    else next(err)
})

app.use((err,req,res,next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'Bad Request'})
    }
    else next(err)
})

app.use((err,req,res,next) => {
    console.log(err)
})
module.exports = app