localStorage.clear(); // DELETE THIS /////////////////////////////

//CONFIG
//story
let storyLink =
  'https://mini-app-2.vercel.app/assets/img/5976773169836572554.jpg';
let storyText = 'join #EnergyFi, invest stocks, tap & earn $ENR';
let storyWidgetLink = ' https://t.me/EnergyFi_testApp_bot/EnergyFi';
let storyWidgetName = '@energyFi_tap';
//socialMedia
let TelegramLink = 'https://t.me/EnergyFi_org';
let TwitterLink = 'https://twitter.com/EnergyFi_org';
let GithubLink = 'https://github.com/fahimaltinordu/miniApp-2';
//cloudflare
const c_url = "https://sweet-lake-5572.fahimaltinordu-yedek.workers.dev";
//createInvoice
const apiKey = "7513220093:AAFogDDXxV-lWOMUva4Kzhw0LE8gI7tA93A"
window.addEventListener('load', function () {
  setTimeout(loadingDelay, 2000);
});
function loadingDelay() {
  document.getElementById('loading').style.display = 'none';
}

let telegram_username = '';
let telegram_userId = '';
let telegram_userPhoto = '';
const playerIcon = document.getElementById('player-icon');
const playerName = document.getElementById('player-name');
const userPhoto = document.getElementById('userPhoto');

//Initialize Telegram Mini App
if (window.Telegram && window.Telegram.WebApp) {
  const playerInfo = document.querySelector('.player__info');

  // Initialize the Telegram Mini App
  const TELEGRAM = window.Telegram.WebApp;

  // Notify Telegram that the web app is ready
  TELEGRAM.ready();

  TELEGRAM.disableVerticalSwipes(); // disable vertical swipes
  TELEGRAM.enableClosingConfirmation(); // enables confirmation dialog while closing app

  // Show the block only if the app is running within Telegram
  playerInfo.style.display = 'flex';
  // const { first_name, last_name, username } = window.Telegram.WebApp.initDataUnsafe.user;
  const user = TELEGRAM.initDataUnsafe.user;
  console.log(user);

  //STAR PAYMENT
  async function starPaymentFetch(_title, _description, _prices) {

    const fetchResult = {
        success: false,
        data: null,
        error: false
    };

    const request ={
        title: _title,
        description: _description,
        payload: "product_payload",
        currency: "XTR",
        prices: _prices
      };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    };

    try {        
        const url = `api.telegram.org/bot${apiKey}/createInvoiceLink`;

        await fetch(url, options).then(response => response.json()).then(data => {
            if(data.ok){
                fetchResult.success = true;
                fetchResult.data = data.result;
            }else{
                fetchResult.success = false;
                fetchResult.error = data;
            }
        });


    } catch (err) { fetchResult.success = false; fetchResult.error = true; fetchResult.data = err; }

  return fetchResult;
}

  async function starPayment() {
    console.log("button clicked")
    const prices = [{label:"Pay 2 star", amount:"2"}];
    const result = await payment.starPaymentFetch("ENR-friend", "1 friend", prices);
    if (result.success) {
      // TELEGRAM.openInvoice(result.data)
      openInvoiceLink(result.data);
    }
  }

  function openInvoiceLink(invoiceUrl) {
    // const invoiceUrl = 'https://t.me/$j4RuD3LOWEnbBgAA5o-hIxwq1GM';

    TELEGRAM.openInvoice(invoiceUrl, (status) => {
      if (status === 'success') {
        console.log('Invoice payment successful!');
        addFrens(1);
      } else {
        console.error('Error opening invoice:', status);
      }
    });
    // Send a request to the server to create a new invoice
    // fetch('https://5bd9-2a09-bac1-7a80-10-00-246-7e.ngrok-free.app/send_invoice', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json', // Specify the Content-Type as application/json
    //     'ngrok-skip-browser-warning': 'any_value',
    //   },
    //   body: JSON.stringify({ chat_id: chatId }),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Use the invoice link from the response to open the invoice
    //     // const invoiceUrl = data.invoice_url;
    //     const invoiceUrl = "https://t.me/$j4RuD3LOWEnbBgAA5o-hIxwq1GM";
    //     TELEGRAM.openInvoice(invoiceUrl, (status) => {
    //       if (status === 'success') {
    //         console.log('Invoice payment successful!');
    //       } else {
    //         console.error('Error opening invoice:', status);
    //       }
    //     });
    //   })
    //   .catch(error => console.error('Error creating invoice:', error)); // Log errors
  }

  // SHARE STORY - Only premium users
  let shareBtn = document.querySelector('.earn__item__share-btn');

  shareBtn.addEventListener('click', () => {
    if (shareBtn.textContent === 'Share') {
      if (user) {
        // if(user.is_premium){
        //   TELEGRAM.shareToStory(storyLink, {
        //     text: storyText,
        //     widget_link: {
        //         url: storyWidgetLink,
        //         name: storyWidgetName
        //     }
        //   });
        //   shareBtn.textContent="Claim"
        // } else {
        //   TELEGRAM.showAlert('You are not able to complete this task, as Telegram stories have only been rolled out to Premium users');
        // }

        TELEGRAM.shareToStory(storyLink, {
          text: storyText,
        });

        shareBtn.textContent = 'Claim';
      } else {
        showToast('error', 'No user!');
      }
    } else if (shareBtn.textContent === 'Claim') {
      if (user) {
        addCoins(5000);
        startFallingCoins();
        shareBtn.textContent = 'Claimed';
      } else {
        showToast('error', 'No user!');
      }
    }
  });

  // Settings
  TELEGRAM.setHeaderColor('#252F43');
  TELEGRAM.expand(); // Expand the app to 100% height on the user's phone

  function updateProfile() {
    // Display user information in the element
    let level = getCurrentLevel();
    updateImage(level);
    if (user) {
      playerName.textContent = `${user.first_name}`; // Display the user's first name
      telegram_username = user.first_name;
      telegram_userId = user.id;
      telegram_userPhoto = user.username;
      return telegram_username, telegram_userId, telegram_userPhoto;
    } else {
      playerName.textContent = `No user`;
      telegram_username = '#FreeDurov';
      telegram_userId = '0';
      telegram_userPhoto = 'durov';
      return telegram_username, telegram_userId, telegram_userPhoto;
    }
  }
}

