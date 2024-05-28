const app = require('../app')
const db = require('../db/connection')
const topicData = require('../db/data/test-data/index')
const {selectInstructions, selectTopics} = require('../modules/topics.models')

exports.getInstructions = (req,res,next) => {
    selectInstructions().then((instructions) => {
        res.status(200).send({instructions})
    }).catch(next)
}
exports.getTopics = (req,res,next) => {
    selectTopics().then((topics) => {
        res.status(200).send({topics})
    }).catch(next)
}
