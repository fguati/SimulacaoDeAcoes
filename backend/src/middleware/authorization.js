const { UnauthorizedError, MissingAuthTokenError } = require("../CustomErrors")

//Function that returns middleware responsible for checking whether user attempting to access routes has the requiered authorization to do so. Receives the list of authorized roles
const authorization = (listOfAllowedRoles) => (req, res, next) => {
    try {
        //the payloadJWT is added to req body by authentication middleware. Lack of it means an unautheticated user
        if(!req.body.payloadJWT) throw new MissingAuthTokenError('You must be logged in to access this route')

        //get user role from payload of the authentication middleware
        const { role } = req.body.payloadJWT

        //check if user role is in the list of authorizations
        const userRoleIsAllowed = listOfAllowedRoles.some(allowedRole => allowedRole === role)
        
        //user being authorized can have its request forwarded to next middleware or controller
        if(userRoleIsAllowed) {
            return next()
        }

        //unauthorized user receive the UnauthorizedError response
        throw new UnauthorizedError()
        
    } catch (error) {
        //forward error to be treated by error handler middleware
        return next(error)
    }
}

module.exports = { authorization }