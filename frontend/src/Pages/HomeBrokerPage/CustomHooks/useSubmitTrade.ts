import IFormField from "Interfaces/IFormField";
import { useHandleRequestResponse, turnFieldListInObject, fetchFromServer } from "utils/BackendAPICommunication/"
import { useContext } from 'react'
import { UserAssetContext } from "Common/Contexts/UserBalanceContext";
import { SnackbarContext } from "Common/Contexts/SnackbarContext";
import { fetchStockInfo } from "utils/FinanceAPIComm";
import useTradeSuccessHandler from "./useTradeSuccessHandler";
import IStock from "Interfaces/IStock";
import { ITradeRes, ITradeToPost } from "../Interfaces";

function useSubmitTrade(tradeType: 'BUY' | 'SELL') {
    //get context info
    const { userBalance, stockList } = useContext(UserAssetContext)
    const { activateSnackbar } = useContext(SnackbarContext)

    //create a success handler
    const successHandler = useTradeSuccessHandler(tradeType)
    
    //create a response handler function that receives a success handler for the happy path
    const responseHandler = useHandleRequestResponse<ITradeRes>(successHandler)

    return async (formFields: IFormField[]) => {
        try {
            //create obejct from form fields to be posted
            const tradeInfo = turnFieldListInObject<ITradeToPost>(formFields)
            tradeInfo.tradeType = tradeType
            
            //validate purchase
            await validatePurchase(tradeInfo, userBalance) 

            //validate sale
            await validateSale(stockList, tradeInfo)

            //post data to backend API
            const response = await fetchFromServer<ITradeRes>('/user/trade', 'POST', tradeInfo)

            //Uses the response handler with the response received form the backend API
            const handledResponse = await responseHandler(response)
            return handledResponse

        } catch (error) {
            if(error instanceof Error) return activateSnackbar(error.message, { colorPalette: 'failure' })
        }
        
    }
}

export default useSubmitTrade

//Validates that purchase is valid by checking that the stock exists and the user has enough funds to make the trade
async function validatePurchase(tradeInfo: ITradeToPost, userBalance: number) {
    const { qtyToTrade, stockToTrade, tradeType } = tradeInfo

    if(tradeType === 'BUY') {
        const stockWebInfo = await fetchStockInfo([stockToTrade])
        
        //Validates that the communication with the web API was successful
        if('message' in stockWebInfo) throw new Error('Error in fetching stock info on the web')
    
        //Validates the user has enough funds for the purchase
        const purchaseCost = qtyToTrade * stockWebInfo[0].currentPrice
        if(purchaseCost > userBalance) throw new Error(`Insuficient funds for the purchase. The purchase cost is R$${purchaseCost.toFixed(2)} and your balance is R$${userBalance.toFixed(2)}`)
    }
}

//Validates the sale by checking the user has enough shares of the desired stock to sell
async function validateSale(userCurrentList: IStock[], tradeInfo: ITradeToPost) {
    const { qtyToTrade, stockToTrade, tradeType } = tradeInfo

    if(tradeType === 'SELL') {
        const stockCurrentPosition = userCurrentList.find(stock => stock.ticker === stockToTrade)
    
        //validate that stock is in user portfolio
        if(!stockCurrentPosition) throw new Error("Can't sell stock that is not part of your portfolio")
    
        //validate that user has enough shares to make sale
        if(!stockCurrentPosition.qty || qtyToTrade > stockCurrentPosition.qty) throw new Error(`You only have ${stockCurrentPosition.qty ?? 0} shares of ${stockToTrade}. Please try to sell less shares`)
    }
}