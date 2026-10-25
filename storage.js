// ---------- Saving data in the browser (shared by all pages) ----------

// Saves every input of a form under a given key
function saveFormData(form, key) {
  const data = {};
  form.querySelectorAll("input").forEach(function (input) {
    data[input.id] = input.value;
  });

  // try/catch: storage can be blocked (private mode, browser settings)
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {}
}

// Puts the saved values back into the form fields
function loadFormData(form, key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) return;

    form.querySelectorAll("input").forEach(function (input) {
      if (data[input.id] !== undefined) {
        input.value = data[input.id];
      }
    });
  } catch (error) {}
}

// Deletes the saved data and empties the form
function clearFormData(form, key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {}
  form.reset();
}