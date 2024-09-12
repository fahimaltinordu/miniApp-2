import { getCurrentLevel, updateImage } from './level.js';

export function updateProfile(TELEGRAM, user, playerName) {
  console.log(playerName);

  let level = getCurrentLevel();
  updateImage(level);

  if (playerName && playerName instanceof HTMLElement) {
    if (user) {
      playerName.textContent = `${user.first_name}`;
      return {
        username: user.first_name,
        userId: user.id,
        userPhoto: user.username,
      };
    } else {
      playerName.textContent = `No user`;
      return {
        username: '#FreeDurov',
        userId: '0',
        userPhoto: 'durov',
      };
    }
  } else {
    console.error('playerName is not a valid DOM element');

    return null;
  }
}
