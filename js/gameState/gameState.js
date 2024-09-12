import { updateLevel } from '../features/level.js';
export function addCoins(coins) {
  setScore(getScore() + coins);
  updateLevel();
}
const $score = document.querySelector('.game__score');
const $balance = document.querySelector('.boost-menu__balance');
const $balanceMinetab = document.querySelector('.mine-tab__balance');

export function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  $balance.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  $balanceMinetab.textContent = String(score).replace(
    /(.)(?=(\d{3})+$)/g,
    '$1,'
  );
}
export function getScore() {
  return Number(localStorage.getItem('score')) || 0;
}

const $energy = document.querySelector('.energy__value');
const $maxEnergy = document.querySelector('.energy__max');

export function getMaxEnergy() {
  const maxEnergy = localStorage.getItem('maxEnergy');
  return maxEnergy === null ? 1000 : Number(maxEnergy);
}
export function setMaxEnergy(maxEnergy) {
  localStorage.setItem('maxEnergy', maxEnergy);
  $maxEnergy.textContent = maxEnergy;
}

export function getEnergy() {
  const energy = localStorage.getItem('energy');
  return energy === null ? 1000 : Number(energy);
}

export function setEnergy(energy) {
  localStorage.setItem('energy', energy);
  $energy.textContent = energy;
}
