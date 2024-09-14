import { getCurrentLevel, updateImage } from '../features/level.js';
// import {playerName} from "../main.js";
export function updateProfile(TELEGRAM, user) {

  let level = getCurrentLevel();
  updateImage(level);

  if (playerName && playerName instanceof HTMLElement) {
    if (user) {
      // playerName.textContent = `${user.first_name}`;
      return {
        telegram_username: user.first_name,
        telegram_userId: user.id,
        telegram_userPhoto: user.username,
        playerName_textContent: user.first_name,
      };
    } else {
      // playerName.textContent = `No user`;
      return {
        telegram_username: '#FreeDurov',
        telegram_userId: '0',
        telegram_userPhoto: 'durov',
        playerName_textContent: 'No user',
      };
    }
  } 
  else {
    console.error('playerName is not a valid DOM element');

    return null;
  }
}
