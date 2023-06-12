import { InputType } from "Common/Types"
import { FormValidator } from "utils/FormValidators"

/**
 * Interface that determine which properties are necessary
 * to render an standard input field in a form
 */
export type FieldValue = string | number

interface IFormField {
    name: string
    type: InputType
    value: FieldValue
    validators?: Array<FormValidator>
    fieldProperty?: string
    selectOptions?: string[]
}

export default IFormField