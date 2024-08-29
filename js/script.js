window.addEventListener('load', function () {
  // setTimeout(function() {
  //   document.getElementById("loading").style.display = "none"
  // }, 6000);
  document.getElementById('loading').style.display = 'none';
});

// Abbreviate Numbers
var prefixes = ["", "k", "M", "G", "T", "P", "E"];

function AbbreviateNum(number) {
  var num = Math.log10(number) / 3 | 0;
  if (num == 0) return number;
  var prefix = prefixes[num];
  var scale = Math.pow(10, num * 3);
  var scaled = number / scale;
  return scaled.toFixed(1) + prefix;

}
// Abbreviate Numbers ends


const playerIcon = document.getElementById('player-icon');
const playerName = document.getElementById('player-name');

//Initialize Telegram Mini App
if (window.Telegram && window.Telegram.WebApp) {
  const playerInfo = document.querySelector('.player__info');

  // Initialize the Telegram Mini App
  const TELEGRAM = window.Telegram.WebApp;

  // Notify Telegram that the web app is ready
  TELEGRAM.ready();

  TELEGRAM.disableVerticalSwipes();

  // Show the block only if the app is running within Telegram
  playerInfo.style.display = 'flex';

  const user = TELEGRAM.initDataUnsafe.user;
  console.log(user);

  // Settings
  TELEGRAM.setHeaderColor('#252F43');
  TELEGRAM.expand(); // Expand the app to 100% height on the user's phone

  function updateProfile() {
    // Display user information in the element
    let level = getCurrentLevel();
    updateImage(level);
    if (user) {
      playerName.textContent = `${user.first_name}`; // Display the user's first name
    } else {
      // playerIcon.src = "assets/img/nopic.png"; // Fallback image if no photo is available
      playerName.textContent = `No user`;
    }
  }
}
//Initialize Telegram Mini App

const $score = document.querySelector('.game__score');
const $balance = document.querySelector('.boost-menu__balance');
const $circle = document.querySelector('.game__clicker-circle');
const $mainImg = document.querySelector('.game__main-image');
const $energy = document.querySelector('.energy__value');
const $maxEnergy = document.querySelector('.energy__max');
const $toLvlUp = document.querySelector("#to-lvl-up");
const $perTap = document.querySelector('#tap');

function start() {
  setScore(getScore());
  setEnergy(getEnergy());
  setMaxEnergy(getMaxEnergy());
  updateLevel();
  setCoinsPerTap(getCoinsPerTap());
  setCoinsPerHour(getCoinsPerHour());
  restoreRecoveryState();
  initializeDailyRewards();
  renderStockCards();
}

//Coins and Score

function addCoins(coins) {
  setScore(getScore() + coins);
  updateLevel();
}

function getScore() {
  return Number(localStorage.getItem('score')) || 0;
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g,'$1,');
  $balance.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}

// Level
const $currentLvlName = document.querySelector('.level-progress__name');
const $currentLvl = document.querySelector('.level-progress__current-level');

function getCurrentLevel() {
  return Number(localStorage.getItem('level')) || 0;
}

function setCurrentLevel(level) {
  localStorage.setItem('level', level);
  $currentLvl.textContent = level;
}
const progressBar = document.getElementById('level-progress');

function updateProgressBar(currentScore, maxScore) {
  progressBar.max = maxScore;
  progressBar.value = currentScore;
}

