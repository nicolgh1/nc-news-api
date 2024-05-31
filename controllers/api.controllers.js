const app = require('../app')
const db = require('../db/connection')

const {selectInstructions} = require('../models/api.models')

exports.getInstructions = (req,res,next) => {
    selectInstructions().then((instructions) => {
        res.status(200).send({instructions})
    }).catch(next)
}