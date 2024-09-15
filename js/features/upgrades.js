import { showToast, AbbreviateNum } from '../utils/utils.js';
import { stocks, buyStock } from '../gameState/stocks.js';
import {
  setScore,
  getScore,
  addCoins,
  setMaxEnergy,
  getMaxEnergy,
} from '../gameState/gameState.js';
import { updateLevel } from './level.js';

const MAX_ENERGY_LEVEL = 10;
const MAX_MULTITAP_LEVEL = 8;

const $boostMenu = document.querySelector('.boost-menu');
const $upgradeMenu = document.querySelector('#upgrade-menu');
const $upgradeImg = document.querySelector('#upgrade-img');
const $upgradeTitle = document.querySelector('#upgrade-title');
const $upgradeDescription = document.querySelector('#upgrade-description');
const $upgradeBtn = document.querySelector('#upgrade-button');
const $upgradeCost = document.querySelector('#upgrade-cost');
const $energyUpgrade = document.querySelector('#energy-upgrade');
const $multitapLevel = document.querySelector('#multitapPurchases');
const $maxEnergyLevel = document.querySelector('#maxEnergyPurchases');
const $tapUpgrade = document.querySelector('#tap-upgrade');
const $cardsUpgradeMenu = document.querySelector('#cards-upgrade-menu');
const $cardsUpgradeImg = document.querySelector('#cards-upgrade-img');
const $cardsUpgradeTitle = document.querySelector('#cards-upgrade-title');
const $cardsUpgradeDescription = document.querySelector(
  '#cards-upgrade-description'
);
const $cardsUpgradeBtn = document.querySelector('#cards-upgrade-button');
const $cardsUpgradeCost = document.querySelector('#cards-upgrade-cost');
const $cardsUpgradeIncome = document.querySelector('#cards-upgrade-income');
const $perTap = document.querySelector('#tap');
const $coinsPerHour = document.querySelector('#perHour');
const $coinsPerHourPopover = document.querySelector('#perHourPopover');

let multitapPurchases = Number(localStorage.getItem('multitapPurchases')) || 0;
let maxEnergyPurchases =
  Number(localStorage.getItem('maxEnergyPurchases')) || 0;
let multitapCost = Number(localStorage.getItem('multitapCost')) || 1000;
let maxEnergyCost = Number(localStorage.getItem('maxEnergyCost')) || 1000;

document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
document.querySelector('#multitap-cost').textContent = multitapCost;
$multitapLevel.textContent = `lvl ${multitapPurchases}`;
$maxEnergyLevel.textContent = `lvl ${maxEnergyPurchases}`;

function updateUpgradesState() {
  if (!canUpgradeMaxEnergy()) {
    markAsMaxLevel($energyUpgrade);
  }
  if (!canUpgradeMultitap()) {
    markAsMaxLevel($tapUpgrade);
  }
}

updateUpgradesState();

$tapUpgrade.addEventListener('click', () =>
  showUpgradeMenu($tapUpgrade, 'multitap')
);
$energyUpgrade.addEventListener('click', () =>
  showUpgradeMenu($energyUpgrade, 'energy')
);

function showUpgradeMenu(upgradeElement, type) {
  let imgSrc, title, cost, description;

  title = upgradeElement.querySelector('h3').textContent;

  if (type === 'energy') {
    if (!canUpgradeMaxEnergy()) {
      return;
    }
    description = `Increase your ${title.toLowerCase()} +500.`;
  } else if (type === 'multitap') {
    if (!canUpgradeMultitap()) {
      return;
    }
    description = `Increase your ${title.toLowerCase()} +1.`;
  }

  imgSrc = upgradeElement.querySelector('img').src;
  cost = upgradeElement.querySelector('span').textContent;

  $upgradeImg.src = imgSrc;
  $upgradeTitle.textContent = title;
  $upgradeDescription.textContent = description;
  $upgradeCost.textContent = cost;

  $upgradeBtn.addEventListener('click', handleUpgradeClick);
  $upgradeMenu.classList.add('active');
}

export function markAsMaxLevel(upgradeElement) {
  upgradeElement.disabled = true;
  upgradeElement.querySelector('span').textContent = 'Max Level';
  upgradeElement.classList.add('disabled');
}

function canUpgradeMultitap() {
  return multitapPurchases < MAX_MULTITAP_LEVEL;
}

function canUpgradeMaxEnergy() {
  return maxEnergyPurchases < MAX_ENERGY_LEVEL;
}

export function toggleBoostMenu() {
  $boostMenu.classList.toggle('active');
}

