import { NavigateFunction } from "react-router-dom";

const handleSignUpResponse = (response: Response, navigate:NavigateFunction) => {
    
    if (response.status > 399) {
        console.log(response.body)
        // redirect error page
    }

    alert('User registered successfully')

    navigate('/login')
}

export default handleSignUpResponse;