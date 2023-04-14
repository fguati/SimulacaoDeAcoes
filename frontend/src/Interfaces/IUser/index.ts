/**
 * Interface that determines which properties a user must have on the frontend
 */
interface IUser {
    username?: string
    email: string
    password: string
}

export default IUser