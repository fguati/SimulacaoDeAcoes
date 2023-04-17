import BorderlessBtn from "Components/AtomComponents/BorderlessButton"
import { useNavigate } from "react-router-dom"
import IPropsLastPageBtn from "./IProps"
import { AiOutlineArrowLeft } from 'react-icons/ai'
import ButtonContentBox from "./ButtonContentBox"

/**
 * componet that navigates to the last page. Receives the prop txtColor to 
 * determine whether its text will be dark (to be used in clear backgrounds) or
 * clear (to be used in dark bgs), since the button itself is a borderless and
 * backgroundless button
*/
function LastPageButton ({ txtColor = 'dark' }: IPropsLastPageBtn) {
    const navigate = useNavigate()
    function returnToLastPage() {
        return navigate(-1)
    }    

    return (
        <BorderlessBtn txtColor={txtColor} onClick={returnToLastPage}>
            {/* Uses a container component to properly space and position its text and icon components */}
            <ButtonContentBox>
                <AiOutlineArrowLeft/>
                {'return to last page'}
            </ButtonContentBox>
        </BorderlessBtn>
    )
}

export default LastPageButton