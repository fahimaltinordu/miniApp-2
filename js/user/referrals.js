import {
  checkUnlockConditions,
  getCurrentCategoryTab,
  renderStockCards,
} from '../gameState/stocks.js';

//Friends
export function addFrens(frens) {
  setReferral(getReferral() + frens);
  checkUnlockConditions();
  renderStockCards(getCurrentCategoryTab());
}

export function getReferral() {
  return Number(localStorage.getItem('frens')) || 0;
}
const $friendCount = document.querySelector('#friendCount');

export function setReferral(frens) {
  localStorage.setItem('frens', frens);
  $friendCount.textContent = `You have ${Number(frens)} fake friend`;
}