function updateLevel() {
  const score = getScore();
  let level = getCurrentLevel();
  let nextLevelScore = 0;

  switch (level) {
    case 0:
      $currentLvlName.textContent = 'Core';
      break;
    case 1:
      $currentLvlName.textContent = 'Windmill';
      break;
    case 2:
      $currentLvlName.textContent = 'Volcanic';
      break;
    case 3:
      $currentLvlName.textContent = 'Stellar';
      break;
    case 4:
      $currentLvlName.textContent = 'Plasma';
      break;
    case 5:
      $currentLvlName.textContent = 'Photon';
      break;
    case 6:
      $currentLvlName.textContent = 'Neutron';
      break;
    case 7:
      $currentLvlName.textContent = 'Solar';
      break;
    case 8:
      $currentLvlName.textContent = 'Nexus';
      break;
    case 9:
      $currentLvlName.textContent = 'Quantum';
      break;
    case 10:
      $currentLvlName.textContent = 'Mystic';
      break;
    default:
      $currentLvlName.textContent = 'Core';
  }

  if (score > 50000000 && level < 10) { // 50M-100M
    level = 10;
    nextLevelScore = 1000000000;
  } else if (score > 25000000 && level < 9) { //25M-50M
    level = 9;
    nextLevelScore = 50000000;
  } else if (score > 10000000 && level < 8) { //10M-25M
    level = 8;
    nextLevelScore = 25000000;
  } else if (score > 5000000 && level < 7) { //5M-10M
    level = 7;
    nextLevelScore = 10000000;
  } else if (score > 1000000 && level < 6) { //1M-5M
    level = 6;
    nextLevelScore = 5000000;
  } else if (score > 500000 && level < 5) { //500k-1M
    level = 5;
    nextLevelScore = 1000000;
  } else if (score > 250000 && level < 4) { //250k-500k
    level = 4;
    nextLevelScore = 500000;
  } else if (score > 100000 && level < 3) { //100k-250k
    level = 3;
    nextLevelScore = 250000; 
  } else if (score > 50000 && level < 2) { //50k-100k
    level = 2;
    nextLevelScore = 100000;
  } else if (score > 10000 && level < 1) { //10k-50k
    level = 1;
    nextLevelScore = 50000;
  } else if (level === 0) {                 //0-10k
    nextLevelScore = 10000;
  } 
  
  // else {
  //   nextLevelScore = level === 1 ? 5000 : 10000;
  // }

  setCurrentLevel(level);
  updateProgressBar(score, nextLevelScore);
  $toLvlUp.textContent = AbbreviateNum(nextLevelScore);
  updateImage(level);
  updateProfile();
}

function updateImage(level) {
  const octopusImages = {
    0: 'assets/img/levels/lvl0.png',
    1: 'assets/img/levels/lvl1.png',
    2: 'assets/img/levels/lvl2.png',
    3: 'assets/img/levels/lvl3.png',
    4: 'assets/img/levels/lvl4.png',
    5: 'assets/img/levels/lvl5.png',
    6: 'assets/img/levels/lvl6.png',
    7: 'assets/img/levels/lvl7.png',
    8: 'assets/img/levels/lvl8.png',
    9: 'assets/img/levels/lvl9.png',
    10: 'assets/img/levels/lvl10.png',
  };
  // playerIcon.src = octopusImages[level]
  playerIcon.setAttribute('src', octopusImages[level]);
}

// Energy regenerator
setInterval(() => {
  if (getEnergy() < getMaxEnergy()) {
    setEnergy(getEnergy() + 1);
  }
}, 2000);

$circle.addEventListener('click', (event) => {
  if (getEnergy() >= getCoinsPerTap()) {
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    const rect = $circle.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const DEG = 40;

    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG;

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
      $circle.style.setProperty('--tiltX', `0deg`);
      $circle.style.setProperty('--tiltY', `0deg`);
    }, 300);

    const coinsPerTap = getCoinsPerTap();
    const plusCoins = document.createElement('div');
    plusCoins.classList.add('plusCoins');
    plusCoins.textContent = '+' + coinsPerTap;
    plusCoins.style.left = `${event.clientX}px`;
    plusCoins.style.top = `${event.clientY - 60}px`;

    $circle.parentElement.appendChild(plusCoins);

    addCoins(coinsPerTap);
    setEnergy(getEnergy() - getCoinsPerTap());
    updateLevel();
    setMaxEnergy(getMaxEnergy());

    setTimeout(() => {
      plusCoins.remove();
    }, 2000);
  }
});

// Upgrades

const $boostMenu = document.querySelector('.boost-menu');

function toggleBoostMenu() {
  $boostMenu.classList.toggle('active');
}

