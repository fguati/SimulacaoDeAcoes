import Button from "Components/AtomComponents/Button"
import ContainerCard from "Components/AtomComponents/ContainerCard"
import Paragraph from "Components/AtomComponents/Paragraph"
import IFiltersNegotiation from "Interfaces/IFiltersNegotiation"
import styled from "styled-components"
import FilterField from "./FilterField"
import { useState } from "react"

const FilterAreaContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--default-spacing);

    justify-content: center;
    align-items: center;

    margin: var(--medium-spacing);
`

interface Props {
    // 
    setFilters: React.Dispatch<React.SetStateAction<IFiltersNegotiation>>
}

//Component that renders the filters of the negotiations list
function NegotiationListFilters({ setFilters }: Props) {

    const [ tmpFilters, setTmpFilters ] = useState<IFiltersNegotiation>({})

    return (
        <ContainerCard minHeight={200}>
            <Paragraph fontSize="--large-font-size">Filters: </Paragraph>
            <FilterAreaContainer>
                <FilterField 
                    filterGroup={tmpFilters} 
                    filterSetter={setTmpFilters} 
                    fieldFilter="stockFilter"
                >
                    Stock Ticker
                </FilterField>
                <FilterField 
                    filterGroup={tmpFilters} 
                    filterSetter={setTmpFilters} 
                    fieldFilter="typeFilter"
                >
                    Trade Type
                </FilterField>
                <FilterField 
                    filterGroup={tmpFilters} 
                    filterSetter={setTmpFilters} 
                    fieldFilter="startDateFilter"
                    inputType="date"
                >
                    Start Date
                </FilterField>
                <FilterField 
                    filterGroup={tmpFilters} 
                    filterSetter={setTmpFilters} 
                    fieldFilter="endDateFilter"
                    inputType="date"
                >
                    End Date
                </FilterField>

            </FilterAreaContainer>

            <Button onClick={() => setFilters(tmpFilters)}>Apply Filters</Button>
        </ContainerCard>
    )
}

export default NegotiationListFilters