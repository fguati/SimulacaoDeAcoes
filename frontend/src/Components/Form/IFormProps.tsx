import IFormField from "Interfaces/IFormField";

interface IFormProps {
    fields: IFormField[]
    onSubmit: (fiedlList: IFormField[]) => void
    submitButtonText?: string
}

export default IFormProps;