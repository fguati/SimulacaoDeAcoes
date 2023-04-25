import Snackbar from "Components/Snackbar";
import PageContainer from "./PageContainer";
import ContentContainer from "./ContentContainer";
import { Outlet } from "react-router-dom";
import Header from "Components/Header";

function PageLayout() {
 
    return(
        <>
            <Header/>
            <PageContainer>
                <ContentContainer>
                    <Outlet/>
                </ContentContainer>
                
                <Snackbar/>
            </PageContainer>
        </>
    )
}

export default PageLayout;