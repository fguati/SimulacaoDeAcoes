require("dotenv").config()
const app = require('./app.js')

const port = process.env.BACKEND_API_PORT;

const server = app.listen(port,() => console.log(`running on http://localhost:${port}`))

module.exports = server