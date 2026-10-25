// ---------- Currency (shared by all pages) ----------

const currencySelect = document.getElementById("currency");

// Read the saved currency (default: MAD)
// try/catch: some browsers block storage in private mode
let currentCurrency = "MAD";
try {
  currentCurrency = localStorage.getItem("smartbudget-currency") || "MAD";
} catch (error) {}

// Formats a number with the chosen currency: 1200 -> "MAD 1,200" / "€1,200" / "$1,200"
function formatMoney(number) {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: currentCurrency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

if (currencySelect) {
  // Show the saved choice in the dropdown
  currencySelect.value = currentCurrency;

  // When the user picks another currency
  currencySelect.addEventListener("change", function () {
    currentCurrency = currencySelect.value;

    try {
      localStorage.setItem("smartbudget-currency", currentCurrency);
    } catch (error) {}

    // Tell the page to redisplay its numbers
    document.dispatchEvent(new Event("currencychange"));
  });
}