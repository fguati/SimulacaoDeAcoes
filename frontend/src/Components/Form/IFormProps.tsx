import IFormField from "Interfaces/IFormField";

interface IFormProps {
    fields: IFormField[]
    onSubmit: (fiedlList: IFormField[]) => void
}

export default IFormProps;