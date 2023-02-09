import Header from "Components/Header";

function PageLayout({children}) {
    return(
        <>
            <Header />
            {children}
        </>

    )
}

export default PageLayout;