//Initialize Telegram Mini App

// Abbreviate Numbers
var prefixes = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

function AbbreviateNum(number) {
  var num = (Math.log10(number) / 3) | 0;
  if (num == 0) return number;
  var prefix = prefixes[num];
  var scale = Math.pow(10, num * 3);
  var scaled = number / scale;
  return scaled.toFixed(1) + prefix;
}
// Abbreviate Numbers ends

// Vibrate setting ////////
function getVibrate() {
  return Number(localStorage.getItem('Vibrate')) || 0;
}
function setVibrate(Vibrate) {
  localStorage.setItem('Vibrate', Vibrate);
}
let xVibrate = getVibrate();
let active = false;

function vibrate() {
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
// Vibrate setting ends ////////

function openSettings() {
  Swal.fire({
    html: `
      <div id="settings_container">
        <img src="https://t.me/i/userpic/160/${telegram_userPhoto}.jpg" id="userPhoto" style="width:50px;height:50px;border-radius:50%;border:2px solid #04C98E;">
        <hr >
        <div class="space-between">
          <span>${telegram_username}</span>
          <span>${telegram_userId} </span>
        </div>
        <hr >
        <div class="space-between">
          <span>Vibration </span>
          <button id="vibrateButton" onclick="vibrate()"></button>
        </div>
        <hr >
        <div id="social">
          <a href="${TwitterLink}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
              </svg>
          <a>
          <a href="${GithubLink}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
              </svg>
          <a>
          <a href="${TelegramLink}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
              </svg>
          <a>
        </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
  });
  console.log(getVibrate());
  if (getVibrate() === 0) {
    document.getElementById('vibrateButton').textContent = 'OFF';
    active = false;
  } else if (getVibrate() === 200) {
    document.getElementById('vibrateButton').textContent = 'ON';
    active = true;
  }
}

const $score = document.querySelector('.game__score');
const $friendCount = document.querySelector('#friendCount');
const $balance = document.querySelector('.boost-menu__balance');
const $balanceMinetab = document.querySelector('.mine-tab__balance');
const $circle = document.querySelector('.game__clicker-circle');
const $mainImg = document.querySelector('.game__main-image');
const $energy = document.querySelector('.energy__value');
const $maxEnergy = document.querySelector('.energy__max');
const $toLvlUp = document.querySelector('#to-lvl-up');
const $perTap = document.querySelector('#tap');

function start() {
  setVibrate(getVibrate());
  setScore(getScore());
  setReferral(getReferral());
  setEnergy(getEnergy());
  setMaxEnergy(getMaxEnergy());
  updateLevel();
  setCoinsPerTap(getCoinsPerTap());
  setCoinsPerHour(getCoinsPerHour());
  setnextLevelScore(getnextLevelScore());
  restoreRecoveryState();
  initializeDailyRewards();
  renderStockCards('Crypto');
}

//Coins and Score

function addCoins(coins) {
  setScore(getScore() + coins);
  updateLevel();
}

//Friends

function addFrens(frens) {
  setReferral(getReferral() + frens);
}

function getReferral() {
  return Number(localStorage.getItem('frens')) || 0;
}

function getScore() {
  return Number(localStorage.getItem('score')) || 0;
}

function setReferral(frens) {
  localStorage.setItem('frens', frens);
  $friendCount.textContent = `You have ${Number(frens)} fake friend`;
}

function setScore(score) {
  localStorage.setItem('score', score);
  $score.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  $balance.textContent = String(score).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  $balanceMinetab.textContent = String(score).replace(
    /(.)(?=(\d{3})+$)/g,
    '$1,'
  );
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

function getnextLevelScore() {
  return Number(localStorage.getItem('nextLevelScore')) || 0;
}
function setnextLevelScore(nextLevelScore) {
  localStorage.setItem('nextLevelScore', nextLevelScore);
  $toLvlUp.textContent = AbbreviateNum(nextLevelScore);
}

function updateLevel() {
  const score = getScore();
  let level = getCurrentLevel();
  let nextLevelScore = getnextLevelScore();

  const levelNames = [
    'Core', // Level 0
    'Windmill', // Level 1
    'Volcanic', // Level 2
    'Stellar', // Level 3
    'Plasma', // Level 4
    'Photon', // Level 5
    'Neutron', // Level 6
    'Solar', // Level 7
    'Nexus', // Level 8
    'Quantum', // Level 9
    'Mystic', // Level 10
  ];

  $currentLvlName.textContent = levelNames[level] || 'Core';

  if (score > 50000000 && level < 10) {
    // 50M-100M
    level = 10;
    nextLevelScore = 1000000000;
  } else if (score > 25000000 && level < 9) {
    //25M-50M
    level = 9;
    nextLevelScore = 50000000;
  } else if (score > 10000000 && level < 8) {
    //10M-25M
    level = 8;
    nextLevelScore = 25000000;
  } else if (score > 5000000 && level < 7) {
    //5M-10M
    level = 7;
    nextLevelScore = 10000000;
  } else if (score > 1000000 && level < 6) {
    //1M-5M
    level = 6;
    nextLevelScore = 5000000;
  } else if (score > 500000 && level < 5) {
    //500k-1M
    level = 5;
    nextLevelScore = 1000000;
  } else if (score > 250000 && level < 4) {
    //250k-500k
    level = 4;
    nextLevelScore = 500000;
  } else if (score > 100000 && level < 3) {
    //100k-250k
    level = 3;
    nextLevelScore = 250000;
  } else if (score > 50000 && level < 2) {
    //50k-100k
    level = 2;
    nextLevelScore = 100000;
  } else if (score > 10000 && level < 1) {
    //10k-50k
    level = 1;
    nextLevelScore = 50000;
  } else if (level === 0) {
    //0-10k
    nextLevelScore = 10000;
  }

  // else {
  //   nextLevelScore = level === 1 ? 5000 : 10000;
  // }

  setCurrentLevel(level);
  setnextLevelScore(nextLevelScore);
  updateProgressBar(score, nextLevelScore);
  $toLvlUp.textContent = AbbreviateNum(nextLevelScore);
  updateImage(level);
  updateProfile();
}

function updateImage(level) {
  const levelsImages = {
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
  playerIcon.setAttribute('src', levelsImages[level]);
}

// Energy regenerator
setInterval(() => {
  if (getEnergy() < getMaxEnergy()) {
    setEnergy(getEnergy() + 1);
  }
}, 2000);

//blur the logo if Energy <= CoinsPerTap
function checkBlur() {
  if (getEnergy() >= getCoinsPerTap()) {
    $mainImg.style.filter = 'blur(0Px)';
  } else {
    $mainImg.style.filter = 'blur(3Px)';
  }
}
setInterval(() => {
  checkBlur();
}, 1000);

$circle.addEventListener('click', (event) => {
  if (getEnergy() >= getCoinsPerTap()) {
    $mainImg.style.filter = 'blur(0Px)';
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate(xVibrate);
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
    }, 500);

    const coinsPerTap = getCoinsPerTap();
    const plusCoins = document.createElement('div');
    plusCoins.classList.add('plusCoins');
    plusCoins.textContent = '+' + coinsPerTap;
    plusCoins.style.left = `${event.clientX}px`;
    plusCoins.style.top = `${event.clientY - 80}px`;

    $circle.parentElement.appendChild(plusCoins);

    addCoins(coinsPerTap);
    setEnergy(getEnergy() - getCoinsPerTap());
    updateLevel();
    setMaxEnergy(getMaxEnergy());

    setTimeout(() => {
      plusCoins.remove();
    }, 500);
  } else {
    $mainImg.style.filter = 'blur(3Px)';
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

function canUpgradeMultitap() {
  return multitapPurchases < 8;
}

// Message

function showToast(icon, title) {
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
let maxEnergyCost = Number(localStorage.getItem('maxEnergyCost')) || 1000;

function upgradeMaxEnergy() {
  setMaxEnergy(getMaxEnergy() + 500);
  maxEnergyCost += 1000;
  localStorage.setItem('maxEnergyCost', maxEnergyCost);
  document.querySelector('#max-energy-cost').textContent = maxEnergyCost;
}
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

window.addEventListener('click', function (event) {
  if (event.target === $upgradeMenu || event.target === $cardsUpgradeMenu) {
    hideUpgradeMenu();
  }
});

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
      $energyTimer.innerHTML = `${minutes}:${seconds}`;
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
const $coinsPerHourPopover = document.querySelector('#perHourPopover');
function setCoinsPerHour(coins) {
  localStorage.setItem('coinsPerHour', coins);
  $coinsPerHour.textContent = AbbreviateNum(coins);
  $coinsPerHourPopover.innerHTML = coins;
}

function getCoinsPerHour() {
  return localStorage.getItem('coinsPerHour') ?? 0;
}

//POPOVER per hour - without AbbreviateNum
let clicked = false;
$coinsPerHour.addEventListener('click', () => {
  clicked = !clicked;
  if (clicked) {
    document.getElementById('perHourPopover').style.opacity = '1';
    document.getElementById('perHourPopover').style.visibility = 'visible';
  } else {
    document.getElementById('perHourPopover').style.opacity = '0';
    document.getElementById('perHourPopover').style.visibility = 'hidden';
  }
});

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
  const newCoinsPerHour = Number(getCoinsPerHour()) + coins;
  setCoinsPerHour(newCoinsPerHour);

  startCoinAccumulation();
}
if (getCoinsPerHour() > 0) {
  startCoinAccumulation();
}

let stocks = [
  // Shares
  {
    hisse: 'APPL',
    img: 'assets/img/icons/mine/stocks/shares/apple.png',
    descr: 'Invest in Apple stocks to increase your wealth.',
    price: 100,
    pph: 7.5,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: false,
    unlockCondition: null,
    category: 'Shares',
  },
  {
    hisse: 'KCHOL',
    img: 'assets/img/icons/mine/stocks/shares/kchol.png',
    descr: 'Invest in Koç Holding for diversified industrial exposure.',
    price: 250,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'XRP', level: 6 },
    category: 'Shares',
  },
  {
    hisse: 'THYAO',
    img: 'assets/img/icons/mine/stocks/shares/turkish-airlines.png',
    descr: 'Invest in Turkish Airlines for aviation sector growth.',
    price: 350,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'KCHOL', level: 7 },
    category: 'Shares',
  },
  {
    hisse: 'TCELL',
    img: 'assets/img/icons/mine/stocks/shares/tcell.png',
    descr: 'Invest in Turkcell for telecommunications expansion.',
    price: 300,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'THYAO', level: 5 },
    category: 'Shares',
  },
  {
    hisse: 'TSLA',
    img: 'assets/img/icons/mine/stocks/shares/tesla.png',
    descr: 'Invest in Tesla for innovation in electric vehicles.',
    price: 400,
    pph: 25,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.4,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'APPL', level: 8 },
    category: 'Shares',
  },
  {
    hisse: 'MSFT',
    img: 'assets/img/icons/mine/stocks/shares/microsoft.png',
    descr: 'Invest in Microsoft for strong technology sector returns.',
    price: 500,
    pph: 30,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.25,
    maxLevel: 15,
    disabled: true,
    friendCondition: 2,
    category: 'Shares',
  },

  // Crypto
  {
    hisse: 'BTC',
    img: 'assets/img/icons/mine/stocks/crypto/bitcoin.png',
    descr: 'Invest in Bitcoin for digital currency gains.',
    price: 150,
    pph: 8,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: false,
    unlockCondition: null,
    category: 'Crypto',
  },
  {
    hisse: 'ETH',
    img: 'assets/img/icons/mine/stocks/crypto/ethereum.png',
    descr: 'Invest in Ethereum for digital currency gains.',
    price: 170,
    pph: 10,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'BTC', level: 5 },
    category: 'Crypto',
  },
  {
    hisse: 'XRP',
    img: 'assets/img/icons/mine/stocks/crypto/ripple.png',
    descr: 'Invest in Ripple for digital currency gains.',
    price: 200,
    pph: 15,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'ETH', level: 4 },
    category: 'Crypto',
  },
  {
    hisse: 'ADA',
    img: 'assets/img/icons/mine/stocks/crypto/cardano.png',
    descr: 'Invest in Cardano for smart contract innovation.',
    price: 180,
    pph: 12,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'XRP', level: 6 },
    category: 'Crypto',
  },
  {
    hisse: 'SOL',
    img: 'assets/img/icons/mine/stocks/crypto/solana.png',
    descr: 'Invest in Solana for fast and scalable blockchain solutions.',
    price: 220,
    pph: 18,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: true,
    friendCondition: 1,
    category: 'Crypto',
  },
  {
    hisse: 'DOT',
    img: 'assets/img/icons/mine/stocks/crypto/polkadot.png',
    descr: 'Invest in Polkadot for cross-chain blockchain solutions.',
    price: 250,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'SOL', level: 7 },
    category: 'Crypto',
  },

  // Commodities
  {
    hisse: 'GOLD',
    img: 'assets/img/icons/mine/stocks/commodities/gold.png',
    descr: 'Invest in gold for stability during market fluctuations.',
    price: 600,
    pph: 35,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.15,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'MSFT', level: 12 },
    category: 'Commodities',
  },
  {
    hisse: 'OIL',
    img: 'assets/img/icons/mine/stocks/commodities/oil.png',
    descr: 'Invest in oil for energy market returns.',
    price: 650,
    pph: 40,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'GOLD', level: 10 },
    category: 'Commodities',
  },
  {
    hisse: 'SILVER',
    img: 'assets/img/icons/mine/stocks/commodities/silver.png',
    descr: 'Invest in silver for a strong hedge against inflation.',
    price: 550,
    pph: 30,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'OIL', level: 8 },
    category: 'Commodities',
  },
  {
    hisse: 'NATGAS',
    img: 'assets/img/icons/mine/stocks/commodities/natural-gas.png',
    descr: 'Invest in natural gas for strong energy sector growth.',
    price: 700,
    pph: 45,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'SILVER', level: 7 },
    category: 'Commodities',
  },
  {
    hisse: 'COPPER',
    img: 'assets/img/icons/mine/stocks/commodities/copper.png',
    descr: 'Invest in copper for its essential industrial uses.',
    price: 600,
    pph: 35,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.15,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'NATGAS', level: 6 },
    category: 'Commodities',
  },
  {
    hisse: 'PLATINUM',
    img: 'assets/img/icons/mine/stocks/commodities/platinum.png',
    descr: 'Invest in platinum for high-value precious metal returns.',
    price: 800,
    pph: 50,
    purchased: 0,
    priceIncrease: 1.25,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'COPPER', level: 5 },
    category: 'Commodities',
  },
];

const mineTabButtons = document.querySelectorAll('.mine-tab__btn');
mineTabButtons.forEach((mineTabButton) => {
  mineTabButton.addEventListener('click', (e) => {
    mineTabButtons.forEach((mineTabButton) => {
      mineTabButton.classList.remove('mine-tab__btn__active');
    });
    e.target.classList.add('mine-tab__btn__active');
    loadStocks();
    const category = e.target.textContent;
    renderStockCards(category);
  });
});

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

function checkUnlockConditions() {
  const friendsCount = getReferral();

  stocks.forEach((stock) => {
    if (stock.unlockCondition) {
      const requiredStock = stocks.find(
        (s) => s.hisse === stock.unlockCondition.hisse
      );
      if (requiredStock.purchased >= stock.unlockCondition.level) {
        stock.disabled = false;
      }
    }

    // Check if the stock requires a certain number of friends to unlock
    if (stock.friendCondition && friendsCount >= stock.friendCondition) {
      stock.disabled = false;
    }
  });

  saveStocks();
}

function renderStockCards(category) {
  let str = '';
  stocks.forEach((stock, index) => {
    if (category === stock.category) {
      const isDisabled = stock.disabled === true;
      const disabledClass = isDisabled ? 'disabled' : '';
      const disabledAttr = isDisabled ? 'aria-disabled="true"' : '';

      const {
        unlockCondition,
        hisse,
        img,
        descr,
        price,
        pph,
        purchased,
        maxLevel,
      } = stock;

      const unlockText =
        isDisabled && unlockCondition
          ? `Unlock after ${unlockCondition.hisse} reaches level ${unlockCondition.level}`
          : isDisabled && stock.friendCondition
          ? `Unlock after inviting ${stock.friendCondition} friends`
          : '';

      const maxLevelText = purchased >= maxLevel ? 'Max level reached' : '';

      str += `<div class="mine-tab__card ${disabledClass}" data-index="${index}" ${disabledAttr}>
                <div class="mine-tab__card-image">
                    <h3 class="mine-tab__card-title">${hisse}</h3>
                    <img src="${img}">
                </div>
                <div class="mine-tab__card-content">
                    <p class="mine-tab__card-description">${descr}</p>
                    <div class="mine-tab__card-details">
                        <span class="mine-tab__card-price">Fee: ${price}</span>
                        <span class="card-income">Profit: ${pph}</span>
                        <p style="color: #bbb;"><span>lvl </span><span class="PerHour-level">${purchased}</span></p>
                    </div>
                </div>
                <div class="mine-tab__card-unlock">
                  <img src="/assets/img/icons/mine/lock.svg">
                  <p>${unlockText}</p>
                  <p style="color: red;">${maxLevelText}</p>
                </div>
            </div>`;
    }
  });

  const $cardContainer = document.querySelector('.mine-tab__grid');
  $cardContainer.innerHTML = str;

  document.querySelectorAll('.mine-tab__card').forEach((card) => {
    card.addEventListener('click', (e) => {
      showCardsUpgradeMenu(card);
    });
  });
}

checkUnlockConditions();
renderStockCards('Crypto');

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

//Earn section

const $checkBtn = document.querySelector('.earn__item__check-btn');
const $checkBtncontainer = $checkBtn.parentElement;

let isWalletConnected = localStorage.getItem('isWalletConnected') === 'true';

updateButtonState();

$checkBtn.addEventListener('click', () => {
  checkWalletConnection();
});

function checkWalletConnection() {
  isWalletConnected = localStorage.getItem('status') == 1;

  if (isWalletConnected) {
    addCoins(5000);
    startFallingCoins();
    localStorage.setItem('isWalletConnected', 'true');
    updateButtonState();
    showToast('success', 'Wallet connected successfully!');
  } else {
    showToast('error', 'You have not connected your wallet.');
  }
}

function updateButtonState() {
  if (localStorage.getItem('isWalletConnected') === 'true') {
    $checkBtn.style.display = 'none';

    const img = document.createElement('img');
    img.src = '/assets/img/icons/earn/completed.png';
    img.alt = 'Task completed';
    img.style.width = '30px';
    img.style.height = '30px';
    // img.style.marginLeft = '80%';

    $checkBtncontainer.appendChild(img);
  }
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
