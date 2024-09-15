import { showToast, startFallingCoins } from '../utils/utils.js';
import { addCoins } from '../gameState/gameState.js';
import { AdController } from '../integrations/adsgram.js';
import {
  walletConnectyReward,
  shareStoryReward,
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

  shareBtn.addEventListener('click', () => {
    if (shareBtn.textContent === 'Share') {
      if (user) {
        TELEGRAM.shareToStory(storyLink, { text: storyText });
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
const maxAdsPerDay = 10;
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

watchAddBtn.addEventListener('click', () => {
  let adData = getAdData();

  if (adData.date !== currentDate) {
    adData = { count: 0, date: currentDate };
  }

  if (adData.count >= maxAdsPerDay) {
    showToast('error', 'No ads any more for today!');
    return;
  }

  AdController.show()
    .then((result) => {
      addCoins(200);
      adData.count += 1;
      setAdData(adData);
      updateWatchCount();
      updateLevel();
      startFallingCoins();
    })
    .catch((result) => {
      showToast('error', 'No ads available!');
    });
});
