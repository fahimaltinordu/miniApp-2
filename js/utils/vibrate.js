export function getVibrate() {
  return Number(localStorage.getItem('Vibrate')) || 0;
}
export function setVibrate(Vibrate) {
  localStorage.setItem('Vibrate', Vibrate);
}
let xVibrate = getVibrate();
export let active = false;

export function vibrate() {
  active = !active;
  if (active) {
    xVibrate = 200;
    setVibrate(xVibrate);
    document.getElementById('vibrateButton').textContent = 'ON';
    if (navigator.vibrate) {
      navigator.vibrate(xVibrate);
    }
  } else {
    xVibrate = 0;
    setVibrate(xVibrate);
    document.getElementById('vibrateButton').textContent = 'OFF';
    if (navigator.vibrate) {
      navigator.vibrate(xVibrate);
    }
  }
}
