//Validações Gerais:

export interface IValidatorReturn {
    message?: string
    valid: boolean
}

export type FormValidator = (value: string | number) => IValidatorReturn

// Check whether mandatory field is empty 
export const fieldIsNotEmpty: FormValidator = (value) => {
    const res:IValidatorReturn = {
        valid: Boolean(value)
    }

    if(!res.valid) {
        res.message = "can't be empty"
    }

    return res
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