const $upgradeMenu = document.querySelector('#upgrade-menu');
const $upgradeImg = document.querySelector('#upgrade-img');
const $upgradeTitle = document.querySelector('#upgrade-title');
const $upgradeDescription = document.querySelector('#upgrade-description');
const $upgradeBtn = document.querySelector('#upgrade-button');
const $upgradeCost = document.querySelector('#upgrade-cost');

const $upgrades = document.querySelectorAll(
  '.boost-menu__bosters__upgrade .boost-menu__boost'
);

const $energieUpgrade = document.querySelector('#energie-upgrade');
const $tapUpgrade = document.querySelector('#tap-upgrade');

function showUpgradeMenu(upgrade) {
  const imgSrc = upgrade.querySelector('img').src;
  const title = upgrade.querySelector('h3').textContent;
  const cost = upgrade.querySelector('span').textContent;

  $upgradeImg.src = imgSrc;
  $upgradeTitle.textContent = title;
  $upgradeDescription.textContent = `Increase your ${title.toLowerCase()}.`;
  $upgradeCost.textContent = cost;

  $upgradeBtn.addEventListener('click', handleUpgradeClick);

  function handleUpgradeClick() {
    buyUpgrade(upgrade);
    $upgradeBtn.removeEventListener('click', handleUpgradeClick);
  }

  $upgradeMenu.classList.add('active');
}

function hideUpgradeMenu() {
  $cardsUpgradeMenu.classList.remove('active');
  $upgradeMenu.classList.remove('active');
}

function getCoinsPerTap() {
  return parseInt(localStorage.getItem('coinsPerTap')) || 1;
}

function setCoinsPerTap(coins) {
  localStorage.setItem('coinsPerTap', coins);
  $perTap.textContent = coins;
}

function buyUpgrade(upgrade) {
  const currentBalance = getScore();
  const cost = Number($upgradeCost.textContent);
  const upgradeName = $upgradeTitle.textContent.toLowerCase();

  if (currentBalance >= cost) {
    setScore(currentBalance - cost);
    if (upgradeName === 'multitap') {
      upgradeMultitap();
    } else if (upgradeName === 'max energy') {
      upgradeMaxEnergy();
    }
    updateLevel();
    hideUpgradeMenu();
    startFallingCoins();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Upgrade purchased!',
    });
    // alert("Upgrade purchased!");
  } else {
    hideUpgradeMenu();
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title: 'Not enough coins!',
    });
  }
}

window.addEventListener('click', function (event) {
  if (event.target === $upgradeMenu || event.target === $cardsUpgradeMenu) {
    hideUpgradeMenu();
  }
});

// Energie

function getMaxEnergy() {
  const maxEnergy = localStorage.getItem('maxEnergy');
  return maxEnergy === null ? 1000 : Number(maxEnergy);
}
function setMaxEnergy(maxEnergy) {
  localStorage.setItem('maxEnergy', maxEnergy);
  $maxEnergy.textContent = maxEnergy;
}

function getEnergy() {
  const energy = localStorage.getItem('energy');
  return energy === null ? 1000 : Number(energy);
}

function setEnergy(energy) {
  localStorage.setItem('energy', energy);
  $energy.textContent = energy;
}
function upgradeMaxEnergy() {
  setMaxEnergy(getMaxEnergy() + 500);
  maxEnergyCost += 1000;
  localStorage.setItem('maxEnergyCost', maxEnergyCost);
  document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
}

function upgradeMultitap() {
  if (multitapPurchases < 8) {
    setCoinsPerTap(getCoinsPerTap() + 1);
    multitapPurchases++;
    multitapCost += 1000;
    localStorage.setItem('multitapPurchases', multitapPurchases);
    localStorage.setItem('multitapCost', multitapCost);
    document.querySelector('#multitap-cost').textContent = multitapCost;
  } else {
    alert('Multitap upgrade is maxed out!');
  }
}

const $energyBoost = document.querySelector('.boost-menu__boost__energy');
const $energyLimit = document.querySelector('#energy-limit');
const $energyTimer = document.querySelector('#energy-timer');
let energyBoostLimit = 1;
let recoveryTime = 60 * 60 * 1000; // 60 min in milliseconds
let recoveryInterval;
let remainingTime = recoveryTime;

