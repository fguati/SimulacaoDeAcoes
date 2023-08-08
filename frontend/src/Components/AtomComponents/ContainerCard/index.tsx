import styled from "styled-components";

interface Props {
    minHeight?: number
}

const ContainerCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: var(--max-width-card);
    min-height: ${(props: Props) => (props.minHeight ?? 350) + 'px' };
    
    padding: var(--large-spacing);
    margin: var(--default-spacing) auto;
    border-radius: var(--default-spacing);

    background-color: var(--background-light);
    
    box-shadow: 2px 2px 2px 1px var(--shadow-color);
`

export default ContainerCard