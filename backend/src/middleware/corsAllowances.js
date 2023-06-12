//configure app to be able to communicate with frontend
let allowedHeaders = [
    'Content-Type',
    'Authorization',
    'Cookie'
]

allowedHeaders = allowedHeaders.join(', ') 

const corsAllowances = (req, res, next) => {
    res.set('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders)
    res.setHeader('Access-Control-Expose-Headers', allowedHeaders)
    res.setHeader("Access-Control-Allow-Methods", 'OPTIONS,POST,GET')
    
    //intercept Options requests
    if(req.method === 'OPTIONS') return res.sendStatus(200)

    return next()
}

module.exports = {corsAllowances}