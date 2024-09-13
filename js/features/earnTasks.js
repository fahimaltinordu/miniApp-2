import { showToast, startFallingCoins } from '../utils/utils.js';
import { addCoins } from '../gameState/gameState.js';
import {walletConnectyReward, shareStoryReward} from "../main.js";
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
      } else {
        showToast('error', 'No user!');
      }
    }
  });
}