function startRecoveryTimer(startTime) {
  recoveryInterval = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    remainingTime = recoveryTime - elapsedTime;

    if (remainingTime <= 0) {
      energyBoostLimit = 1;
      $energyLimit.textContent = energyBoostLimit;
      $energyBoost.classList.remove('disabled');
      $energyTimer.textContent = '';
      clearInterval(recoveryInterval);
      localStorage.removeItem('recoveryEndTime');
    } else {
      let minutes = Math.floor((remainingTime / 1000 / 60) % 60);
      let seconds = Math.floor((remainingTime / 1000) % 60);
      $energyTimer.innerHTML = `${minutes} min<br> ${seconds} sec`;
      localStorage.setItem('remainingTime', remainingTime);
      localStorage.setItem('recoveryEndTime', startTime + recoveryTime);
    }
  }, 1000);
}

function restoreRecoveryState() {
  let recoveryEndTime = localStorage.getItem('recoveryEndTime');
  if (recoveryEndTime) {
    let timeLeft = recoveryEndTime - Date.now();
    if (timeLeft > 0) {
      energyBoostLimit = 0;
      $energyLimit.textContent = energyBoostLimit;
      $energyBoost.classList.add('disabled');
      recoveryTime = timeLeft;
      startRecoveryTimer(Date.now() - (recoveryTime - timeLeft));
    } else {
      localStorage.removeItem('recoveryEndTime');
      localStorage.removeItem('remainingTime');
    }
  }
}

$energyBoost.addEventListener('click', () => {
  if (energyBoostLimit > 0) {
    setEnergy(getMaxEnergy());
    energyBoostLimit--;
    $energyLimit.textContent = energyBoostLimit;
    $energyBoost.classList.add('disabled');
    let startTime = Date.now();
    startRecoveryTimer(startTime);
  }
});

// Menu bar / swiching tabs

const $barItems = document.querySelectorAll('.menu-bar__item');
const $tabContents = document.querySelectorAll('.tab-content');
const $gameContent = document.querySelectorAll(
  '.game__header, .game__clicker-circle, .game__footer, .info, .level-progress'
);

$barItems.forEach((barItem) => {
  barItem.addEventListener('click', (e) => {
    e.preventDefault();

    $barItems.forEach((item) => {
      item.classList.remove('menu-bar__item__active');
    });

    barItem.classList.add('menu-bar__item__active');

    const targetId = barItem.getAttribute('href').substring(1);

    $tabContents.forEach((tabContent) => {
      tabContent.classList.remove('tab-content__active');
    });

    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('tab-content__active');
    }

    if (targetId === 'home') {
      $gameContent.forEach((element) => element.classList.remove('hidden'));
    } else {
      $gameContent.forEach((element) => element.classList.add('hidden'));
    }
  });
});

const $coinsPerHour = document.querySelector('#perHour');

function setCoinsPerHour(coins) {
  localStorage.setItem('coinsPerHour', coins);
  $coinsPerHour.textContent = AbbreviateNum(coins);
}

function getCoinsPerHour() {
  return localStorage.getItem('coinsPerHour') ?? 0;
}

let accumulatedCoins = 0;
let coinsIntervalId = null;

