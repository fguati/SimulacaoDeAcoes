import IFormField from "Interfaces/IFormField";

interface IFormProps {
    fields: IFormField[]
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export default IFormProps;