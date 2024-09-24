import { showToast, startFallingCoins } from '../utils/utils.js';
import { addCoins } from '../gameState/gameState.js';
import { AdController } from '../integrations/adsgram.js';
import {
  walletConnectyReward,
  shareStoryReward,
  adsgramReward,
  storyLink,
  storyText,
  storyWidgetLink,
  storyWidgetName,
} from '../main.js';
import { updateLevel } from './level.js';
const $checkBtn = document.querySelector('.earn__item__check-btn');
const $checkBtncontainer = $checkBtn.parentElement;

let isWalletConnected = localStorage.getItem('isWalletConnected') === 'true';

$checkBtn.addEventListener('click', () => {
  checkWalletConnection();
});

function checkWalletConnection() {
  isWalletConnected = localStorage.getItem('status') == 1;

  if (isWalletConnected) {
    addCoins(walletConnectyReward);
    startFallingCoins();
    updateLevel();
    localStorage.setItem('isWalletConnected', 'true');
    updateButtonState();
    showToast('success', 'Wallet connected successfully!');
  } else {
    showToast('error', 'You have not connected your wallet.');
  }
}

export function updateButtonState() {
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
export function setupShareButton(TELEGRAM, user) {
  let shareBtn = document.querySelector('.earn__item__share-btn');

  shareBtn.addEventListener('click', async () => {
    if (shareBtn.textContent === 'Share') {
      if (user) {
        shareBtn.innerHTML = `<img class="promiseGif" src='../../assets/img/promiseGif.gif' />`;
        await TELEGRAM.shareToStory(storyLink, { text: storyText });
        shareBtn.textContent = 'Claim';
      } else {
        showToast('error', 'No user!');
      }
    } else if (shareBtn.textContent === 'Claim') {
      if (user) {
        addCoins(shareStoryReward);
        startFallingCoins();
        shareBtn.textContent = 'Claimed';
        updateLevel();
      } else {
        showToast('error', 'No user!');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateButtonState();
  updateWatchCount();
});

const watchAddBtn = document.querySelector('#watchAddBtn');
const $watchCount = document
  .querySelector('.earn__item__watch-count')
  .querySelector('span');
const MAX_ADS_PER_DAY = 10;
const currentDate = new Date().toISOString().slice(0, 10);

function updateWatchCount() {
  const adData = getAdData();
  const watchCount = adData.count;
  $watchCount.textContent = watchCount;
}

function getAdData() {
  const adData = JSON.parse(localStorage.getItem('adData')) || {
    count: 0,
    date: currentDate,
  };
  return adData;
}

function setAdData(adData) {
  localStorage.setItem('adData', JSON.stringify(adData));
}
const COOLDOWN_PERIOD = 5 * 60 * 1000;

watchAddBtn.addEventListener('click', async () => {
  let adData = getAdData();
  const lastAdTime = parseInt(localStorage.getItem('lastAdTime')) || 0;
  const currentTime = Date.now();

  if (currentTime - lastAdTime < COOLDOWN_PERIOD) {
    const remainingTime = COOLDOWN_PERIOD - (currentTime - lastAdTime);
    localStorage.setItem('remainingTime', remainingTime);
    updateButtonWithRemainingTime(remainingTime);
    return;
  }

  if (adData.date !== currentDate) {
    adData = { count: 0, date: currentDate };
  }

  if (adData.count >= MAX_ADS_PER_DAY) {
    showToast('error', 'No ads any more for today!');
    return;
  }

  watchAddBtn.innerHTML = `<img class="promiseGif" src='../../assets/img/promiseGif.gif' />`;

  await AdController.show()
    .then((result) => {
      addCoins(adsgramReward);
      adData.count += 1;
      // Update the last ad time in localStorage
      localStorage.setItem('lastAdTime', currentTime.toString());
      watchAddBtn.textContent = 'Watch';
      setAdData(adData);
      updateWatchCount();
      updateLevel();
      startFallingCoins();
    })
    .catch((result) => {
      showToast('error', 'No ads available!');
      watchAddBtn.textContent = 'Watch';
    });
});

function updateButtonWithRemainingTime(remainingTime) {
  const remainingMinutes = Math.floor(remainingTime / 1000 / 60);
  const remainingSeconds = Math.floor((remainingTime / 1000) % 60);
  watchAddBtn.textContent = `${remainingMinutes}:${remainingSeconds}`;
}

function updateButtonCooldown() {
  const remainingTime = parseInt(localStorage.getItem('remainingTime')) || 0;

  if (remainingTime > 0) {
    localStorage.setItem('remainingTime', remainingTime - 1000);
    updateButtonWithRemainingTime(remainingTime);
  } else {
    watchAddBtn.textContent = 'Watch';
    localStorage.removeItem('remainingTime');
  }
}

setInterval(updateButtonCooldown, 1000);

document.addEventListener('DOMContentLoaded', () => {
  const remainingTime = parseInt(localStorage.getItem('remainingTime')) || 0;

  if (remainingTime > 0) {
    updateButtonWithRemainingTime(remainingTime);
  } else {
    watchAddBtn.textContent = 'Watch';
  }
});
