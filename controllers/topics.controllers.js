const app = require('../app')
const db = require('../db/connection')
const topicData = require('../db/data/test-data/index')
const {selectTopics} = require('../modules/topics.models')

exports.getTopics = (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch(next)
}