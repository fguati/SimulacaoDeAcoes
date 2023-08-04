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
type FilterSetter = React.Dispatch<React.SetStateAction<IFiltersNegotiation>>

interface Props {
    children: ReactChildren
    filterGroup: IFiltersNegotiation
    fieldFilter: keyof IFiltersNegotiation
    filterSetter: FilterSetter
    inputType?: 'date' | 'text'
    fieldValue?: string
    fieldSetter: (value: string) => void
}

//component that render one of the input fields in the filter form of the negotiation history page
const FilterField = ({ children, fieldFilter, filterGroup, filterSetter, inputType='text', fieldValue = undefined, fieldSetter }: Props) => {
    //funtcion that handles the changes of values in the filter inputs
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        
        //change the value displayed in the input element to match the value inputed
        fieldSetter(inputValue)

        //validate and handle filtering in case field is a date filter
        if(isDateFilter(fieldFilter)) {
            setDateFilter(filterGroup, inputValue, fieldFilter, filterSetter)
            return
        }

        //validate and handle filtering in case field is the trade type filter
        if(fieldFilter === 'typeFilter') {
            setTradeTypeFilter(filterGroup, inputValue, filterSetter)
            return
        }

        //handle stock filter
        setStockFilter(filterGroup, inputValue, filterSetter)

    }

    return (
        <FilterFieldWrapper>
            <Paragraph>{children}</Paragraph>
            <Input type={inputType} onChange={onChange} value={fieldValue}/>
        </FilterFieldWrapper>
    )
}

export default FilterField

//function that checks if field is a date filter field
const isDateFilter = (fieldFilter: keyof IFiltersNegotiation): fieldFilter is 'endDateFilter' | 'startDateFilter' => (fieldFilter === 'endDateFilter' || fieldFilter === 'startDateFilter')

//function that sets the state of the filter object to reflect the valid date entered in the input
function setDateFilter(filterGroup: IFiltersNegotiation, inputValue: string, fieldFilter: 'endDateFilter' | 'startDateFilter', filterSetter: FilterSetter) {
    const tmpFilter = { ...filterGroup }
    const newDate = new Date(inputValue)
    tmpFilter[fieldFilter] = inputValue
    if (newDate.toString() === 'Invalid Date') tmpFilter[fieldFilter] = undefined
    filterSetter(tmpFilter)
}

//function that sets the state of the filter object to reflect the valid trade type entered in the input
function setTradeTypeFilter(filterGroup: IFiltersNegotiation, inputValue: string, filterSetter: FilterSetter) {
    const tmpFilter = { ...filterGroup }

    if (inputValue === 'BUY' || inputValue === 'SELL') {
        tmpFilter.typeFilter = inputValue
    }
    if (!inputValue) {
        tmpFilter.typeFilter = undefined
    }

    filterSetter(tmpFilter)
}

//function that sets the state of the filter object to reflect the stock entered in the input
function setStockFilter(filterGroup: IFiltersNegotiation, inputValue: string, filterSetter: FilterSetter) {
    const tmpFilter = { ...filterGroup }
    tmpFilter.stockFilter = inputValue
    filterSetter(tmpFilter)
}