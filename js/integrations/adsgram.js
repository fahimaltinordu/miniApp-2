let AdController;

import('../main.js')
  .then(({ adsgram_blockId }) => {
    AdController = window.Adsgram.init({
      blockId: adsgram_blockId,
    });
  })
  .catch((error) => {
    console.error('Failed to load adsgram_blockId:', error);
  });

export { AdController };
