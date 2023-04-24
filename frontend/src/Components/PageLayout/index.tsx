import Snackbar from "Components/Snackbar";
import PageContainer from "./PageContainer";
import ContentContainer from "./ContentContainer";
import { useContext } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import { Outlet } from "react-router-dom";
import Header from "Components/Header";

function PageLayout() {
    const {activateSnackbar} = useContext(SnackbarContext)
 
    return(
        <>
            <Header/>
            <PageContainer>
                <ContentContainer>
                    <Outlet/>
                    <button onClick={() => activateSnackbar('Test message')}>Test Snack</button>
                </ContentContainer>
                
                <Snackbar/>
            </PageContainer>
        </>
    )
}

export default PageLayout;