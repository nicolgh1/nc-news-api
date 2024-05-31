const db = require('../db/connection')
const fs = require('fs/promises')

exports.selectInstructions = () => {
    return fs.readFile(`endpoints.json`, "utf-8").then((data) => {
        return JSON.parse(data)
    })
}