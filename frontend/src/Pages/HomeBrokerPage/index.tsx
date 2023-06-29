import Title from "Components/AtomComponents/Title"
import BuyForm from "./Components/BuyForm"
import SellForm from "./Components/SellForm"
import { useContext } from 'react'
import { UserAssetContext } from "Common/Contexts/UserBalanceContext"
import Label from "Components/AtomComponents/Label"
import Paragraph from "Components/AtomComponents/Paragraph"
import StockConsultForm from "./Components/ConsultStockForm"
import styled from "styled-components"
import { displayMonetaryValue } from "utils/displayFunctions"
import ContainerCard from "Components/AtomComponents/ContainerCard"

const HomeBrokerContainer = styled.section`
    display: flex;
    flex-direction: column;
    gap: var(--medium-spacing);
    justify-content: space-around;
`

const UserBalanceContainer = styled.div`
    display: flex;
    gap: var(--default-spacing);
    align-self: center;
    align-items: flex-end;
`

const FormAreaContainer = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
`

const TradeFormsContainer = styled(ContainerCard)`
    min-width: 40%;
    justify-content: flex-start;
`

//Page with the functions to buy and sell stocks
function HomeBrokerPage() {
    const { userBalance } = useContext(UserAssetContext)

    return (
        <HomeBrokerContainer>
            <Title>Home Broker</Title>

            <UserBalanceContainer>
                <Label>User Balance: </Label>
                <Paragraph>{displayMonetaryValue(userBalance)}</Paragraph>
            </UserBalanceContainer>

            <FormAreaContainer>
                <TradeFormsContainer>
                    <StockConsultForm/>
                </TradeFormsContainer>

                <TradeFormsContainer>
                    <BuyForm/>
                    <SellForm/>
                </TradeFormsContainer>
            </FormAreaContainer>
        </HomeBrokerContainer>
    )
}

export default HomeBrokerPage