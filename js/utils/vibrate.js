export function getVibrate() {
  return Number(localStorage.getItem('Vibrate')) || 0;
}
export function setVibrate(Vibrate) {
  localStorage.setItem('Vibrate', Vibrate);
}
export let xVibrate = getVibrate();
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
export function checkVibrate(){
  console.log(getVibrate());
  if (getVibrate() === 0) {
    vibrateButton.textContent = 'OFF';
    active = false;
  } else if (getVibrate() === 200) {
    vibrateButton.textContent = 'ON';
    active = true;
  }
}

