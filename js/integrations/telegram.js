// telegram.js

export function initializeTelegramApp() {
  if (window.Telegram && window.Telegram.WebApp) {
    const TELEGRAM = window.Telegram.WebApp;

    TELEGRAM.ready();
    TELEGRAM.disableVerticalSwipes();
    TELEGRAM.enableClosingConfirmation();

    const playerInfo = document.querySelector('.player__info');
    playerInfo.style.display = 'flex';

    TELEGRAM.setHeaderColor('#252F43');
    TELEGRAM.expand();

    return TELEGRAM;
  } else {
    console.error('Telegram WebApp is not available.');
    return null;
  }
}
