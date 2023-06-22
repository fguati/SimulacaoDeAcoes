import { render, screen } from '@testing-library/react';
import { UserAssetContext } from 'Common/Contexts/UserBalanceContext';
import HomeBrokerPage from '..';
import '@testing-library/jest-dom'

jest.mock('../Components/BuyForm', () => () => <div data-testid="buy-form-mock" />);
jest.mock('../Components/SellForm', () => () => <div data-testid="sell-form-mock" />);

describe('HomeBrokerPage', () => {
    const mockUserContext = {
        userBalance: 1000,
        postDeposit: jest.fn(),
        stockList: [],
        updateUserAssets: jest.fn()
    }

    const renderHomeBrokerPage = () => {
        render(
            <UserAssetContext.Provider value={mockUserContext}>
                <HomeBrokerPage />
            </UserAssetContext.Provider>
        );
    }
    
    test('renders the title', () => {
        renderHomeBrokerPage()
        const titleElement = screen.getByText('Home Broker');
        expect(titleElement).toBeInTheDocument();
    });

    test('displays the user balance', () => {
        renderHomeBrokerPage()

        const balanceElement = screen.getByText('User Balance:');
        const userBalanceElement = screen.getByText('R$ 1000.00');
        expect(balanceElement).toBeInTheDocument();
        expect(userBalanceElement).toBeInTheDocument();
    });

    test('renders the BuyForm and SellForm components', () => {
        renderHomeBrokerPage()
    
        const buyFormMock = screen.getByTestId('buy-form-mock');
        const sellFormMock = screen.getByTestId('sell-form-mock');
    
        expect(buyFormMock).toBeInTheDocument();
        expect(sellFormMock).toBeInTheDocument();
      });
});
