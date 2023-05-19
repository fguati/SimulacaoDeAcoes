

function sendOKResponse(res, objectToSend = {}, status = 200) {
    return res.status(status).send(JSON.stringify(objectToSend))
}

module.exports = { sendOKResponse }