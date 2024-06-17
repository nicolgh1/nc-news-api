const cors = require('cors')
const express = require("express")
const app = express()


const apiRouter = require('./routes/api-router')
const usersRouter = require('./routes/users-router')
const topicsRouter = require('./routes/topics-router')
const articlesRouter = require('./routes/articles-router')
const commentsRouter = require('./routes/comments-router')

app.use(express.json())

app.use('/api', apiRouter)

app.use('/api/topics', topicsRouter)

app.use('/api/articles', articlesRouter)

app.use('/api/comments', commentsRouter)

app.use('/api/users', usersRouter)

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
    if(err.code === '23503' && err.detail.includes('referenced')){
        res.status(400).send({msg: 'Article Referenced in other tables'})
    }
    else if(err.code === '23503'){
        res.status(404).send({msg:'Not Found'})
    }
    else next(err)
})

app.use((err,req,res,next) => {
    console.log(err)
})
module.exports = app