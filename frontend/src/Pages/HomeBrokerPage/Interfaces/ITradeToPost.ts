interface ITradeToPost {
    stockToTrade: string
    qtyToTrade: number
    tradeType: 'BUY' | 'SELL'
}

export default ITradeToPost