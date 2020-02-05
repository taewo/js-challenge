
const inputRange = document.querySelector('#myRange'); 
const textInput = document.querySelector('.text');
const btn = document.querySelector('.btn');
const user = document.querySelector('.user-choice');
const machine = document.querySelector('.machine-choice');
const result = document.querySelector('.result');

inputRange.addEventListener('input', (e) => {
  document.querySelector('.max').innerHTML = e.target.value;
})

btn.addEventListener('click', () => {
  if (!textInput.value) return;
  const text = textInput.value;
  machineChoice();
  userChoice();
})

function machineChoice() {
  const ret = Math.floor(Math.random() * parseInt(inputRange.value))
  machine.innerHTML = ret;
  if (ret == textInput.value) {
    result.innerHTML = "You win"
  } else {
    result.innerHTML = "You lose"
  }
}

function userChoice() {
  user.innerHTML = textInput.value;
}