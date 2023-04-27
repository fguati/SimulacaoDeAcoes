//Validações Gerais:

import IFormField from "Interfaces/IFormField"

export type FormValidator = (field: IFormField) => boolean

// Campo não pode ser vazio
export const fieldIsNotEmpty: FormValidator = (field) => {
    return Boolean(field.value)
} 


//Validações Register:
// Email:
// formato email@provedor.com(possivel.br)

// Usename:
// minimo 3 letras

// Password:
// Formato: 8 chars min, num, letra maius, letra min, char especial

// Confirmar Password:
// valor do campo igual ao do campo password




