class BaseError extends Error {
    constructor(message = 'Internal Server Error', statusCode = 500, aditionalInfo = '') {
        super(message)
        this.statusCode = statusCode
        this.aditionalInfo = aditionalInfo
    }

    sendErrorResponse(res) {
        const responseObject = {
            name: this.name, 
            message: this.message 
        }

        if(this.aditionalInfo !== '') {
            responseObject['aditionalInfo'] = this.aditionalInfo
        }
        return res
            .status(this.statusCode)
            .send(JSON.stringify(responseObject))
        
    }
}

module.exports =  BaseError