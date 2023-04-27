import { ReactElement } from 'react'
import { FormValidator } from 'utils/FormValidators'

interface IInputFieldProps {
    children: ReactElement | string
    name: string
    currentValue: string | number
    setValue: (value: React.ChangeEvent<HTMLInputElement>) => void
    inputType?: 'text' | 'email' | 'password'
    validators?: Array<FormValidator>
}

export default IInputFieldProps;