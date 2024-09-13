import { showToast, startFallingCoins } from '../utils/utils.js';
import { addCoins } from '../gameState/gameState.js';

const $dailyRewardBtn = document.querySelector('#dailyRewardBtn');
const $dailyRewardPopup = document.querySelector('#dailyRewardPopup');
const $popupCloseBtn = document.querySelector('#popupCloseBtn');
const $claimDailyRewardBtn = document.querySelector('#popupClaimBtn');
const $dailyRewardDays = document.querySelectorAll('.popup__day');

const today = new Date().toISOString().slice(0, 10);

export function initializeDailyRewards() {
  const lastRewardDate = localStorage.getItem('lastRewardDate');
  let previousDay = parseInt(localStorage.getItem('previousDay')) || 1;

  $dailyRewardDays.forEach((day) =>
    day.classList.remove('popup__day__current', 'popup__day__completed')
  );

  if (!lastRewardDate || lastRewardDate !== today) {
    if (lastRewardDate) {
      const daysSinceLastReward = Math.floor(
        (new Date(today) - new Date(lastRewardDate)) / (1000 * 60 * 60 * 24)
      );
      previousDay = Math.min(
        previousDay + daysSinceLastReward,
        $dailyRewardDays.length
      );
    } else {
      previousDay = 1;
    }

    setPreviousDay(previousDay);
  }

  if (previousDay > $dailyRewardDays.length) {
    previousDay = 1;
    setPreviousDay(previousDay);
  }

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

  if (lastRewardDate !== today) {
    $claimDailyRewardBtn.disabled = false;
  } else {
    $claimDailyRewardBtn.disabled = true;
  }
}

function getPreviousDay() {
  return parseInt(localStorage.getItem('previousDay')) || 1;
}

function setPreviousDay(day) {
  localStorage.setItem('previousDay', day);
}

function setLastRewardDate(date) {
  localStorage.setItem('lastRewardDate', date);
}

$claimDailyRewardBtn.addEventListener('click', () => {
  ////// ADSGRAM /////
  const AdController = window.Adsgram.init({ blockId: adsgram_blockId });
      AdController.show().then((result) => {
          getDailyReward(); //distribute reward after watch the video
          console.log(result);
      }).catch((result) => {
          showToast('error', 'No ads!');
          getDailyReward(); //distribute although no ads or any other error
          console.log(result);
      })
});

function getDailyReward() {
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
}

$dailyRewardBtn.addEventListener('click', () => {
  initializeDailyRewards();
  $dailyRewardPopup.style.display = 'flex'; // Show the popup after initializing
});

$popupCloseBtn.addEventListener('click', () => {
  $dailyRewardPopup.style.display = 'none';
});

initializeDailyRewards();
