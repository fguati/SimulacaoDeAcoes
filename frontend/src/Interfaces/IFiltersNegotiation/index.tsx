interface IFiltersNegotiation {
    stockFilter?: string
    typeFilter?: 'BUY' | 'SELL'
    startDateFilter?: string
    endDateFilter?: string
}

export default IFiltersNegotiation