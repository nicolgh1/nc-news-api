const app = require('../app')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const { calculateVotes } = require('../modules/articles.models')

const {removeComment,calculateCommentVotes} = require('../modules/comments.models')



exports.deleteComment = (req,res,next) => {
    const {comment_id} = req.params
    removeComment(comment_id).then((msg)=> {
        console.log(msg,'msg')
        res.status(204).send({msg})
    }).catch(next)
}

exports.updateCommentVotes = (req,res,next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    calculateCommentVotes(comment_id,inc_votes).then((comment) => {
        res.status(200).send({comment})
    }).catch(next)
}