import styled from "styled-components";

const ContainerCard = styled.div`
    display: flex;
    flex-direction: column;

    max-width: var(--max-width-card);
    min-height: 350px;
    
    padding: var(--default-spacing);
    margin: var(--default-spacing) auto;
    border-radius: var(--default-spacing);

    background-color: var(--background-light);
    
    box-shadow: 2px 2px 2px 1px var(--shadow-color);
`

export default ContainerCard