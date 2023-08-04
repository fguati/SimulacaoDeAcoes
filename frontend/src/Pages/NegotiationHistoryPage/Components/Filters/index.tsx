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
    setFilters: React.Dispatch<React.SetStateAction<IFiltersNegotiation>>
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

interface IFilterField {
    fieldFilter: keyof IFiltersNegotiation
    inputType?: 'date' | 'text'
    fieldName: string
}

interface IFilterValues {
    stockFilter?: string
    typeFilter?: string
    startDateFilter?: string
    endDateFilter?: string
}

//Component that renders the filter form of the negotiations list
function NegotiationListFilters({ setFilters, setCurrentPage }: Props) {
    
    const filterFields:IFilterField[]  = [
        {
            fieldFilter: 'stockFilter',
            fieldName: 'Stock Ticker'
        },
        {
            fieldFilter: 'typeFilter',
            fieldName: 'Trade Type'
        },
        {
            fieldFilter: 'startDateFilter',
            fieldName: 'Start Date',
            inputType: 'date'
        },
        {
            fieldFilter: 'endDateFilter',
            fieldName: 'End Date',
            inputType: 'date'
        }
    ]

    const emptyFilters: IFilterValues = {
        stockFilter: '',
        typeFilter: '',
        startDateFilter: '',
        endDateFilter: ''
    }

    //state that manages the current values in the inputs of the filter fields
    const [filtersValues, setFilterValues] = useState<IFilterValues>(emptyFilters)

    //state that manages the current values of the filters that will be applied when the Apply Button is clicked
    const [currentFilterValues, setCurrentFilterValues] = useState<IFiltersNegotiation>({})


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
        <ContainerCard minHeight={200}>
            <Paragraph fontSize="--large-font-size">Filters: </Paragraph>
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
        </ContainerCard>
    )
}

export default NegotiationListFilters