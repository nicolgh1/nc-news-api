const app = require('../../app')
const db = require('../../db/connection')
const testData = require('../../db/data/test-data/index')
const seed = require('../../db/seeds/seed')
const request = require('supertest')

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('GET/api', () => {
    test('200: Responds with a nested object. Each object has a key describing a GET, POST, PATCH or POST request to an endpoint starting with "/api"', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const instructionsKeys = Object.keys(body.instructions)
            instructionsKeys.forEach((key) => {
                expect(key).toMatch(/^(get|push|patch|delete) \/api/i)
            })

        })
    })
    test('200: Responds with a nested object. Each of the most inner objects have a particular set of keys except the "GET/api" one which only has one key', () =>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const responseObj = body.instructions
            for(let item in responseObj){
                if(item === 'GET /api'){
                    expect(responseObj[item]).toMatchObject({
                        description : expect.any(String)
                    })
                }
                else if(item.startsWith('POST') || item.startsWith('PATCH')) {
                    expect(responseObj[item]).toMatchObject({
                        description : expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object),
                        exampleBody: expect.any(Object)
                    })
                }
                else {
                    expect(responseObj[item]).toMatchObject({
                        description : expect.any(String),
                        queries: expect.any(Array),
                        exampleResponse: expect.any(Object)
                    })
                }
            }
        })
    })
})
describe('GET/api/topics', () => {
    test('200: returns an array of all topics objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
            const { topics } = body
            expect(topics).toHaveLength(3)
            topics.forEach(topic => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            });
        })
    })
})