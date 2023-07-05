import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import IFormField from "Interfaces/IFormField"
import { useEffect, useContext, useRef } from 'react'

//custom hook that add the user's portfolio of stocks as the select options in the stock to sell field of the sale form 
const useAddPortfolioAsSelectOptions = (sellFormFields: IFormField[]) => {
    //get user portfolio from context
    const { stockList } = useContext(UserAssetContext)

    //transform form fields in reference so components that use them are rerendered on change
    const sellFormRef = useRef(sellFormFields)

    //updated the select options whenever the user portfolio from the context changes
    useEffect(() => {
        //get the list of tickers from the user portfolio
        const listOfUserStockTickers = stockList.map(stock => stock.ticker)

        //find the form field that receives the ticker of the stock to be sold
        const stock2Sellfield = sellFormRef.current.find(field => field.name === 'Stock to Sell')

        //add to the field the list of tickers as their select options
        stock2Sellfield!.selectOptions = listOfUserStockTickers
    }, [stockList])

    return sellFormFields
}

export default useAddPortfolioAsSelectOptions