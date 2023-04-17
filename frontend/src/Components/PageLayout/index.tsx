import IPageLayoutProps from "./IPageLayoutProps";

function PageLayout({children}:IPageLayoutProps) {
    return(
        <div>
            {children}
        </div>

    )
}

export default PageLayout;