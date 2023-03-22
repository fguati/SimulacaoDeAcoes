const cookieSettings = (req, res, next) => {
    res.setHeader('Set-Cookie', 'SameSite=None; Secure')
    return next()
}

module.exports = {cookieSettings}