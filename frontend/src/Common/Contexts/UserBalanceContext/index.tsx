import { ReactChildren } from "Common/Types";
import { createContext, useEffect, useState } from "react";
import useFetchUserBalance from "./CustomHooks/useFetchUserBalance";
import usePostDeposit from "./CustomHooks/usePostDeposit";
import IStock from "Interfaces/IStock";
import useFetchPortfolio from "./CustomHooks/fetchPortfolio";

interface Props {
    children: ReactChildren
}

interface IUserAssetContext {
    userBalance: number
    postDeposit: (funds:number) => Promise<void>
    stockList: IStock[]
}

const UserAssetContext = createContext<IUserAssetContext>(undefined!)

const UserAssetProvider = ({ children }: Props) => {
    //set state that will manage user balance
    const [userBalance, setUserBalance] = useState(0)

    //fetch currnet user balance from server and set state to the response
    const fetchUserBalance = useFetchUserBalance()
    useEffect(() => {
        fetchUserBalance()
            .then(res => {if(res) setUserBalance(res)})
    }, [fetchUserBalance])

    //function that post fund deposits to the server
    const postDeposit = usePostDeposit(setUserBalance)

    //set state that will manage the user portfolio
    const [stockList, setStockList] = useState<IStock[]>([])

    //fetch the stock data from db and set state to the response
    const fetchPortfolio = useFetchPortfolio()
    useEffect(() => {
        const response = fetchPortfolio()
        response.then(portfolio => {
            setStockList(portfolio!)
        })
    }, [fetchPortfolio])

    return (
        <UserAssetContext.Provider value={{ userBalance, postDeposit, stockList }}>
            {children}
        </UserAssetContext.Provider>
    )
}

export { UserAssetContext, UserAssetProvider }