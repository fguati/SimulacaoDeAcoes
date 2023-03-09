function castSignUpEventTargetType(e:React.FormEvent<HTMLFormElement>) {
    const target = e.target as typeof e.target & {
        "Username": { value: string };
        "E-mail": { value: string };
        "Password": { value: string };
        "Confirm Password": { value: string };
    };

    return target;
}

export default castSignUpEventTargetType;