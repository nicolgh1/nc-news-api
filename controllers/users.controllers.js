const app = require('../app')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const {selectUsers,selectUserByUsername} = require('../modules/users.models')

exports.getUsers = (req,res,next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })  
}
exports.getUserByUsername = (req,res,next) => {
    const {username} = req.params
    selectUserByUsername(username).then((user) => {
        res.status(200).send({user})
    }).catch(next)
}
