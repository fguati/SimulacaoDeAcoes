import { FormValidator, IValidatorReturn } from ".";

//validate whether a user has enough funds to withdraw the ammount entered
export const fundsAreSuficientForWithdraw = (userCurrentBalance: number): FormValidator => {
    return (fundsToTransfer) => {
        const validatorReturnObject: IValidatorReturn = {
            valid: true
        }
        
        const balanceAfterTransfer = userCurrentBalance + Number(fundsToTransfer)

        if(balanceAfterTransfer < 0) {
            validatorReturnObject.valid = false
            validatorReturnObject.message = `You have insuficinet funds to withdraw R$ ${-1 * Number(fundsToTransfer)}`
        }

        return validatorReturnObject
    }
    
}