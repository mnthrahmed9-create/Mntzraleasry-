
import "./style.css";

type Operator = "+" | "−" | "×" | "÷";

let current = "0";
let previous = "";
let operator: Operator | null = null;
let reset = false;

document.body.innerHTML = `
<div class="calculator">
  <h1>✳ NEON CALC</h1>
  <p>الحاسبة الاحترافية</p>

  <div class="display">
    <div id="expression"></div>
    <div id="result">0</div>
  </div>

  <div class="keys">
    <button data-action="clear">AC</button>
    <button data-action="delete">⌫</button>
    <button data-value="%">%</button>
    <button class="operator" data-value="÷">÷</button>

    <button data-value="7">7</button>
    <button data-value="8">8</button>
    <button data-value="9">9</button>
    <button class="operator" data-value="×">×</button>

    <button data-value="4">4</button>
    <button data-value="5">5</button>
    <button data-value="6">6</button>
    <button class="operator" data-value="−">−</button>

    <button data-value="1">1</button>
    <button data-value="2">2</button>
    <button data-value="3">3</button>
    <button class="operator" data-value="+">+</button>

    <button data-action="sign">±</button>
    <button data-value="0">0</button>
    <button data-value=".">.</button>
    <button class="equal" data-action="equals">=</button>
  </div>
</div>
`;

const result = document.querySelector("#result")!;
const expression = document.querySelector("#expression")!;
const keys = document.querySelector(".keys")!;

function update(): void {
  result.textContent = current;
  expression.textContent =
    operator ? `${previous} ${operator}` : "";
}

function digit(value: string): void {
  if (reset || current === "خطأ") {
    current = value;
    reset = false;
  } else if (current === "0") {
    current = value;
  } else if (current.length < 15) {
    current += value;
  }
  update();
}

function decimal(): void {
  if (reset || current === "خطأ") {
    current = "0.";
    reset = false;
  } else if (!current.includes(".")) {
    current += ".";
  }
  update();
}

function chooseOperator(value: Operator): void {
  if (operator && !reset) calculate();

  previous = current;
  operator = value;
  reset = true;
  update();
}

function calculate(): void {
  if (!operator || !previous) return;

  const a = Number(previous);
  const b = Number(current);
  let answer: number;

  switch (operator) {
    case "+":
      answer = a + b;
      break;
    case "−":
      answer = a - b;
      break;
    case "×":
      answer = a * b;
      break;
    case "÷":
      if (b === 0) {
        current = "خطأ";
        operator = null;
        previous = "";
        reset = true;
        update();
        return;
      }
      answer = a / b;
      break;
  }

  current = String(Number(answer.toPrecision(11)));
  previous = "";
  operator = null;
  reset = true;
  update();
}

function clear(): void {
  current = "0";
  previous = "";
  operator = null;
  reset = false;
  update();
}

function remove(): void {
  if (reset || current === "خطأ") {
    current = "0";
    reset = false;
  } else {
    current = current.length > 1
      ? current.slice(0, -1)
      : "0";
  }
  update();
}

function percent(): void {
  if (current !== "خطأ") {
    current = String(Number(current) / 100);
  }
  update();
}

function sign(): void {
  if (current !== "0" && current !== "خطأ") {
    current = String(-Number(current));
  }
  update();
}

keys.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const button = target.closest("button");

  if (!button) return;

  const value = button.getAttribute("data-value");
  const action = button.getAttribute("data-action");

  if (value !== null) {
    if (/^\d$/.test(value)) digit(value);
    else if (value === ".") decimal();
    else if (value === "%") percent();
    else chooseOperator(value as Operator);
  }

  if (action === "clear") clear();
  if (action === "delete") remove();
  if (action === "sign") sign();
  if (action === "equals") calculate();
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
  if (/^\d$/.test(event.key)) digit(event.key);
  else if (event.key === ".") decimal();
  else if (event.key === "Enter") calculate();
  else if (event.key === "Backspace") remove();
  else if (event.key === "Escape") clear();
  else if (event.key === "+") chooseOperator("+");
  else if (event.key === "-") chooseOperator("−");
  else if (event.key === "*") chooseOperator("×");
  else if (event.key === "/") chooseOperator("÷");
});

update();
