import Title from "Components/AtomComponents/Title"
import BuyForm from "./Components/BuyForm"
import SellForm from "./Components/SellForm"
import { useContext } from 'react'
import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import Label from "Components/AtomComponents/Label"
import Paragraph from "Components/AtomComponents/Paragraph"

//Page with the functions to buy and sell stocks
function HomeBrokerPage() {
    const { userBalance } = useContext(UserAssetContext)

    return (
        <>
            <Title>Home Broker</Title>
            <Label>User Balance: </Label>
            <Paragraph>{`R$ ${userBalance.toFixed(2)}`}</Paragraph>
            <BuyForm/>
            <SellForm/>
        </>
    )
}

export default HomeBrokerPage