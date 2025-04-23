import { useState, useEffect } from 'react'
import './App.css'
import Modal from 'react-modal'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FaEdit, FaTrash } from 'react-icons/fa'

// Set app element for accessibility
Modal.setAppElement('#root')

// Custom modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '500px',
    width: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
}

// Category options with colors
const CATEGORIES = [
  { name: 'Food', color: '#FF6384' },
  { name: 'Travel', color: '#36A2EB' },
  { name: 'Entertainment', color: '#FFCE56' },
  { name: 'Shopping', color: '#4BC0C0' },
  { name: 'Utilities', color: '#9966FF' },
  { name: 'Health', color: '#FF9F40' },
  { name: 'Other', color: '#C9CBCF' }
]

function App() {
  // State for wallet balance and expenses
  const [walletBalance, setWalletBalance] = useState(5000)
  const [expenses, setExpenses] = useState([])

  // State for modals
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)

  // State for form inputs
  const [incomeAmount, setIncomeAmount] = useState('')
  const [expenseData, setExpenseData] = useState({
    title: '',
    price: '',
    category: '',
    date: ''
  })

  // State for editing
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  // Get snackbar from notistack
  const { enqueueSnackbar } = useSnackbar()

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    const savedBalance = localStorage.getItem('walletBalance')

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }

    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance))
    }
  }, [])

  // Save data to localStorage whenever expenses or balance changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
    localStorage.setItem('walletBalance', walletBalance.toString())
  }, [expenses, walletBalance])

  // Handle income form submission
  const handleAddIncome = (e) => {
    e.preventDefault()

    if (!incomeAmount || isNaN(incomeAmount) || parseFloat(incomeAmount) <= 0) {
      enqueueSnackbar('Please enter a valid income amount', { variant: 'error' })
      return
    }

    const amount = parseFloat(incomeAmount)
    setWalletBalance(prevBalance => prevBalance + amount)
    enqueueSnackbar(`$${amount.toFixed(2)} added to wallet`, { variant: 'success' })
    setIncomeAmount('')
    setIsIncomeModalOpen(false)
  }

  // Handle expense form input changes
  const handleExpenseChange = (e) => {
    const { name, value } = e.target
    setExpenseData(prev => ({ ...prev, [name]: value }))
  }

  // Handle expense form submission
  const handleAddExpense = (e) => {
    e.preventDefault()

    // Validate all fields
    if (!expenseData.title.trim()) {
      enqueueSnackbar('Please enter an expense title', { variant: 'error' })
      return
    }

    if (!expenseData.price || isNaN(expenseData.price) || parseFloat(expenseData.price) <= 0) {
      enqueueSnackbar('Please enter a valid expense amount', { variant: 'error' })
      return
    }

    if (!expenseData.category) {
      enqueueSnackbar('Please select a category', { variant: 'error' })
      return
    }

    if (!expenseData.date) {
      enqueueSnackbar('Please select a date', { variant: 'error' })
      return
    }

    const amount = parseFloat(expenseData.price)

    // Check if wallet has enough balance
    if (amount > walletBalance) {
      enqueueSnackbar('Not enough balance in wallet', { variant: 'error' })
      return
    }

    if (isEditing) {
      // Update existing expense
      const updatedExpenses = expenses.map(expense => {
        if (expense.id === editId) {
          // Adjust wallet balance (add back old amount, subtract new amount)
          const oldAmount = parseFloat(expense.price)
          setWalletBalance(prevBalance => prevBalance + oldAmount - amount)

          return {
            ...expense,
            title: expenseData.title,
            price: amount,
            category: expenseData.category,
            date: expenseData.date
          }
        }
        return expense
      })

      setExpenses(updatedExpenses)
      enqueueSnackbar('Expense updated successfully', { variant: 'success' })
    } else {
      // Add new expense
      const newExpense = {
        id: Date.now(),
        title: expenseData.title,
        price: amount,
        category: expenseData.category,
        date: expenseData.date
      }

      setExpenses(prev => [...prev, newExpense])
      setWalletBalance(prevBalance => prevBalance - amount)
      enqueueSnackbar('Expense added successfully', { variant: 'success' })
    }

    // Reset form and close modal
    setExpenseData({ title: '', price: '', category: '', date: '' })
    setIsExpenseModalOpen(false)
    setIsEditing(false)
    setEditId(null)
  }

  // Handle edit expense
  const handleEditExpense = (expense) => {
    setIsEditing(true)
    setEditId(expense.id)
    setExpenseData({
      title: expense.title,
      price: expense.price.toString(),
      category: expense.category,
      date: expense.date
    })
    setIsExpenseModalOpen(true)
  }

  // Handle delete expense
  const handleDeleteExpense = (expense) => {
    // Add back the expense amount to wallet balance
    setWalletBalance(prevBalance => prevBalance + parseFloat(expense.price))

    // Remove expense from list
    setExpenses(prev => prev.filter(item => item.id !== expense.id))
    enqueueSnackbar('Expense deleted successfully', { variant: 'success' })
  }

  // Prepare data for pie chart
  const getPieChartData = () => {
    const categoryTotals = {}

    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.price)
      } else {
        categoryTotals[expense.category] = parseFloat(expense.price)
      }
    })

    return Object.keys(categoryTotals).map(category => ({
      name: category,
      value: categoryTotals[category],
      color: CATEGORIES.find(c => c.name === category)?.color || '#C9CBCF'
    }))
  }

  // Prepare data for bar chart
  const getBarChartData = () => {
    const categoryTotals = {}

    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += parseFloat(expense.price)
      } else {
        categoryTotals[expense.category] = parseFloat(expense.price)
      }
    })

    return Object.keys(categoryTotals).map(category => ({
      name: category,
      amount: categoryTotals[category]
    }))
  }

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>

      {/* Wallet Section */}
      <div className="wallet-section">
        <h2>Wallet Balance: ${walletBalance.toFixed(2)}</h2>
        <button
          type="button"
          className="add-income-btn"
          onClick={() => setIsIncomeModalOpen(true)}
        >
          + Add Income
        </button>
        <button
          type="button"
          className="add-expense-btn"
          onClick={() => setIsExpenseModalOpen(true)}
        >
          + Add Expense
        </button>
      </div>

      {/* Expense Summary Section */}
      <div className="summary-section">
        <div className="charts-container">
          {/* Pie Chart */}
          <div className="chart-box">
            <h2>Expense Summary</h2>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getPieChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getPieChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p>No expenses to display</p>
            )}
          </div>

          {/* Bar Chart */}
          <div className="chart-box">
            <h2>Expense Trends</h2>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getBarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No expenses to display</p>
            )}
          </div>
        </div>
      </div>

      {/* Expense List Section */}
      <div className="expense-list-section">
        <h2>Expense History</h2>
        {expenses.length > 0 ? (
          <div className="expense-list">
            {expenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-details">
                  <h3>{expense.title}</h3>
                  <p className="expense-category">{expense.category}</p>
                  <p className="expense-date">{expense.date}</p>
                  <p className="expense-amount">${parseFloat(expense.price).toFixed(2)}</p>
                </div>
                <div className="expense-actions">
                  <button onClick={() => handleEditExpense(expense)} className="edit-btn">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteExpense(expense)} className="delete-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No expenses to display</p>
        )}
      </div>

      {/* Income Modal */}
      <Modal
        isOpen={isIncomeModalOpen}
        onRequestClose={() => setIsIncomeModalOpen(false)}
        style={customStyles}
        contentLabel="Add Income Modal"
      >
        <h2>Add Income</h2>
        <form onSubmit={handleAddIncome}>
          <div className="form-group">
            <label htmlFor="income-amount">Income Amount</label>
            <input
              type="number"
              id="income-amount"
              placeholder="Income Amount"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsIncomeModalOpen(false)}>Cancel</button>
            <button type="submit">Add Balance</button>
          </div>
        </form>
      </Modal>

      {/* Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onRequestClose={() => {
          setIsExpenseModalOpen(false)
          setIsEditing(false)
          setExpenseData({ title: '', price: '', category: '', date: '' })
        }}
        style={customStyles}
        contentLabel="Add Expense Modal"
      >
        <h2>{isEditing ? 'Edit Expense' : 'Add Expense'}</h2>
        <form onSubmit={handleAddExpense}>
          <div className="form-group">
            <label htmlFor="expense-title">Title</label>
            <input
              type="text"
              id="expense-title"
              name="title"
              placeholder="Expense Title"
              value={expenseData.title}
              onChange={handleExpenseChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expense-amount">Amount</label>
            <input
              type="number"
              id="expense-amount"
              name="price"
              placeholder="Expense Amount"
              value={expenseData.price}
              onChange={handleExpenseChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="expense-category">Category</label>
            <select
              id="expense-category"
              name="category"
              value={expenseData.category}
              onChange={handleExpenseChange}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(category => (
                <option key={category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="expense-date">Date</label>
            <input
              type="date"
              id="expense-date"
              name="date"
              value={expenseData.date}
              onChange={handleExpenseChange}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setIsExpenseModalOpen(false)
                setIsEditing(false)
                setExpenseData({ title: '', price: '', category: '', date: '' })
              }}
            >
              Cancel
            </button>
            <button type="submit">{isEditing ? 'Update Expense' : 'Add Expense'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// Wrap App with SnackbarProvider
function AppWithSnackbar() {
  return (
    <SnackbarProvider maxSnack={3}>
      <App />
    </SnackbarProvider>
  )
}

export default AppWithSnackbar
