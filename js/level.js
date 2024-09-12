import { AbbreviateNum } from './utils.js';
import { getScore } from './gameState.js';
import { updateProfile } from './profile.js';

// Level
const $currentLvlName = document.querySelector('.level-progress__name');
const $currentLvl = document.querySelector('.level-progress__current-level');
const $toLvlUp = document.querySelector('#to-lvl-up');
export function getCurrentLevel() {
  return Number(localStorage.getItem('level')) || 0;
}

export function setCurrentLevel(level) {
  localStorage.setItem('level', level);
  $currentLvl.textContent = level;
}
export function updateLevel() {
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

  const levelThresholds = [
    { level: 10, score: 50000000, nextLevelScore: 1000000000 },
    { level: 9, score: 25000000, nextLevelScore: 50000000 },
    { level: 8, score: 10000000, nextLevelScore: 25000000 },
    { level: 7, score: 5000000, nextLevelScore: 10000000 },
    { level: 6, score: 1000000, nextLevelScore: 5000000 },
    { level: 5, score: 500000, nextLevelScore: 1000000 },
    { level: 4, score: 250000, nextLevelScore: 500000 },
    { level: 3, score: 100000, nextLevelScore: 250000 },
    { level: 2, score: 50000, nextLevelScore: 100000 },
    { level: 1, score: 10000, nextLevelScore: 50000 },
  ];

  levelThresholds.some(
    ({ level: lvl, score: lvlScore, nextLevelScore: nls }) => {
      if (score > lvlScore && level < lvl) {
        level = lvl;
        nextLevelScore = nls;
        return true;
      }
      return false;
    }
  );

  if (level === 0) {
    nextLevelScore = 10000;
  }

  setCurrentLevel(level);
  setnextLevelScore(nextLevelScore);
  updateProgressBar(score, nextLevelScore);
  $toLvlUp.textContent = AbbreviateNum(nextLevelScore);
  updateImage(level);
  updateProfile();
}

export function getnextLevelScore() {
  return Number(localStorage.getItem('nextLevelScore')) || 0;
}
export function setnextLevelScore(nextLevelScore) {
  localStorage.setItem('nextLevelScore', nextLevelScore);
  $toLvlUp.textContent = AbbreviateNum(nextLevelScore);
}

const playerIcon = document.getElementById('player-icon');

export function updateImage(level) {
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

const progressBar = document.getElementById('level-progress');

function updateProgressBar(currentScore, maxScore) {
  progressBar.max = maxScore;
  progressBar.value = currentScore;
}
