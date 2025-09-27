// Elements
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

// Load from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Event Listener
transactionFormEl.addEventListener("submit", addTransaction);

// Add Transaction
function addTransaction(e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  if (!description || isNaN(amount) || amount === 0) {
    alert("Please enter a valid description and amount (not zero).");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description,
    amount,
  };

  // Add new transaction at the beginning
  transactions.unshift(newTransaction);

  saveTransactions();
  render();

  transactionFormEl.reset();
}

// Update Transactions List
function updateTransactionList() {
  transactionListEl.innerHTML = "";

  transactions.forEach((transaction) => {
    const li = createTransactionElement(transaction);
    transactionListEl.appendChild(li);
  });
}

// Create Transaction Item
function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add(
    "transaction",
    transaction.amount > 0 ? "income" : "expense"
  );

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
      ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
      })">x</button>
    </span>
  `;

  return li;
}

// Update Summary (Balance, Income, Expenses)
function updateSummary() {
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + t.amount, 0);

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(Math.abs(expenses));
}

// Format Currency
function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();
  render();
}

// Save to localStorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render UI
function render() {
  updateTransactionList();
  updateSummary();
}

// Initial Render
render();
