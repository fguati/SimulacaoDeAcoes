import Snackbar from "Components/Snackbar";
import IPageLayoutProps from "./IPageLayoutProps";
import PageContainer from "./PageContainer";
import ContentContainer from "./ContentContainer";

function PageLayout({children}:IPageLayoutProps) {
    return(
        <PageContainer>
            <ContentContainer>
                {children}
            </ContentContainer>
            
            <Snackbar colorPallete="success">Snack test</Snackbar>
        </PageContainer>

    )
}

export default PageLayout;