
const cookieSettings = (req, res, next) => {
    res.setHeader('Set-Cookie', `SameSite=None; Secure; Path=/`)
    return next()
}

module.exports = {cookieSettings}