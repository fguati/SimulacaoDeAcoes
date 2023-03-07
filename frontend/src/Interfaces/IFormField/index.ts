interface IFormField {
    name: string
    type: 'text' | 'password' | 'email'
    value: string | number
}

export default IFormField