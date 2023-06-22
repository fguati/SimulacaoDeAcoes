import IServerResponse from "Interfaces/IServerResponse"
import ITradeRes from "../Interfaces/ITradeRes"
import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import { SnackbarContext } from "Common/Contexts/SnackbarContext"
import { useContext } from 'react'
import IStock from "Interfaces/IStock"
import INewPosition from "../Interfaces/INewPosition"

//custom hook that create function that handles succesful responses to trade requests to the server
const useTradeSuccessHandler = (tradeType: 'BUY' | 'SELL' = 'BUY') => {
    //get info from contexts
    const { updateUserAssets, stockList } = useContext(UserAssetContext)
    const { activateSnackbar } = useContext(SnackbarContext)
    
    //handler function to be returned
    const successHandler = async (response: IServerResponse<ITradeRes>) => {
        const newPosition = response.body!.newPosition
        const newUserBalance = response.body!.userBalance
        
        //create list of stocks updated with the data from the succesful trade
        const updatedStockList = updateStockList(stockList, newPosition)

        //update the data from the user asset context with the data from the successful trade
        updateUserAssets(newUserBalance, updatedStockList)

        //render success message in snackbar 
        const snackbarMessage = renderSnackbarMessage(tradeType, newPosition)
        activateSnackbar(snackbarMessage, {colorPalette: 'success'})
    }

    return successHandler
}

export default useTradeSuccessHandler

//function that creates a stock list updated with the data from the trade
function updateStockList(stockList: IStock[], newPosition: INewPosition) {
    //create copy of the stockList to be manipulated
    const newList = [...stockList]
    const changedStockIndex = newList.findIndex(stock => stock.ticker === newPosition.stock)

    addNewStockToList(changedStockIndex, newPosition, newList)

    updateNewStockOnList(changedStockIndex, newPosition, newList)

    const listWithoutEmptyStocks = removeEmptyPositions(newList)

    listWithoutEmptyStocks.sort((stock1, stock2) => stock1.ticker.localeCompare(stock2.ticker))

    return listWithoutEmptyStocks

}

//function that remove positions with 0 stocks from the list
function removeEmptyPositions(newList: IStock[]) {
    return newList.filter(stock => stock.qty && stock.qty > 0)
}

//function that finds in the portfolio the stock that was traded and updates it
function updateNewStockOnList(changedStockIndex: number, newPosition: INewPosition, newList: IStock[]) {
    const stockIsAlreadyInPortfolio = changedStockIndex >= 0
    if (stockIsAlreadyInPortfolio) {
        newList[changedStockIndex].averagePrice = newPosition.averagePrice
        newList[changedStockIndex].qty = newPosition.qty
    }
}


function addNewStockToList(changedStockIndex: number, newPosition: INewPosition, newList: IStock[]) {
    const stockIsNotInPortfolio = changedStockIndex === -1
    if (stockIsNotInPortfolio) {
        newList.push({
            companyName: 'placeholder', //the company name will be updated as soon as it apears in the screen, so its not necessary check the webApi for it now
            currentPrice: newPosition.averagePrice,
            ticker: newPosition.stock,
            qty: newPosition.qty
        })
    }
}

//function that dinamically creates message to be shown in snackbar
function renderSnackbarMessage(tradeType: 'BUY' | 'SELL', newPosition: INewPosition) {
    const tradeTypeName = tradeType === 'BUY' ? 'Purchase' : 'Sale'
    const message = `${tradeTypeName} of ${newPosition.stock} successful`

    return message
}
