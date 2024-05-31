const app = require('../app')
const db = require('../db/connection')
const topicData = require('../db/data/test-data/index')
const {selectTopics,createTopic} = require('../models/topics.models')

exports.getTopics = (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch(next)
}
exports.postTopic = (req,res,next) => {
    const postObj = req.body
    createTopic(postObj).then((topic) => {
        res.status(201).send({topic})
    }).catch(next)
}