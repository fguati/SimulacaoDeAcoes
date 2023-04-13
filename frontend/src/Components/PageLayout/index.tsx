import IPageLayoutProps from "./IPageLayoutProps";

function PageLayout({children}:IPageLayoutProps) {
    return(
        <body>
            {children}
        </body>

    )
}

export default PageLayout;