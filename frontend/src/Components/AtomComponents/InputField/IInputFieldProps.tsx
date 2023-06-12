import { InputType } from 'Common/Types'
import { ReactElement } from 'react'
import { FormValidator } from 'utils/FormValidators'

interface IInputFieldProps {
    children: ReactElement | string
    name: string
    currentValue: string | number
    setValue: (value: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    inputType?: InputType
    validators?: Array<FormValidator>
    selectOptions?: string[]
}

export default IInputFieldProps;