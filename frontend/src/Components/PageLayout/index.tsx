import Snackbar from "Components/Snackbar";
import PageContainer from "./PageContainer";
import ContentContainer from "./ContentContainer";
import { useContext } from 'react'
import { Outlet } from "react-router-dom";
import Header from "Components/Header";
import { PageThemeContext } from "Common/Contexts/PageThemeContext";
import DarkModeToggleButton from "Components/DarkModeToggleButton";

function PageLayout() {
    const { pageTheme } = useContext(PageThemeContext)
    return(
        <div className={pageTheme}>
            <Header/>
            <PageContainer>
                <ContentContainer>
                    <Outlet/>
                    <DarkModeToggleButton/>
                </ContentContainer>
                <Snackbar/>
            </PageContainer>
        </div>
    )
}

export default PageLayout;