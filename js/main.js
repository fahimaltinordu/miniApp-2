localStorage.clear(); // DELETE THIS /////////////////////////////
import { initializeDailyRewards } from './features/dailyRewards.js';
import {
  setScore,
  getScore,
  addCoins,
  setEnergy,
  getEnergy,
  setMaxEnergy,
  getMaxEnergy,
} from './gameState/gameState.js';
import { restoreRecoveryState } from './gameState/energyRecovery.js';
import {
  updateLevel,
  getnextLevelScore,
  setnextLevelScore,
} from './features/level.js';
import {
  setVibrate,
  getVibrate,
  vibrate,
  xVibrate,
  checkVibrate,
} from './utils/vibrate.js';
import { updateButtonState } from './features/earnTasks.js';
import {
  toggleBoostMenu,
  hideUpgradeMenu,
  getCoinsPerHour,
  setCoinsPerHour,
  getCoinsPerTap,
  setCoinsPerTap,
  startCoinAccumulation,
} from './features/upgrades.js';
import { getReferral, setReferral } from './user/referrals.js';
import {
  loadStocks,
  checkUnlockConditions,
  renderStockCards,
} from './gameState/stocks.js';

import { initializeTelegramApp } from './integrations/telegram.js';
import { starPaymentFetch } from './integrations/payment.js';
import { setupShareButton } from './features/earnTasks.js';
import { updateProfile } from './user/profile.js';

///////////////////////////////  CONFIG START  /////////////////////////////
//story
export let storyLink =
  'https://mini-app-2.vercel.app/assets/img/5976773169836572554.jpg';
export let storyText = 'join #EnergyFi, invest stocks, tap & earn $ENR';
export let storyWidgetLink = ' https://t.me/EnergyFi_testApp_bot/EnergyFi';
export let storyWidgetName = '@energyFi_tap';
//socialMedia
const TelegramLink = 'https://t.me/EnergyFi_org';
const TwitterLink = 'https://twitter.com/EnergyFi_org';
const GithubLink = 'https://github.com/fahimaltinordu/miniApp-2';
//cloudflare
const c_url = 'https://sweet-lake-5572.fahimaltinordu-yedek.workers.dev';
//createInvoice
const apiKey = '7513220093:AAFogDDXxV-lWOMUva4Kzhw0LE8gI7tA93A'; //bot token
const invoiceTitle = 'ENR-friend';
const invoiceDescription = 'invite 1 friend';
const invoiceAmount = 2;
const invoiceAmountLabel = `${invoiceAmount} stars`;
//adsgram blockID
export const adsgram_blockId = '2808';
//share story
export const shareStoryReward = 5000;
//wallet connect
export const walletConnectyReward = 5000;
///////////////////////////////  CONFIG END  /////////////////////////////

window.addEventListener('load', function () {
  setTimeout(loadingDelay, 2000);
});
function loadingDelay() {
  document.getElementById('loading').style.display = 'none';
}
// main.js

const TELEGRAM = initializeTelegramApp();

export let playerName = document.getElementById('player-name');
if (TELEGRAM) {
  const user = TELEGRAM.initDataUnsafe.user;

  // Update profile
  let profileData = updateProfile(TELEGRAM, user);

  playerName.textContent = profileData.playerName_textContent;

  const $openSettingsbtn = document.querySelector('.openSettingsbtn');
  $openSettingsbtn.addEventListener('click', () => {
    openSettings(
      profileData.telegram_userPhoto,
      profileData.telegram_username,
      profileData.telegram_userId
    );
  });

  // Payment
  const payWithStar = document.querySelector('.pay_with_star');
  payWithStar.addEventListener('click', async () => {
    console.log('button clicked');
    const prices = [{ label: invoiceAmountLabel, amount: invoiceAmount }];
    const result = await starPaymentFetch(
      apiKey,
      invoiceTitle,
      invoiceDescription,
      prices
    );
    console.log(result.data);
    if (result.success) {
      openInvoiceLink(result.data);
    }
  });

  function openInvoiceLink(invoiceUrl) {
    TELEGRAM.openInvoice(invoiceUrl, (status) => {
      console.log(status);
      if (status === 'success') {
        console.log('Invoice payment successful!');
        addFrens(1);
      } else {
        console.error('Error opening invoice:', status);
      }
    });
  }

  // Setup share button
  setupShareButton(TELEGRAM, user);
}
//Initialize Telegram Mini App END

function openSettings(a, b, c) {
  Swal.fire({
    html: `
      <div id="settings_container">
        <img src="https://t.me/i/userpic/160/${a}.jpg" id="userPhoto" style="width:50px;height:50px;border-radius:50%;border:2px solid #04C98E;">
        <hr >
        <div class="space-between">
          <span>${b}</span>
          <span>${c} </span>
        </div>
        <hr >
        <div class="space-between">
          <span>Vibration </span>
          <button id="vibrateButton"></button>
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

  let vibrateButton = document.getElementById('vibrateButton');
  vibrateButton.addEventListener('click', () => {
    vibrate();
  });

  checkVibrate();
}

// let telegram_username = '';
// let telegram_userId = '';
// let telegram_userPhoto = '';

const playerIcon = document.getElementById('player-icon');
// const playerName = document.getElementById('player-name');
const userPhoto = document.getElementById('userPhoto');

const $circle = document.querySelector('.game__clicker-circle');
const $mainImg = document.querySelector('.game__main-image');

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

const $boostBtn = document.querySelector('.boost');
const $boostCloseBtn = document.querySelector('.boost-menu__close-btn');

$boostBtn.addEventListener('click', () => {
  toggleBoostMenu();
});
$boostCloseBtn.addEventListener('click', () => {
  toggleBoostMenu();
});

const $closeUpgBtn = document.querySelector('.close-upgrade-menu-btn');
$closeUpgBtn.addEventListener('click', () => {
  hideUpgradeMenu();
});
const $closeCardBtn = document.querySelector('#close-btn__card');
$closeCardBtn.addEventListener('click', () => {
  hideUpgradeMenu();
});

if (getCoinsPerHour() > 0) {
  startCoinAccumulation();
}

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

//POPOVER per hour - without AbbreviateNum
let clicked = false;
const $coinsPerHour = document.querySelector('#perHour');
const $coinsPerHourPopover = document.querySelector('#perHourPopover');
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

loadStocks();
checkUnlockConditions();
renderStockCards('Crypto');

//Earn section
updateButtonState();

start();
