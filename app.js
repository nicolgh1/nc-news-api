const express = require("express")
const app = express()
const {getInstructions,getTopics} = require('./controllers/topics.controllers')
const {getArticles,getArticleById,getArticleComments,postComment,updateVotes,postArticle} = require('./controllers/articles.controllers')
const {getUsers,getUserByUsername} = require('./controllers/users.controllers')
const {deleteComment,updateCommentVotes} = require('./controllers/comments.controllers')

app.use(express.json())

app.get('/api',getInstructions)

app.get('/api/topics', getTopics)

app.get('/api/articles',getArticles)
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles', postArticle)
app.post('/api/articles/:article_id/comments',postComment)

app.patch('/api/articles/:article_id',updateVotes)

app.delete('/api/comments/:comment_id',deleteComment)
app.patch('/api/comments/:comment_id',updateCommentVotes)

app.get('/api/users',getUsers)
app.get('/api/users/:username',getUserByUsername)

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
    if(err.code === '22P02' || err.code === '23502'){
        res.status(400).send({msg: 'Bad Request'})
    }
    if(err.code === '23503'){
        res.status(404).send({msg: 'Not Found'})
    }
    else next(err)
})

app.use((err,req,res,next) => {
    console.log(err)
})
module.exports = app