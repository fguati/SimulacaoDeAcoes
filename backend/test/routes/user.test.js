const server = require('../../src/server.js')
const request = require('supertest')

afterEach(() => {
    server.close()
})

describe('Testar GET em /', () => {
    it('Deve retornar uma lista com pelo menos um elemento', async () => {
        const resposta = await request(server)
            .get('/')
            .set('Content-Type', 'application/json')
            .expect(200)
        const parsedBody = JSON.parse(resposta.text)
        expect(parsedBody.length).toBeGreaterThan(0)
    })
})