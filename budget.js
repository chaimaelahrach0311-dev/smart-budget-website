// ---------- 1. Data ----------
// The ids of the 5 expense fields in budget.html
const categories = ["rent", "transport", "shopping", "bills", "other"];

// ---------- 2. Helper functions ----------

// Reads a field by its id and returns a safe number
// (empty or negative field -> 0)
function getValue(id) {
  const value = parseFloat(document.getElementById(id).value);
  if (isNaN(value) || value < 0) {
    return 0;
  }
  return value;
}
// Shows a message in a box (type: "warning", "success" or "info").
// With type = null, the box is hidden.
function setMessage(id, type, text) {
  const box = document.getElementById(id);

  if (!type) {
    box.hidden = true;
    box.textContent = "";
    return;
  }

  box.className = "message message-" + type;
  box.textContent = text;
  box.hidden = false;
}



// ---------- 3. Main calculation ----------
function updateBudget() {
  const income = getValue("income");

  // Add up all the expenses
  let total = 0;
  categories.forEach(function (id) {
    total += getValue(id);
  });

  const remaining = income - total;

  // Display the summary
  document.getElementById("summary-income").textContent = formatMoney(income);
  document.getElementById("summary-total").textContent = formatMoney(total);

  const remainingElement = document.getElementById("summary-remaining");
  remainingElement.textContent = formatMoney(remaining);

  // Red if you have allocated more than your income
  remainingElement.style.color = remaining < 0 ? "#b5483a" : "";

  // Update each progress bar (% of income)
  categories.forEach(function (id) {
    const amount = getValue(id);
    const percent = income > 0 ? (amount / income) * 100 : 0;

    document.getElementById("pct-" + id).textContent = Math.round(percent) + "%";
    document.getElementById("bar-" + id).style.width = Math.min(percent, 100) + "%";
  });
    // ---------- Validation messages ----------
  // Round to avoid tiny decimal errors (0.1 + 0.2 = 0.30000000000000004)
  const diff = Math.round(remaining * 100) / 100;

  if (income === 0 && total === 0) {
    setMessage("budget-message", null);
  } else if (income === 0) {
    setMessage("budget-message", "info",
      "Enter your monthly income to see how your budget splits.");
  } else if (diff < 0) {
    setMessage("budget-message", "warning",
      "You have allocated " + formatMoney(-diff) + " more than your income. Try reducing some expenses.");
  } else if (diff === 0) {
    setMessage("budget-message", "info",
      "Your whole income is allocated. Nothing is left for savings or surprises.");
  } else if (total > 0) {
    setMessage("budget-message", "success",
      "You have " + formatMoney(diff) + " left. Why not put it toward a savings goal?");
  } else {
    setMessage("budget-message", null);
  }
}

// ---------- 4. Events ----------
const form = document.getElementById("budget-form");
const STORAGE_KEY = "smartbudget-budget";

// Restore the saved values (before the first calculation)
loadFormData(form, STORAGE_KEY);

// Save and recalculate every time the user types in any field
form.addEventListener("input", function () {
  saveFormData(form, STORAGE_KEY);
  updateBudget();
});

// Reset button: clear the saved data and the form
document.getElementById("reset-btn").addEventListener("click", function () {
  clearFormData(form, STORAGE_KEY);
  updateBudget();
});

// Stop the page from reloading if the user presses Enter
form.addEventListener("submit", function (event) {
  event.preventDefault();
});
// Redisplay the numbers when the currency changes
document.addEventListener("currencychange", updateBudget);

// Run once when the page opens
updateBudget();