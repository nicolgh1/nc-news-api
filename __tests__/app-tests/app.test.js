const app = require('../../app')
const db = require('../../db/connection')
const testData = require('../../db/data/test-data/index')
const seed = require('../../db/seeds/seed')
const request = require('supertest')

beforeEach(() => seed(testData));
afterAll(() => db.end());


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