import { showToast, AbbreviateNum } from './utils.js';
import { stocks } from './stocks.js';
import { getScore } from './gameState.js';
import { updateLevel } from './level.js';
const $boostMenu = document.querySelector('.boost-menu');

export function toggleBoostMenu() {
  $boostMenu.classList.toggle('active');
}

const $upgradeMenu = document.querySelector('#upgrade-menu');
const $upgradeImg = document.querySelector('#upgrade-img');
const $upgradeTitle = document.querySelector('#upgrade-title');
const $upgradeDescription = document.querySelector('#upgrade-description');
const $upgradeBtn = document.querySelector('#upgrade-button');
const $upgradeCost = document.querySelector('#upgrade-cost');

// const $upgrades = document.querySelectorAll(
//   '.boost-menu__bosters__upgrade .boost-menu__boost'
// );

const $energyUpgrade = document.querySelector('#energy-upgrade');
const $tapUpgrade = document.querySelector('#tap-upgrade');

// for (let upgrade of $upgrades) {
//   upgrade.addEventListener('click', (e) => {
//     showUpgradeMenu(e.currentTarget);
//   });
// }

$tapUpgrade.addEventListener('click', showUpgradeMenu);
$energyUpgrade.addEventListener('click', showEnergyUpgradeMenu);

function showUpgradeMenu() {
  const imgSrc = $tapUpgrade.querySelector('img').src;
  const title = $tapUpgrade.querySelector('h3').textContent;
  const cost = $tapUpgrade.querySelector('span').textContent;

  $upgradeImg.src = imgSrc;
  $upgradeTitle.textContent = title;
  $upgradeDescription.textContent = `Increase your ${title.toLowerCase()} +1.`;
  $upgradeCost.textContent = cost;

  $upgradeBtn.addEventListener('click', handleUpgradeClick);

  $upgradeMenu.classList.add('active');
}
function canUpgradeMultitap() {
  return multitapPurchases < 8;
}

function buyStock(index, cardElement) {
  const stock = stocks[index];
  const currentBalance = getScore();

  if (stock.purchased >= stock.maxLevel) {
    showToast('info', 'Max level reached for this stock!');
    return;
  }

  const cost = stock.price;

  if (currentBalance >= cost) {
    setScore(currentBalance - cost);

    const currentCoinsPerHour = Number(getCoinsPerHour());
    const additionalCoinsPerHour = Number(stock.pph);

    updateCoinsPerHour(additionalCoinsPerHour);

    stock.purchased += 1;

    // Increase the stock price and income
    stock.price = Math.ceil(stock.price * stock.priceIncrease);
    stock.pph = Math.ceil(stock.pph * stock.pphIncrease);

    saveStocks();
    updateLevel();
    updateStockCardUI(cardElement, stock);

    hideUpgradeMenu();
    showToast('success', 'Upgrade purchased!');
    $cardsUpgradeMenu.classList.remove('active');
    checkUnlockConditions();
    renderStockCards(stock.category);
  } else {
    hideUpgradeMenu();
    showToast('error', 'Not enough coins!');
  }
}

function updateStockCardUI(cardElement, stock) {
  cardElement.querySelector(
    '.mine-tab__card-price'
  ).textContent = `Fee: ${stock.price}`;
  cardElement.querySelector(
    '.card-income'
  ).textContent = `Profit: ${stock.pph}`;
  cardElement.querySelector('.PerHour-level').textContent = stock.purchased;
}

function buyUpgrade(upgrade) {
  const currentBalance = getScore();
  const cost = Number($upgradeCost.textContent);
  const upgradeName = $upgradeTitle.textContent.toLowerCase();

  if (upgradeName === 'multitap') {
    if (canUpgradeMultitap() && cost <= currentBalance) {
      upgradeMultitap();
      setScore(currentBalance - cost);

      showToast('success', 'Upgrade purchased!');
    } else if (cost > currentBalance) {
      showToast('error', 'Not enough coins!');
    } else if (!canUpgradeMultitap()) {
      showToast('error', 'Multitap upgrade is maxed out!');
    }
  } else if (upgradeName === 'max energy') {
    if (cost <= currentBalance) {
      upgradeMaxEnergy();
      setScore(currentBalance - cost);
      showToast('success', 'Upgrade purchased!');
    } else {
      showToast('error', 'Not enough coins!');
    }
  }

  updateLevel();
  hideUpgradeMenu();
}

function upgradeMaxEnergy() {
  setMaxEnergy(getMaxEnergy() + 500);
  maxEnergyCost += 1000;
  localStorage.setItem('maxEnergyCost', maxEnergyCost);
  document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
}
let maxEnergyCost = Number(localStorage.getItem('maxEnergyCost')) || 1000;
let multitapPurchases = Number(localStorage.getItem('multitapPurchases')) || 0;
let multitapCost = Number(localStorage.getItem('multitapCost')) || 1000;

document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
document.querySelector('#multitap-cost').textContent = multitapCost;

function upgradeMultitap() {
  if (canUpgradeMultitap()) {
    setCoinsPerTap(getCoinsPerTap() + 1);
    multitapPurchases++;
    multitapCost += 1000;
    localStorage.setItem('multitapPurchases', multitapPurchases);
    localStorage.setItem('multitapCost', multitapCost);
    document.querySelector('#multitap-cost').textContent = multitapCost;
  } else {
    showToast('error', 'Multitap upgrade is maxed out!');
  }
}

function showEnergyUpgradeMenu() {
  const imgSrc = $energyUpgrade.querySelector('img').src;
  const title = $energyUpgrade.querySelector('h3').textContent;
  const cost = $energyUpgrade.querySelector('span').textContent;

  $upgradeImg.src = imgSrc;
  $upgradeTitle.textContent = title;
  $upgradeDescription.textContent = `Increase your ${title.toLowerCase()} +500.`;
  $upgradeCost.textContent = cost;

  $upgradeBtn.addEventListener('click', handleUpgradeClick);

  $upgradeMenu.classList.add('active');
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

const $cardsUpgradeMenu = document.querySelector('#cards-upgrade-menu');
const $cardsUpgradeImg = document.querySelector('#cards-upgrade-img');
const $cardsUpgradeTitle = document.querySelector('#cards-upgrade-title');
const $cardsUpgradeDescription = document.querySelector(
  '#cards-upgrade-description'
);
const $cardsUpgradeBtn = document.querySelector('#cards-upgrade-button');
const $cardsUpgradeCost = document.querySelector('#cards-upgrade-cost');
const $cardsUpgradeIncome = document.querySelector('#cards-upgrade-income');

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

const $perTap = document.querySelector('#tap');

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

const $coinsPerHour = document.querySelector('#perHour');
const $coinsPerHourPopover = document.querySelector('#perHourPopover');
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
if (getCoinsPerHour() > 0) {
  startCoinAccumulation();
}