function upgradeMaxEnergy() {
  if (canUpgradeMaxEnergy()) {
    setMaxEnergy(getMaxEnergy() + 500);
    maxEnergyCost += 1000;
    maxEnergyPurchases++;
    localStorage.setItem('maxEnergyPurchases', maxEnergyPurchases);
    localStorage.setItem('maxEnergyCost', maxEnergyCost);
    document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
    $maxEnergyLevel.textContent = `lvl ${maxEnergyPurchases}`;
  } else {
    showToast('error', 'Max energy upgrade is maxed out!');
  }
}

function upgradeMultitap() {
  if (canUpgradeMultitap()) {
    setCoinsPerTap(getCoinsPerTap() + 1);
    multitapPurchases++;
    multitapCost += 1000;
    localStorage.setItem('multitapPurchases', multitapPurchases);
    localStorage.setItem('multitapCost', multitapCost);
    document.querySelector('#multitap-cost').textContent = multitapCost;
    $multitapLevel.textContent = `lvl ${multitapPurchases}`;
  } else {
    showToast('error', 'Multitap upgrade is maxed out!');
  }
}

function buyUpgrade() {
  const currentBalance = getScore();
  const cost = Number($upgradeCost.textContent);
  const upgradeName = $upgradeTitle.textContent.toLowerCase();

  if (upgradeName === 'multitap') {
    if (cost > currentBalance) {
      showToast('error', 'Not enough coins!');
      return;
    }

    if (canUpgradeMultitap()) {
      upgradeMultitap();
      setScore(currentBalance - cost);
      showToast('success', 'Upgrade purchased!');
    } else {
      showToast('error', 'Multitap upgrade is maxed out!');
    }
  } else if (upgradeName === 'max energy') {
    if (cost > currentBalance) {
      showToast('error', 'Not enough coins!');
      return;
    }

    if (canUpgradeMaxEnergy()) {
      upgradeMaxEnergy();
      setScore(currentBalance - cost);
      showToast('success', 'Upgrade purchased!');
    } else {
      showToast('error', 'Max energy upgrade is maxed out!');
    }
  }
  updateUpgradesState();
  updateLevel();
  hideUpgradeMenu();
}

function handleUpgradeClick() {
  buyUpgrade();
  $upgradeBtn.removeEventListener('click', handleUpgradeClick);
}

export function hideUpgradeMenu() {
  $cardsUpgradeMenu.classList.remove('active');
  $upgradeMenu.classList.remove('active');
}

window.addEventListener('click', function (event) {
  if (event.target === $upgradeMenu || event.target === $cardsUpgradeMenu) {
    hideUpgradeMenu();
  }
});

export function showCardsUpgradeMenu(card) {
  const index = card.dataset.index;
  const stock = stocks[index];
  const { hisse, descr, price, pph, purchased, maxLevel } = stock;

  if (purchased >= maxLevel) {
    $cardsUpgradeBtn.disabled = true;
    $cardsUpgradeBtn.textContent = 'Max Level Reached';
  } else {
    $cardsUpgradeBtn.disabled = false;
    $cardsUpgradeBtn.textContent = 'Buy Upgrade';
  }

  $cardsUpgradeImg.src = card.querySelector('img').src;
  $cardsUpgradeTitle.textContent = hisse;
  $cardsUpgradeDescription.textContent = descr;
  $cardsUpgradeCost.textContent = `Fee: ${price}`;
  $cardsUpgradeIncome.textContent = `PPH: ${pph}`;

  $cardsUpgradeBtn.onclick = function () {
    buyStock(index, card);
  };

  $cardsUpgradeMenu.classList.add('active');
}

export function getCoinsPerTap() {
  return parseInt(localStorage.getItem('coinsPerTap')) || 1;
}

export function setCoinsPerTap(coins) {
  localStorage.setItem('coinsPerTap', coins);
  $perTap.textContent = coins;
}

export function getCoinsPerHour() {
  return localStorage.getItem('coinsPerHour') ?? 0;
}

export function setCoinsPerHour(coins) {
  localStorage.setItem('coinsPerHour', coins);
  $coinsPerHour.textContent = AbbreviateNum(coins);
  $coinsPerHourPopover.innerHTML = coins;
}

export function updateCoinsPerHour(coins) {
  const newCoinsPerHour = Number(getCoinsPerHour()) + coins;
  setCoinsPerHour(newCoinsPerHour);
  startCoinAccumulation();
}

let accumulatedCoins = 0;
let coinsIntervalId = null;

export function startCoinAccumulation() {
  if (coinsIntervalId) {
    clearInterval(coinsIntervalId);
  }

  coinsIntervalId = setInterval(() => {
    accumulatedCoins += getCoinsPerHour() / 3600;

    if (accumulatedCoins >= 1) {
      addCoins(Math.floor(accumulatedCoins));
      accumulatedCoins -= Math.floor(accumulatedCoins);
    }
  }, 1000);
}
