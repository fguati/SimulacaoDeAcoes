const app = require('./app.js')

const port = 8000;

const server = app.listen(port,() => console.log(`running on http://localhost:${port}`))

module.exports = server