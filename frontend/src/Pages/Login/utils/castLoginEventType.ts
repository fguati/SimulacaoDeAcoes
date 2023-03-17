function castLoginEventTargetType(e:React.FormEvent<HTMLFormElement>) {
    const target = e.target as typeof e.target & {
        "E-mail": { value: string };
        "Password": { value: string };
    };

    return target;
}

export default castLoginEventTargetType