import { renderHook } from "@testing-library/react-hooks";
import { useNavigate } from "react-router-dom";
import useFetchPortfolio from 'Pages/HomePage/utils/fetchPortfolio';
import fetchFromServer from "utils/BackendAPICommunication/http/httpServerFetch";
import { handleErrorResponse } from "utils/BackendAPICommunication";
import IServerPositionRes from "Interfaces/IServerPositionRes";

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

describe('Test the hook responsible for fetching the user portfolio from server', () => {
    const mockNavigate = jest.fn();
    const mockUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>
    const mockFetchFromServer = fetchFromServer as jest.MockedFunction<typeof fetchFromServer>

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    test("should fetch portfolio and return stock list when successful response received", async () => {
        const mockStockList = [
            { id: 'A', companyName: "A", currentPrice: 10, qty: 5, ticker: "A", totalValue: 50 },
            { id: 'B', companyName: "B", currentPrice: 20, qty: 3, ticker: "B", totalValue: 60 },
        ];

        const mockServerResponse: IServerPositionRes[] = [
            {averagePrice: mockStockList[0].currentPrice, qty: mockStockList[0].qty, stockTicker: mockStockList[0].ticker, userId:'1'},
            {averagePrice: mockStockList[1].currentPrice, qty: mockStockList[1].qty, stockTicker: mockStockList[1].ticker, userId:'1'}
        ]
        
        const mockResponse = {
            code: 200,
            body: mockServerResponse,
            ok: true,
        };
        mockFetchFromServer.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useFetchPortfolio());

        expect(result.current).toBeInstanceOf(Function);

        const fetchPortfolio = result.current;

        const fetchReturn = await fetchPortfolio();

        expect(fetchFromServer).toHaveBeenCalledWith("/user/portfolio");
        expect(result.error).toBeUndefined();
        expect(fetchReturn).toEqual(mockStockList);
    });

    test("should handle error response and navigate to error page when error occurred", async () => {
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
});
  
