// ---------- 1. Helper functions ----------

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



// ---------- 2. Main calculation ----------
function updateSavings() {
  const name = document.getElementById("goal-name").value.trim();
  const amount = getValue("goal-amount");   // total needed
  const saved = getValue("goal-saved");     // already saved
  const months = getValue("goal-months");   // time frame

  // What is still missing (never below 0)
  const remaining = Math.max(amount - saved, 0);

  // Monthly saving = what is missing / number of months
  // (if months is 0, we avoid dividing by zero)
  const monthly = months > 0 ? remaining / months : 0;

  // Progress in % (capped at 100)
  const percent = amount > 0 ? Math.min((saved / amount) * 100, 100) : 0;

  // Display the results
  document.getElementById("goal-title").textContent =
    name !== "" ? "Your plan: " + name : "Your plan";

  document.getElementById("monthly-saving").textContent = formatMoney(monthly);
  document.getElementById("remaining-amount").textContent = formatMoney(remaining);
  document.getElementById("saved-amount").textContent = formatMoney(saved);

  document.getElementById("goal-pct").textContent = Math.round(percent) + "%";
  document.getElementById("goal-bar").style.width = percent + "%";

    // ---------- Validation messages ----------
  if (amount === 0 && (name !== "" || saved > 0 || months > 0)) {
    setMessage("savings-message", "info",
      "Enter the amount you need to see your plan.");
  } else if (amount > 0 && saved >= amount) {
    setMessage("savings-message", "success",
      "Goal reached! You already have enough saved. 🎉");
  } else if (amount > 0 && months === 0) {
    setMessage("savings-message", "info",
      "Enter a time frame in months to see how much to save each month.");
  } else {
    setMessage("savings-message", null);
  }
}

// ---------- 3. Events ----------
const form = document.getElementById("savings-form");
const STORAGE_KEY = "smartbudget-savings";

// Restore the saved values (before the first calculation)
loadFormData(form, STORAGE_KEY);

// Save and recalculate every time the user types in any field
form.addEventListener("input", function () {
  saveFormData(form, STORAGE_KEY);
  updateSavings();
});

// Reset button: clear the saved data and the form
document.getElementById("reset-btn").addEventListener("click", function () {
  clearFormData(form, STORAGE_KEY);
  updateSavings();
});

// Stop the page from reloading if the user presses Enter
form.addEventListener("submit", function (event) {
  event.preventDefault();
});
// Redisplay the numbers when the currency changes
document.addEventListener("currencychange", updateSavings);

// Run once when the page opens
updateSavings();