import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'
import AppWithSnackbar from './App'

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock recharts responsive container due to test environment limitations
jest.mock('recharts', () => ({
	ResponsiveContainer: ({ children }) => children,
	PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
	Pie: () => null,
	Cell: () => null,
	BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
	Bar: () => null,
	XAxis: () => null,
	YAxis: () => null,
	CartesianGrid: () => null,
	Tooltip: () => null,
	Legend: () => null
}))

describe('App Component', () => {
	beforeEach(() => {
		localStorage.clear()
		jest.clearAllMocks()
	})

	test('renders expense tracker header', () => {
		render(<AppWithSnackbar />)
		expect(screen.getByText('Expense Tracker')).toBeInTheDocument()
	})

	test('displays initial wallet balance', () => {
		render(<AppWithSnackbar />)
		expect(screen.getByText('Wallet Balance: $5000.00')).toBeInTheDocument()
	})

	test('can add income', async () => {
		render(<AppWithSnackbar />)
		
		fireEvent.click(screen.getByTestId('add-income-button'))
		const incomeInput = screen.getByLabelText('Income Amount')
		await userEvent.type(incomeInput, '1000')
		fireEvent.click(screen.getByText('Add Balance'))

		expect(await screen.findByText('Wallet Balance: $6000.00')).toBeInTheDocument()
	})

	test('can add expense', async () => {
		render(<AppWithSnackbar />)
		
		fireEvent.click(screen.getByTestId('add-expense-button'))
		
		await userEvent.type(screen.getByLabelText('Title'), 'Test Expense')
		await userEvent.type(screen.getByLabelText('Amount'), '100')
		await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food')
		await userEvent.type(screen.getByLabelText('Date'), '2023-12-25')
		
		fireEvent.click(screen.getByText('Add Expense'))

		expect(await screen.findByText('Test Expense')).toBeInTheDocument()
		expect(await screen.findByText('$100.00')).toBeInTheDocument()
	})

	test('can edit expense', async () => {
		render(<AppWithSnackbar />)
		
		// First add an expense
		fireEvent.click(screen.getByTestId('add-expense-button'))
		await userEvent.type(screen.getByLabelText('Title'), 'Original Expense')
		await userEvent.type(screen.getByLabelText('Amount'), '100')
		await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food')
		await userEvent.type(screen.getByLabelText('Date'), '2023-12-25')
		fireEvent.click(screen.getByText('Add Expense'))

		// Edit the expense
		const editButton = screen.getByLabelText('Edit expense')
		fireEvent.click(editButton)
		
		const titleInput = screen.getByLabelText('Title')
		await userEvent.clear(titleInput)
		await userEvent.type(titleInput, 'Updated Expense')
		
		fireEvent.click(screen.getByText('Update Expense'))

		expect(await screen.findByText('Updated Expense')).toBeInTheDocument()
	})

	test('can delete expense', async () => {
		render(<AppWithSnackbar />)
		
		// Add an expense
		fireEvent.click(screen.getByTestId('add-expense-button'))
		await userEvent.type(screen.getByLabelText('Title'), 'Test Expense')
		await userEvent.type(screen.getByLabelText('Amount'), '100')
		await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food')
		await userEvent.type(screen.getByLabelText('Date'), '2023-12-25')
		fireEvent.click(screen.getByText('Add Expense'))

		// Delete the expense
		const deleteButton = screen.getByLabelText('Delete expense')
		fireEvent.click(deleteButton)

		await waitFor(() => {
			expect(screen.queryByText('Test Expense')).not.toBeInTheDocument()
		})
	})

	test('validates expense form inputs', async () => {
		render(<AppWithSnackbar />)
		
		fireEvent.click(screen.getByTestId('add-expense-button'))
		fireEvent.click(screen.getByText('Add Expense'))

		expect(await screen.findByText('Please enter an expense title')).toBeInTheDocument()
	})

	test('persists data in localStorage', async () => {
		render(<AppWithSnackbar />)
		
		fireEvent.click(screen.getByTestId('add-expense-button'))
		await userEvent.type(screen.getByLabelText('Title'), 'Test Expense')
		await userEvent.type(screen.getByLabelText('Amount'), '100')
		await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food')
		await userEvent.type(screen.getByLabelText('Date'), '2023-12-25')
		fireEvent.click(screen.getByText('Add Expense'))

		expect(localStorage.setItem).toHaveBeenCalled()
	})

	test('renders charts when expenses exist', async () => {
		render(<AppWithSnackbar />)
		
		expect(screen.getByText('No expenses to display')).toBeInTheDocument()
		
		// Add an expense
		fireEvent.click(screen.getByTestId('add-expense-button'))
		await userEvent.type(screen.getByLabelText('Title'), 'Test Expense')
		await userEvent.type(screen.getByLabelText('Amount'), '100')
		await userEvent.selectOptions(screen.getByLabelText('Category'), 'Food')
		await userEvent.type(screen.getByLabelText('Date'), '2023-12-25')
		fireEvent.click(screen.getByText('Add Expense'))

		expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
		expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
	})
})