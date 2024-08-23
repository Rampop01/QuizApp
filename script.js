// Nav calculator functionality
const calculatorButton = document.getElementById("calculator-button");
const calculatorModal = document.getElementById("calculator-modal");
const display = document.getElementById("calculator-display");
let currentInput = "";

calculatorButton.addEventListener("click", () => {
  calculatorModal.classList.toggle("hidden");
});

calculatorModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-value]")) {
    const value = e.target.getAttribute("data-value");
    currentInput += value;
    display.textContent = currentInput;
  } else if (e.target.id === "equals") {
    try {
      currentInput = eval(currentInput).toString();
      display.textContent = currentInput;
    } catch {
      display.textContent = "Error";
      currentInput = "";
    }
  }
});
