import { ReactChildren } from "Common/Types"
import Input from "Components/AtomComponents/InputField/StyledComponents/StyledInput"
import Paragraph from "Components/AtomComponents/Paragraph"
import IFiltersNegotiation from "Interfaces/IFiltersNegotiation"
import styled from "styled-components"

const FilterFieldWrapper = styled.div`
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: var(--default-spacing);
    justify-content: center;
    align-items: center;
`

interface Props {
    children: ReactChildren
    filterGroup: IFiltersNegotiation
    fieldFilter: keyof IFiltersNegotiation
    filterSetter: React.Dispatch<React.SetStateAction<IFiltersNegotiation>>
    inputType?: 'date' | 'text'
}

const FilterField = ({ children, fieldFilter, filterGroup, filterSetter, inputType='text' }: Props) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value

        if(isDateFilter(fieldFilter)) {
            
            const tmpFilter = {...filterGroup}
            const newDate = new Date(inputValue)
            tmpFilter[fieldFilter] = inputValue
            if(newDate.toString() === 'Invalid Date') tmpFilter[fieldFilter] = undefined
            filterSetter(tmpFilter)
            return
        }

        if(fieldFilter === 'typeFilter') {
            const tmpFilter = {...filterGroup}
            
            if(inputValue === 'BUY' || inputValue === 'SELL') {
                tmpFilter[fieldFilter] = inputValue
            }
            if(!inputValue) {
                tmpFilter[fieldFilter] = undefined
            }

            filterSetter(tmpFilter)
            return
        }

        const tmpFilter = {...filterGroup}
        tmpFilter[fieldFilter] = inputValue
        filterSetter(tmpFilter)

    }


    return (
        <FilterFieldWrapper>
            <Paragraph>{children}</Paragraph>
            <Input type={inputType} onChange={onChange} />
        </FilterFieldWrapper>
    )
}

export default FilterField

const isDateFilter = (fieldFilter: keyof IFiltersNegotiation): fieldFilter is 'endDateFilter' | 'startDateFilter' => (fieldFilter === 'endDateFilter' || fieldFilter === 'startDateFilter')