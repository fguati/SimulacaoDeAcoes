let allowedHeaders = [
    'Content-Type',
    'Authorization',
    'Set-Cookie'
]

allowedHeaders = allowedHeaders.join(', ') 

const corsAllowances = (req, res, next) => {
    res.set('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders)
    res.setHeader('Access-Control-Expose-Headers', allowedHeaders)
    return next()
}

module.exports = {corsAllowances}