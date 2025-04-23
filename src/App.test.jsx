// spec.cy.js
describe('Expense Tracker Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
    // Wait for app to load
    cy.contains('Expense Tracker', { timeout: 10000 })
  })

  it('should load the home page correctly', () => {
    cy.contains('Expense Tracker')
    cy.contains('Wallet Balance')
  })

  it('should display wallet balance and expenses cards', () => {
    cy.contains('Wallet Balance: $5000.00')
    cy.contains('Expenses').should('be.visible')
    cy.contains('Transactions').should('be.visible')
  })

  it('should have a visible header with correct text', () => {
    cy.get('header').should('be.visible')
    cy.contains('Expense Tracker').should('be.visible')
  })

  it('should have a button to add income and it should be styled correctly', () => {
    cy.get('[data-testid=add-income-button]')
      .should('be.visible')
      .should('have.css', 'background-color')
  })

  it('should be responsive for mobile view', () => {
    cy.viewport('iphone-x')
    cy.contains('Expenses').should('be.visible')
    cy.contains('Transactions').should('be.visible')
  })

  it('Adds an income successfully', () => {
    cy.get('[data-testid=add-income-button]').click()
    cy.get('[aria-label="Income Amount"]').type('1000')
    cy.contains('Add Balance').click()
    cy.contains('Wallet Balance: $6000.00')
  })

  it('Displays added expense in the transaction list', () => {
    cy.get('[data-testid=add-expense-button]').click()
    cy.get('[aria-label="Title"]').type('Test Expense')
    cy.get('[aria-label="Amount"]').type('100')
    cy.get('[aria-label="Category"]').select('Food')
    cy.get('[aria-label="Date"]').type('2023-12-25')
    cy.contains('Add Expense').click()
    
    cy.contains('Transactions')
      .parent()
      .within(() => {
        cy.contains('Test Expense')
        cy.contains('$100.00')
      })
  })

  it('Displays added food and travel expenses in the transaction list', () => {
    // Add food expense
    cy.get('[data-testid=add-expense-button]').click()
    cy.get('[aria-label="Title"]').type('Food Expense')
    cy.get('[aria-label="Amount"]').type('50')
    cy.get('[aria-label="Category"]').select('Food')
    cy.get('[aria-label="Date"]').type('2023-12-25')
    cy.contains('Add Expense').click()

    // Add travel expense
    cy.get('[data-testid=add-expense-button]').click()
    cy.get('[aria-label="Title"]').type('Travel Expense')
    cy.get('[aria-label="Amount"]').type('100')
    cy.get('[aria-label="Category"]').select('Travel')
    cy.get('[aria-label="Date"]').type('2023-12-26')
    cy.contains('Add Expense').click()

    cy.contains('Transactions')
      .parent()
      .within(() => {
        cy.contains('Food Expense')
        cy.contains('Travel Expense')
      })
  })

  it('Persists data in localStorage', () => {
    cy.get('[data-testid=add-expense-button]').click()
    cy.get('[aria-label="Title"]').type('Test Expense')
    cy.get('[aria-label="Amount"]').type('100')
    cy.get('[aria-label="Category"]').select('Food')
    cy.get('[aria-label="Date"]').type('2023-12-25')
    cy.contains('Add Expense').click()

    // Reload page and verify data persists
    cy.reload()
    cy.contains('Test Expense').should('be.visible')
  })
})