import { render, screen } from "@testing-library/react";
import StockTable from ".";
import '@testing-library/jest-dom'
import IStock from "Interfaces/IStock";

const propertyToHeadersMap = {
    id: 'id',
    ticker: 'Ticker',
    companyName: 'Company Name',
    qty: 'Stock quantity',
    currentPrice: 'Current Price',
    totalValue: 'Total Value'
}

const exampleStockList: IStock[] = [
    {
        id: Math.random().toString(),
        ticker: 'WEGE3',
        companyName: 'Weg',
        qty: 237,
        currentPrice: 25.37,
    },
    {
        id: Math.random().toString(),
        ticker: 'EGIE3',
        companyName: 'Engie',
        qty: 315,
        currentPrice:15.17,
    },
    {
        id: Math.random().toString(),
        ticker: 'ITUB4',
        companyName: 'Banco Itaú',
        qty: 17,
        currentPrice: 155.48,
    }
]

const headers = Object.values(propertyToHeadersMap)
const stockProperties = Object.keys(exampleStockList[0])

const numberOfColumns = headers.length
const numberOfRows = exampleStockList.length

describe('Test the correct rendering of the stock table', () => {

    test('must render a table with the correct number of headers and rows', () => {
        render(<StockTable stockList={exampleStockList}/>)

        const renderedTable = screen.getByRole('table')

        expect(renderedTable).toHaveAttribute('cols', numberOfColumns.toString())
        expect(renderedTable).toHaveAttribute('rows', (exampleStockList.length + 1).toString())
    })

    test('the value of every cell from the rendered table must match the stock list entered as prop', () => {
        render(<StockTable stockList={exampleStockList}/>)
        
        const renderedTable = screen.getByRole('table')
        // eslint-disable-next-line testing-library/no-node-access
        const renderedCells = renderedTable.querySelectorAll('div')

        function getValueFromCell(col:number, row: number) {
            if(row === 1) {
                return headers[col - 1]
            }

            const stock = exampleStockList[row - 2]

            if(col === numberOfColumns) {
                return (stock.qty * stock.currentPrice).toFixed(2)
            }

            const property = stockProperties[col - 1]
            return stock[property as keyof IStock]

        }

        for(let selectedCellRow = 1; selectedCellRow <= numberOfRows; selectedCellRow++) {
            for(let selectedCellCol = 1; selectedCellCol <= numberOfColumns; selectedCellCol++) {
                const selectedCellIndex = numberOfColumns * (selectedCellRow - 1) - 1 + selectedCellCol
                const selectedCell = renderedCells[selectedCellIndex]
                const selectedCellValue = getValueFromCell(selectedCellCol, selectedCellRow)
                expect(selectedCell).toHaveTextContent(selectedCellValue!.toString())

            }
        }

    })
})