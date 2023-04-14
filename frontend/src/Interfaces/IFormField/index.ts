/**
 * Interface that determine which properties are necessary
 * to render an standard input field in a form
 */
interface IFormField {
    name: string
    type: 'text' | 'password' | 'email'
    value: string | number
}

export default IFormField