import { renderHook } from "@testing-library/react-hooks";
import { useNavigate } from "react-router-dom";
import useFetchPortfolio from 'Pages/HomePage/utils/fetchPortfolio';
import fetchFromServer from "utils/BackendAPICommunication/http/httpServerFetch";
import { handleErrorResponse } from "utils/BackendAPICommunication";
import IServerPositionRes from "Interfaces/IServerPositionRes";
import { fetchStockInfo } from "utils/FinanceAPIComm";
import IApiStock from "Interfaces/IApiStock";
import IStock from "Interfaces/IStock";

jest.mock("utils/BackendAPICommunication/http/httpServerFetch", () => jest.fn());
jest.mock("utils/BackendAPICommunication", () => ({
    handleErrorResponse: jest.fn(),
}));
jest.mock("react-router-dom", () => {
    const originalModule = jest.requireActual("react-router-dom")
    return {
        ...originalModule,
        useNavigate: jest.fn()
    }
})
jest.mock('utils/FinanceAPIComm', () => ({
    fetchStockInfo: jest.fn()
}))

describe('Test the hook responsible for fetching the user portfolio from server', () => {
    const mockNavigate = jest.fn();
    const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
    const mockFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>
    const mockFetchFromWebAPI = fetchStockInfo as jest.MockedFunction<typeof fetchStockInfo>

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    test("should fetch portfolio and return stock list when successful response received", async () => {
        const mockWebAPIResponse: IApiStock[] = [
            {ticker: 'A', companyName: 'Company A', currentPrice: 22.37, currency: 'BRL'},
            {ticker: 'B', companyName: 'Company B', currentPrice: 10.27, currency: 'USD'}
        ]

        const mockServerResponse: IServerPositionRes[] = [
            {averagePrice: 17.87, qty: 132, stockTicker: 'A', userId:'1'},
            {averagePrice: 12.16, qty: 234, stockTicker: 'B', userId:'1'}
        ]

        const mockResponse = {
            code: 200,
            body: mockServerResponse,
            ok: true,
        };

        const expectedResult: IStock[] = [
            { 
                id: mockServerResponse[0].stockTicker, 
                companyName: mockWebAPIResponse[0].companyName, 
                currentPrice: mockWebAPIResponse[0].currentPrice, 
                qty: mockServerResponse[0].qty, 
                ticker: mockServerResponse[0].stockTicker,
                averagePrice: mockServerResponse[0].averagePrice,
                currency: mockWebAPIResponse[0].currency,
                totalValue: mockServerResponse[0].qty * mockWebAPIResponse[0].currentPrice 
            },
            { 
                id: mockServerResponse[1].stockTicker, 
                companyName: mockWebAPIResponse[1].companyName, 
                currentPrice: mockWebAPIResponse[1].currentPrice, 
                qty: mockServerResponse[1].qty, 
                ticker: mockServerResponse[1].stockTicker,
                averagePrice: mockServerResponse[1].averagePrice,
                currency: mockWebAPIResponse[1].currency,
                totalValue: mockServerResponse[1].qty * mockWebAPIResponse[1].currentPrice 
            }
        ];
        
        
        mockFetchFromServer.mockResolvedValue(mockResponse);
        mockFetchFromWebAPI.mockResolvedValue(mockWebAPIResponse);

        const { result } = renderHook(() => useFetchPortfolio());

        expect(result.current).toBeInstanceOf(Function);

        const fetchPortfolio = result.current;

        const fetchReturn = await fetchPortfolio();

        expect(fetchFromServer).toHaveBeenCalledWith("/user/portfolio");
        expect(result.error).toBeUndefined();
        expect(fetchReturn).toEqual(expectedResult);
    });

    test("should handle error response and navigate to error page when error occurred in request to server", async () => {
        const mockError = new Error("Some error message");
        const mockErrorResponse = {
            code: 500,
            message: mockError.message,
            name: "Internal Server Error",
        };
        mockFetchFromServer.mockRejectedValue(mockError);

        const { result } = renderHook(() => useFetchPortfolio());

        expect(result.current).toBeInstanceOf(Function);

        const fetchPortfolio = result.current;

        await fetchPortfolio();

        expect(fetchFromServer).toHaveBeenCalledWith("/user/portfolio");
        expect(handleErrorResponse).toHaveBeenCalledWith(mockErrorResponse, mockNavigate);
        expect(result.error).toBeUndefined();
    });

    test("should handle error response and navigate to error page when error occurred in request to web API", async () => {
        const mockError = new Error("Some error message");
        const mockErrorResponse = {
            code: 500,
            message: mockError.message,
            name: "Internal Server Error",
        };

        const mockServerResponse: IServerPositionRes[] = [
            {averagePrice: 17.87, qty: 132, stockTicker: 'A', userId:'1'},
            {averagePrice: 12.16, qty: 234, stockTicker: 'B', userId:'1'}
        ]

        const mockResponse = {
            code: 200,
            body: mockServerResponse,
            ok: true,
        };

        mockFetchFromServer.mockResolvedValue(mockResponse)
        mockFetchFromWebAPI.mockRejectedValue(mockError);

        const { result } = renderHook(() => useFetchPortfolio());

        expect(result.current).toBeInstanceOf(Function);

        const fetchPortfolio = result.current;

        await fetchPortfolio();

        expect(fetchFromServer).toHaveBeenCalledWith("/user/portfolio");
        expect(handleErrorResponse).toHaveBeenCalledWith(mockErrorResponse, mockNavigate);
        expect(result.error).toBeUndefined();
    })
});
  