function startCoinAccumulation() {
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

function updateCoinsPerHour(coins) {
  setCoinsPerHour(Number(getCoinsPerHour()) + coins);
  startCoinAccumulation();
}

if (getCoinsPerHour() > 0) {
  startCoinAccumulation();
}

let stocks = [
  {
    hisse: 'APPL',
    img: 'assets/img/icons/mine/apple.png',
    descr: 'Invest in Apple stocks to increase your wealth.',
    price: 100,
    pph: 7.5,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'BTC',
    img: 'assets/img/icons/mine/bitcoin.png',
    descr: 'Invest in Bitcoin for digital currency gains.',
    price: 150,
    pph: 8,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.3,
  },
  {
    hisse: 'ETH',
    img: 'assets/img/icons/mine/ethereum.png',
    descr: 'Invest in Ethereum for digital currency gains.',
    price: 170,
    pph: 10,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'XRP',
    img: 'assets/img/icons/mine/ripple.png',
    descr: 'Invest in Ripple for digital currency gains.',
    price: 200,
    pph: 15,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'KCHOL',
    img: 'assets/img/icons/mine/kchol.png',
    descr: 'Invest in Koç Holding for diversified industrial exposure.',
    price: 250,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'THYAO',
    img: 'assets/img/icons/mine/turkish-airlines.png',
    descr: 'Invest in Turkish Airlines for aviation sector growth.',
    price: 350,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'TCELL',
    img: 'assets/img/icons/mine/tcell.png',
    descr: 'Invest in Turkcell for telecommunications expansion.',
    price: 300,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
  },
  {
    hisse: 'TSLA',
    img: 'assets/img/icons/mine/tesla.png',
    descr: 'Invest in Tesla for innovation in electric vehicles.',
    price: 400,
    pph: 25,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.4,
  },
];

function loadStocks() {
  const savedStocks = localStorage.getItem('stocks');
  if (savedStocks) {
    stocks = JSON.parse(savedStocks);
  }
}

function saveStocks() {
  localStorage.setItem('stocks', JSON.stringify(stocks));
}

loadStocks();

function renderStockCards() {
  let str = '';
  stocks.forEach((item, index) => {
    str += `<div class="mine-tab__card" data-index="${index}">
                    <div class="mine-tab__card-image">
                        <h3 class="mine-tab__card-title">${item.hisse}</h3>
                        <img src="${item.img}">
                    </div>
                    <div class="mine-tab__card-content">
                        <p class="mine-tab__card-description">${item.descr}</p>
                        <div class="mine-tab__card-details">
                            <span class="mine-tab__card-price">Fee: ${item.price}</span>
                            <span class="card-income">Profit: ${item.pph}</span>
                            <p style="color: #bbb;"><span>lvl </span><span class="PerHour-level">${item.purchased}</span> </p>
                        </div>
                    </div>
                </div>`;
  });

  const $cardContainer = document.querySelector('.mine-tab__grid');
  $cardContainer.innerHTML = str;

  // Add event listener to each card to open the upgrade menu
  document.querySelectorAll('.mine-tab__card').forEach((card) => {
    card.addEventListener('click', (e) => {
      showCardsUpgradeMenu(card);
    });
  });
}

// Initial render of stock cards
renderStockCards();

// Define upgrade menu elements
const $cardsUpgradeMenu = document.querySelector('#cards-upgrade-menu');
const $cardsUpgradeImg = document.querySelector('#cards-upgrade-img');
const $cardsUpgradeTitle = document.querySelector('#cards-upgrade-title');
const $cardsUpgradeDescription = document.querySelector(
  '#cards-upgrade-description'
);
const $cardsUpgradeBtn = document.querySelector('#cards-upgrade-button');
const $cardsUpgradeCost = document.querySelector('#cards-upgrade-cost');
const $cardsUpgradeIncome = document.querySelector('#cards-upgrade-income');

function showCardsUpgradeMenu(card) {
  const index = card.dataset.index;
  const stock = stocks[index];

  $cardsUpgradeImg.src = card.querySelector('img').src;
  $cardsUpgradeTitle.textContent = stock.hisse;
  $cardsUpgradeDescription.textContent = stock.descr;
  $cardsUpgradeCost.textContent = `Fee: ${stock.price}`;
  $cardsUpgradeIncome.textContent = `PPH: ${stock.pph}`;

  $cardsUpgradeBtn.onclick = function () {
    buyStock(index, card);
  };

  $cardsUpgradeMenu.classList.add('active');
}

function buyStock(index, cardElement) {
  const stock = stocks[index];
  const currentBalance = getScore();
  const cost = stock.price;

  if (currentBalance >= cost) {
    setScore(currentBalance - cost);

    const currentCoinsPerHour = Number(getCoinsPerHour());
    const additionalCoinsPerHour = Number(stock.pph);

    setCoinsPerHour(currentCoinsPerHour + additionalCoinsPerHour);

    stock.purchased += 1;

    // Increase the stock price and income
    stock.price = Math.ceil(stock.price * stock.priceIncrease);
    stock.pph = Math.ceil(stock.pph * stock.pphIncrease);

    saveStocks();
    updateLevel();
    updateStockCardUI(cardElement, stock);

    startFallingCoins();

    Swal.fire({
      icon: 'success',
      title: 'Upgrade purchased!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    $cardsUpgradeMenu.classList.remove('active');
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Not enough coins!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
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

function parseNumber(value) {
  return Number(value.replace(/[^0-9.-]+/g, ''));
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

function startFallingCoins() {
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

const $dailyRewardBtn = document.querySelector('#dailyRewardBtn');
const $dailyRewardPopup = document.querySelector('#dailyRewardPopup');
const $popupCloseBtn = document.querySelector('#popupCloseBtn');
const $claimDailyRewardBtn = document.querySelector('#popupClaimBtn');
const $dailyRewardDays = document.querySelectorAll('.popup__day');

const today = new Date().toISOString().slice(0, 10);

function initializeDailyRewards() {
  const lastRewardDate = localStorage.getItem('lastRewardDate');
  let previousDay = parseInt(localStorage.getItem('previousDay')) || 1;

  // Remove the current and completed status from all reward days
  $dailyRewardDays.forEach((day) =>
    day.classList.remove('popup__day__current', 'popup__day__completed')
  );

  if (!lastRewardDate || lastRewardDate !== today) {
    if (lastRewardDate) {
      // Calculate the number of days since the last reward
      const daysSinceLastReward = Math.floor(
        (new Date(today) - new Date(lastRewardDate)) / (1000 * 60 * 60 * 24)
      );
      previousDay = Math.min(
        previousDay + daysSinceLastReward,
        $dailyRewardDays.length
      );
    } else {
      // If this is the user's first visit
      previousDay = 1;
    }

    // Update the previous day in localStorage
    setPreviousDay(previousDay);
  }

  // Ensure previousDay does not exceed the number of available days
  if (previousDay > $dailyRewardDays.length) {
    previousDay = 1;
    setPreviousDay(previousDay);
  }

  // Update the display of reward days in the popup
  const currentRewardDayNum = getPreviousDay();
  const $currentRewardDay = $dailyRewardDays[currentRewardDayNum - 1];
  if ($currentRewardDay) {
    $currentRewardDay.classList.add('popup__day__current');

    for (let i = 0; i < currentRewardDayNum - 1; i++) {
      $dailyRewardDays[i].classList.add('popup__day__completed');
    }
  }

  updateClaimButtonStatus();
}

function updateClaimButtonStatus() {
  const lastRewardDate = localStorage.getItem('lastRewardDate');

  // Disable the claim button if today's reward has already been claimed
  if (lastRewardDate === today) {
    $claimDailyRewardBtn.setAttribute('disabled', 'true');
  } else {
    $claimDailyRewardBtn.removeAttribute('disabled');
  }
}

function setLastRewardDate(date) {
  localStorage.setItem('lastRewardDate', date);
}

function getPreviousDay() {
  return parseInt(localStorage.getItem('previousDay')) || 1;
}

function setPreviousDay(day) {
  localStorage.setItem('previousDay', day);
}

$claimDailyRewardBtn.addEventListener('click', () => {
  const currentDay = getPreviousDay();
  const reward = parseInt(
    $dailyRewardDays[currentDay - 1].querySelector('.popup__day-coins')
      .textContent
  );

  addCoins(reward);
  startFallingCoins();

  setLastRewardDate(today); // Update the last reward date immediately
  $dailyRewardDays[currentDay - 1].classList.add('popup__day__completed');

  const nextDay = currentDay + 1;
  if (nextDay > $dailyRewardDays.length) {
    setPreviousDay(1);
  } else {
    setPreviousDay(nextDay);
  }

  initializeDailyRewards();
});

$dailyRewardBtn.addEventListener('click', () => {
  initializeDailyRewards();
  $dailyRewardPopup.style.display = 'flex'; // Show the popup after initializing
});

$popupCloseBtn.addEventListener('click', () => {
  $dailyRewardPopup.style.display = 'none';
});

start();
