import Header from "Components/Header";
import IPageLayoutProps from "./IPageLayoutProps";

function PageLayout({children}:IPageLayoutProps) {
    return(
        <>
            <Header />
            {children}
        </>

    )
}

export default PageLayout;