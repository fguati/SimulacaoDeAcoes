import { ReactChildren } from "Common/Types";
import { createContext, useEffect, useState } from "react";
import useFetchUserBalance from "./CustomHooks/useFetchUserBalance";
import usePostDeposit from "./CustomHooks/usePostDeposit";

interface Props {
    children: ReactChildren
}

interface IUserBalanceContext {
    userBalance: number
    setUserBalance: React.Dispatch<React.SetStateAction<number>>
    postDeposit: (funds:number) => Promise<void>
}

const UserBalanceContext = createContext<IUserBalanceContext>(undefined!)

const UserBalanceProvider = ({ children }: Props) => {
    const [userBalance, setUserBalance] = useState(0)

    //fetch user balance from server and set state to the response
    const fetchUserBalance = useFetchUserBalance()
    useEffect(() => {
        fetchUserBalance()
            .then(res => {if(res) setUserBalance(res)})
    }, [fetchUserBalance])

    //function that post fund deposits to the server
    const postDeposit = usePostDeposit(setUserBalance)

    return (
        <UserBalanceContext.Provider value={{ userBalance, setUserBalance, postDeposit }}>
            {children}
        </UserBalanceContext.Provider>
    )
}

export { UserBalanceContext, UserBalanceProvider }