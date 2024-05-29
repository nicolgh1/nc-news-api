const app = require('../app')
const db = require('../db/connection')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data/index')
const {selectUsers} = require('../modules/users.models')

exports.getUsers = (req,res,next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })  
}