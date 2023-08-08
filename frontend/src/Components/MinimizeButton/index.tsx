import { FaMinus, FaPlus } from "react-icons/fa"
import styled from "styled-components"

const ButtonContainer = styled.div`
    color: var(--light-font-color);
    justify-self: end;
    margin: 0 var(--default-spacing);

    svg {
        font-size: var(--medium-font-size);

    }
`

interface Props {
    minimized: boolean
    setMinimized: React.Dispatch<React.SetStateAction<boolean>>
}

function MinimizeButton({ minimized, setMinimized }: Props) {

    return(
        <ButtonContainer onClick={() => setMinimized(oldValue => !oldValue)}>
            {minimized ? <FaPlus/> : <FaMinus/>}
        </ButtonContainer>
    )
}

export default MinimizeButton