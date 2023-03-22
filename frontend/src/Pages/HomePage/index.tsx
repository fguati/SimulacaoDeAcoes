import PageLayout from "Components/PageLayout";
import { useCookies } from "react-cookie";


function HomePage() {
    const [cookies, setCookie] = useCookies()
    console.log(cookies.authToken)
    return(
        <PageLayout>
            dashboard
        </PageLayout>
    )
}

export default HomePage