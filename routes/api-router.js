const {getInstructions} = require('../controllers/api.controllers')

const apiRouter = require('express').Router();
const usersRouter = require('./users-router');

apiRouter.get('/',getInstructions)

module.exports = apiRouter

