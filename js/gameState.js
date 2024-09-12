import { updateLevel } from './level.js';
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
