import Snackbar from "Components/Snackbar";
import IPageLayoutProps from "./IPageLayoutProps";
import PageContainer from "./PageContainer";
import ContentContainer from "./ContentContainer";
import { useContext } from 'react'
import { SnackbarContext } from "Common/Contexts/SnackbarContext";

function PageLayout({children}:IPageLayoutProps) {
    const {activateSnackbar} = useContext(SnackbarContext)
    return(
        <PageContainer>
            <ContentContainer>
                {children}
                <button onClick={() => activateSnackbar('failure')}>Test Snack</button>
            </ContentContainer>
            
            <Snackbar>Snack test</Snackbar>
        </PageContainer>
    )
}

export default PageLayout;