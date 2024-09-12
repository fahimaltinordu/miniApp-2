// share.js

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
        addCoins(5000);
        startFallingCoins();
        shareBtn.textContent = 'Claimed';
      } else {
        showToast('error', 'No user!');
      }
    }
  });
}
