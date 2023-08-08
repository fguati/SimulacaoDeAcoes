import Button from "Components/AtomComponents/Button"
import ContainerCard from "Components/AtomComponents/ContainerCard"
import Paragraph from "Components/AtomComponents/Paragraph"
import IFiltersNegotiation from "Interfaces/IFiltersNegotiation"
import styled from "styled-components"
import FilterField from "./FilterField"
import useFilters from "Pages/NegotiationHistoryPage/hooks/useFilters"
import MinimizeButton from "Components/MinimizeButton"
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

const FilterTitleContainer = styled.div`
    display: grid;
    justify-content: center;
    align-items: center;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr;

    p {
        grid-column: 2;
    }
`

interface Props {
    setFilters: React.Dispatch<React.SetStateAction<IFiltersNegotiation>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

//Component that renders the filter form of the negotiations list
function NegotiationListFilters({ setFilters, setCurrentPage }: Props) {
    
    //use custom hook to render filter variables, states and setters
    const { filterFields, emptyFilters, filtersValues, setFilterValues, currentFilterValues, setCurrentFilterValues } = useFilters()

    //states that control minimization of filter area
    const [ minimized, setMinimized ] = useState(true)

    //function that apply selected filters to the negotiation list
    const applyFilters = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        //set the filter state to trigger the effect that will fetch the negotiation list with the new filters
        setFilters(currentFilterValues)

        //go to the first page of the new fetch result
        setCurrentPage(1)

        //clear fields
        setFilterValues(emptyFilters)
        setCurrentFilterValues({})
        
    }

    //aux function that returns a setter function to be passed by props to each filter field
    const setField = (fieldFilter: keyof IFiltersNegotiation) => (value: string) => {
        setFilterValues(oldValues => {
            const newValues = {...oldValues}
            newValues[fieldFilter] = value
            return newValues
        })
    }

    return (
        <ContainerCard minHeight={24}>
            <FilterTitleContainer>
                <Paragraph fontSize="--large-font-size">Filters: </Paragraph>
                <MinimizeButton minimized={minimized} setMinimized={setMinimized}/>
            </FilterTitleContainer>

            {!minimized && <>
                <FilterAreaContainer>
                    {filterFields.map((field, index) => (
                        <FilterField
                            fieldFilter={field.fieldFilter}
                            filterGroup={currentFilterValues}
                            filterSetter={setCurrentFilterValues}
                            inputType={field.inputType}
                            key={`filter${index}`}
                            fieldValue={filtersValues[field.fieldFilter]}
                            fieldSetter={setField(field.fieldFilter)}
                        >
                            {field.fieldName}
                        </FilterField>
                    ))}
                </FilterAreaContainer>

                <Button onClick={applyFilters}>Apply Filters</Button>
            </>}

        </ContainerCard>
    )
}

export default NegotiationListFilters