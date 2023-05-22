import IFormField from "Interfaces/IFormField"
import IUser from "Interfaces/IUser"
import turnFieldListInObject from "utils/turnFieldListInObject"

describe('Test auxiliary function that creates objects from lists of form fields', () => {
    it('must return an object with the correct properties and values from a list of fields', () => {
        const mockUser = 'mockUser'
        const mockEmail = 'mock@email.com'
        const mockPassword = 'mockPassword123*'
        
        const mockeFields:IFormField[] = [
            {name: 'Username', type: 'text', value: mockUser, fieldProperty: 'username'},
            {name: 'E-mail', type:'email', value: mockEmail, fieldProperty: 'email'}, 
            {name: 'Password', type:'password', value:mockPassword, fieldProperty: 'password'},
            {name: 'Confirm Password', type: 'password', value: mockPassword}
        ] 

        const testObj = turnFieldListInObject<IUser>(mockeFields)
        const expectedObj: IUser = {
            username: mockUser,
            email: mockEmail,
            password: mockPassword
        }

        expect(testObj).toEqual(expectedObj)
    })
})