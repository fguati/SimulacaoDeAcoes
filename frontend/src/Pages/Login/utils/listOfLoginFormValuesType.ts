//type used to cast the target of the submit event for the login form to a type where typescript is allowed to access its properties
type listOfLoginFormValues = {
    "E-mail": { value: string };
    "Password": { value: string };
}

export default listOfLoginFormValues