const { expect } = require('@jest/globals')
const app = require('../../app')
const db = require('../../db/connection')
const testData = require('../../db/data/test-data/index')
const seed = require('../../db/seeds/seed')
const request = require('supertest')
require('jest-sorted')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET/api/not-a-path', () => {
    test('404: returns an error message if the end point is not correctly provided', () => {
        return request(app)
        .get('/api/notAPath')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Route not found')
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
describe('GET/api', () => {
    test('200: Responds with a nested object. Each object has a key describing a GET, POST, PATCH or POST request to an endpoint starting with "/api"', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            const instructionsKeys = Object.keys(body.instructions)
            instructionsKeys.forEach((key) => {
                expect(key).toMatch(/^(get|post|patch|delete) \/api/i)
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
describe('GET /api/articles/:article_id', () => {
    test('200: Returns an object with one article based on the article_id provided', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toMatchObject({
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                article_img_url: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number)
            })
        })
    })
    test('200: Returns the correct number of comments per article',() => {return request(app)
        .get('/api/articles/9')
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article.comment_count).toEqual(2)
        })
    })
    test('400: Returns an error message of "Bad Request" if the article_id is not a number', () => {
        return request(app)
        .get('/api/articles/dummy')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
    test('404: Returns an error message of "Not Found" if the article_id number is out of range', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
})
describe('GET /api/articles', () => {
    test('200: returns an array of all articles, all having the required keys', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
                })
                expect(article.body).toEqual(undefined)
            })
        })
    })
    test('200: returns an array of all articles sorted desc by date as default', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at',{
                descending: true})
        })
    })
    test('200: Accepts a query of topic which filters the articles by the topic value specified in the query', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({body}) => {
            const {articles} = body
            expect(articles).toHaveLength(1)
            articles.forEach((article) => {
                expect(article.topic).toEqual('cats')
            })
        })
    })
    test('404: Returns an error message if the query topic is not found', () => {
        return request(app)
        .get('/api/articles?topic=random')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
            })
    })
})
describe('GET /api/articles/:article_id/comments', () => {
    test('200: Responds with an array of comments for the given article_id of which each comment should have the tested properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .then(({body}) => {
            const {comments} = body
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
            })
        })
    })
    test('200: Responds with an array of comments sorted by created_at DESC', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments).toBeSortedBy('created_at',{
                descending: true})
        })
    })
    test('200: Returns with an empty array if no comments available', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            const {comments} = body
            expect(comments).toEqual([])
        })
    })
    test('404: Returns an error message if provided an invalid article_id', () => {
        return request(app)
        .get('/api/articles/1000/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: Updates te comments table and responds with the updated comment', () => {
        const postObj = {
            author: 'butter_bridge',
            body: 'test body'
        }
        return request(app)
        .post('/api/articles/2/comments')
        .send(postObj)
        .expect(201)
        .then(({body}) => {
            const {comment} = body
            expect(comment).toMatchObject({
                    body: 'test body',
                    votes: 0,
                    author: "butter_bridge",
                    article_id: 2,
                    created_at: expect.any(String)
            })
        })
    })
    test(`404: Returns an error if given an invalid author_id`, () => {
        const postObj = {
            author: 'butter_bridge',
            body: 'test body'
        }
        return request(app)
        .post('/api/articles/1000/comments')
        .send(postObj)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
    test(`404: Returns an error if given an invalid username`, () => {
        const postObj = {
            author: 'test-username',
            body: 'test body'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(postObj)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
    test('400 Returns an error if body is incorrect', () => {
        const postObj = {
            body: 'test body'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(postObj)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: Responds with an object of the updated article id and correct votes number for a positive inc_votes received', () => {
        const postObj ={
            inc_votes: 10
        }
        return request(app)
        .patch('/api/articles/1')
        .send(postObj)
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                votes: 110
            })
        })
    })
    test('200: Responds with an object of the updated article id and correct votes number for a negative inc_votes received', () => {
        const postObj ={
            inc_votes: -10
        }
        return request(app)
        .patch('/api/articles/1')
        .send(postObj)
        .expect(200)
        .then(({body}) => {
            const {article} = body
            expect(article).toMatchObject({
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: expect.any(String),
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                votes: 90
            })
        })
    })
    test('400: Responds with an error message if the votes provided are not a number', () => {
        const postObj ={
            inc_votes: 'test'
        }
        return request(app)
        .patch('/api/articles/1')
        .send(postObj)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
    test('400: Responds with an error message if the votes key is incorrect', () => {
        const postObj ={
            votes: 1
        }
        return request(app)
        .patch('/api/articles/1')
        .send(postObj)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
    test('404: Responds with an error message if the article_id provided is invalid', () => {
        const postObj ={
            inc_votes: 10
        }
        return request(app)
        .patch('/api/articles/1000')
        .send(postObj)
        .expect(404)
        .then(({body}) => {
            console.log(body)
            expect(body.msg).toEqual('Not Found')
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('204: succesfully deletes the comment by the comment_id returns no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('404: returns an error message if the comment_id is not found', () => {
        return request(app)
        .delete('/api/comments/1000')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toEqual('Not Found')
        })
    })
    test('400: returns an error message if the comment_id is an invalid value', () => {
        return request(app)
        .delete('/api/comments/test')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toEqual('Bad Request')
        })
    })
})

describe('GET /api/users', () => {
    test('200: Returns an array of user objects each having the tested properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const {users} = body
            expect(users).toHaveLength(4)
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})
