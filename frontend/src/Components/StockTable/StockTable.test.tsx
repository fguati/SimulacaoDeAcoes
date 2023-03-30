import { render, screen } from "@testing-library/react";
import StockTable from ".";
import '@testing-library/jest-dom'
import IStock from "Interfaces/IStock";

const propertyToHeadersMap = {
    id: 'id',
    ticker: 'Ticker',
    companyName: 'Nome',
    qty: 'Quantidade de Ações',
    currentPrice: 'Preço Atual',
    totalValue: 'Valor Total'
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

function getRandomIntUpTo(max: number) {
    return Math.floor(Math.random() * (max + 1)) + 1;
}

describe('Test the correct rendering of the stock table', () => {
    beforeEach(() => {
        render(<StockTable stockList={exampleStockList}/>)
    })

    test('must render a table with the correct number of headers and rows', () => {
        const renderedTable = screen.getByRole('table')

        expect(renderedTable).toHaveAttribute('cols', '6')
        expect(renderedTable).toHaveAttribute('rows', (exampleStockList.length + 1).toString())
    })

    test('the value of any cell selected randomly from the rendered table must match the stock list entered as prop', () => {
        const renderedTable = screen.getByRole('table')
        const renderedCells = renderedTable.querySelectorAll('div')

        function getValueFromCell(col:number, row: number) {
            if(row == 1) {
                return headers[col]
            }

            const stock = exampleStockList[row - 2]

            if(col == numberOfColumns) {
                return (stock.qty * stock.currentPrice).toFixed(2)
            }

            const property = stockProperties[col - 1]
            return stock[property as keyof IStock]

        }

        const selectedCellRow = getRandomIntUpTo(numberOfRows)
        const selectedCellCol = getRandomIntUpTo(numberOfColumns)
        const selectedCellIndex = numberOfColumns * (selectedCellRow - 1) - 1 + selectedCellCol
        const selectedCell = renderedCells[selectedCellIndex]
        const selectedCellValue = getValueFromCell(selectedCellCol, selectedCellRow)
        
        expect(selectedCell).toHaveTextContent(selectedCellValue!.toString())

    })
})