import { render, screen } from '@testing-library/react'
import TransferFundsForm from 'Pages/HomePage/Components/TransferFundsForm'
import { useContext } from 'react'
import Form from 'Components/Form'
import IFormProps from 'Components/Form/IFormProps'
import '@testing-library/jest-dom'

jest.mock('react', () => {
	const React = jest.requireActual('react');
    return {
    	...React,
		useContext: jest.fn((context) => {
			return ({
				postDeposit: jest.fn()
			})
		})
        
	}
})

jest.mock('Components/Form', () => jest.fn())

describe('TransferFundsForm component', () => {
    // Mock the UserBalanceContext
    const mockUserBalanceContext = {
        postDeposit: jest.fn()
    }

    const mockedUseContext = useContext as jest.MockedFunction<typeof useContext>
    
    
    const mockedFormComponent = ({ fields, onSubmit }: IFormProps) => {
        onSubmit(fields)
        return(
            <>
                <p>Mock Form</p>
                <p>{`name: ${fields[0].name}`}</p>
                <p>{`type: ${fields[0].type}`}</p>
                <p>{`value: ${fields[0].value}`}</p>
            </>
        )
    }
    
    const MockedForm = Form as jest.MockedFunction<typeof Form>
    
    beforeEach(() => {
        MockedForm.mockImplementation(mockedFormComponent)
        mockedUseContext.mockReturnValue(mockUserBalanceContext)
    })

    test('should call postDeposit with correct funds value', () => {
      
        // Render the component
        render(<TransferFundsForm />)

        // Check that postDeposit was called with the correct funds value
        expect(mockUserBalanceContext.postDeposit).toHaveBeenCalledWith(0)

        //called the form component with the correct prop fields
        const formTitle = screen.getByText('Mock Form')
        expect(formTitle).toBeInTheDocument()
        const formFieldName = screen.getByText('name', {exact: false})
        expect(formFieldName.textContent).toEqual(expect.stringContaining('Funds to Transfer'))
        const formFieldType = screen.getByText('type', {exact: false})
        expect(formFieldType.textContent).toEqual(expect.stringContaining('number'))

    })
      
})


