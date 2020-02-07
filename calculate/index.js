
const numBtn = document.querySelectorAll('.num-btn');
const calBtn = document.querySelectorAll('.cal-btn');
const input = document.querySelector('input');
let stack = [];

numBtn.forEach((el) => {
  el.addEventListener('click', () => {
    console.log(el.textContent);
    

    if (!(!input.value === "0" && el.textContent === '0')) {
      input.value += el.textContent;
    }
  })
})

calBtn.forEach((el) => {
  el.addEventListener('click', () => {
    console.log(el.textContent)
    const cal = el.textContent;
    if (cal === "C") {
      stack = [];
      input.value = '0';
    } else if (cal === "=") {
      runCalculate();
    } else {
      stack.push(cal)
    }

  })
})

function runCalculate() {
  console.log('runCalculate---')
}