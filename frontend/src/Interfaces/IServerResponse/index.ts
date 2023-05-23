

interface IServerResponse<bodyType> {
    code: number
    body?: bodyType
    ok: boolean
}

export default IServerResponse