import IFiltersNegotiation from "Interfaces/IFiltersNegotiation"
import { useState } from "react"


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

function useFilters() {
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

    return { filterFields, emptyFilters, filtersValues, setFilterValues, currentFilterValues, setCurrentFilterValues }
}

export default useFilters