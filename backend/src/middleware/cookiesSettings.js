//Make sure the app is setup correctly to use cookies
const cookieSettings = (req, res, next) => {
    res.setHeader('Set-Cookie', `SameSite=None; Secure; Path=/`)
    return next()
}

module.exports = {cookieSettings}