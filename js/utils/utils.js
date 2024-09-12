export function parseNumber(value) {
  return Number(value.replace(/[^0-9.-]+/g, ''));
}

export function showToast(icon, title) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    icon: icon,
    title: title,
  });
}
var prefixes = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

export function AbbreviateNum(number) {
  var num = (Math.log10(number) / 3) | 0;
  if (num == 0) return number;
  var prefix = prefixes[num];
  var scale = Math.pow(10, num * 3);
  var scaled = number / scale;
  return scaled.toFixed(1) + prefix;
}
const container = document.querySelector('body');

function createCoin() {
  const coin = document.createElement('div');
  coin.classList.add('coin-fall');
  coin.style.left = Math.random() * window.innerWidth + 'px';
  coin.style.animationDuration = 2 + 's';
  container.appendChild(coin);

  setTimeout(() => {
    coin.remove();
  }, 2000);
}

let intervalId = null;
export function startFallingCoins() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  intervalId = setInterval(createCoin, 200);

  setTimeout(() => {
    clearInterval(intervalId);
    intervalId = null;
  }, 3000);
}
