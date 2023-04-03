import { ReactElement } from 'react'

interface IInputFieldProps {
    children: ReactElement | string
    name: string
    currentValue: string | number
    setValue: (value: React.ChangeEvent<HTMLInputElement>) => void
    inputType?: 'text' | 'email' | 'password'
}

export default IInputFieldProps;