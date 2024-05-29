const express = require("express")
const app = express()
app.use(express.json())
const {getInstructions,getTopics} = require('./controllers/topics.controllers')
const {getArticles,getArticleById} = require('./controllers/articles.controllers')

app.get('/api',getInstructions)

app.get('/api/topics', getTopics)

app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticleById)

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