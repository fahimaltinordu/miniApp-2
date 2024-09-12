import { getReferral } from './referrals.js';
import { showToast } from './utils.js';
import { hideUpgradeMenu, showCardsUpgradeMenu } from './upgrades.js';
import { getScore, setScore } from './gameState.js';
import { getCoinsPerHour, updateCoinsPerHour } from './upgrades.js';
import { updateLevel } from './level.js';

export let stocks = [
  // Shares
  {
    hisse: 'APPL',
    img: 'assets/img/icons/mine/stocks/shares/apple.png',
    descr: 'Invest in Apple stocks to increase your wealth.',
    price: 100,
    pph: 7.5,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: false,
    unlockCondition: null,
    category: 'Shares',
  },
  {
    hisse: 'KCHOL',
    img: 'assets/img/icons/mine/stocks/shares/kchol.png',
    descr: 'Invest in Koç Holding for diversified industrial exposure.',
    price: 250,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'XRP', level: 6 },
    category: 'Shares',
  },
  {
    hisse: 'THYAO',
    img: 'assets/img/icons/mine/stocks/shares/turkish-airlines.png',
    descr: 'Invest in Turkish Airlines for aviation sector growth.',
    price: 350,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'KCHOL', level: 7 },
    category: 'Shares',
  },
  {
    hisse: 'TCELL',
    img: 'assets/img/icons/mine/stocks/shares/tcell.png',
    descr: 'Invest in Turkcell for telecommunications expansion.',
    price: 300,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'THYAO', level: 5 },
    category: 'Shares',
  },
  {
    hisse: 'TSLA',
    img: 'assets/img/icons/mine/stocks/shares/tesla.png',
    descr: 'Invest in Tesla for innovation in electric vehicles.',
    price: 400,
    pph: 25,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.4,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'APPL', level: 8 },
    category: 'Shares',
  },
  {
    hisse: 'MSFT',
    img: 'assets/img/icons/mine/stocks/shares/microsoft.png',
    descr: 'Invest in Microsoft for strong technology sector returns.',
    price: 500,
    pph: 30,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.25,
    maxLevel: 15,
    disabled: true,
    friendCondition: 2,
    category: 'Shares',
  },

  // Crypto
  {
    hisse: 'BTC',
    img: 'assets/img/icons/mine/stocks/crypto/bitcoin.png',
    descr: 'Invest in Bitcoin for digital currency gains.',
    price: 150,
    pph: 8,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: false,
    unlockCondition: null,
    category: 'Crypto',
  },
  {
    hisse: 'ETH',
    img: 'assets/img/icons/mine/stocks/crypto/ethereum.png',
    descr: 'Invest in Ethereum for digital currency gains.',
    price: 170,
    pph: 10,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'BTC', level: 5 },
    category: 'Crypto',
  },
  {
    hisse: 'XRP',
    img: 'assets/img/icons/mine/stocks/crypto/ripple.png',
    descr: 'Invest in Ripple for digital currency gains.',
    price: 200,
    pph: 15,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'ETH', level: 4 },
    category: 'Crypto',
  },
  {
    hisse: 'ADA',
    img: 'assets/img/icons/mine/stocks/crypto/cardano.png',
    descr: 'Invest in Cardano for smart contract innovation.',
    price: 180,
    pph: 12,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'XRP', level: 6 },
    category: 'Crypto',
  },
  {
    hisse: 'SOL',
    img: 'assets/img/icons/mine/stocks/crypto/solana.png',
    descr: 'Invest in Solana for fast and scalable blockchain solutions.',
    price: 220,
    pph: 18,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: true,
    friendCondition: 1,
    category: 'Crypto',
  },
  {
    hisse: 'DOT',
    img: 'assets/img/icons/mine/stocks/crypto/polkadot.png',
    descr: 'Invest in Polkadot for cross-chain blockchain solutions.',
    price: 250,
    pph: 20,
    purchased: 0,
    priceIncrease: 1.15,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'SOL', level: 7 },
    category: 'Crypto',
  },

  // Commodities
  {
    hisse: 'GOLD',
    img: 'assets/img/icons/mine/stocks/commodities/gold.png',
    descr: 'Invest in gold for stability during market fluctuations.',
    price: 600,
    pph: 35,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.15,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'MSFT', level: 12 },
    category: 'Commodities',
  },
  {
    hisse: 'OIL',
    img: 'assets/img/icons/mine/stocks/commodities/oil.png',
    descr: 'Invest in oil for energy market returns.',
    price: 650,
    pph: 40,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'GOLD', level: 10 },
    category: 'Commodities',
  },
  {
    hisse: 'SILVER',
    img: 'assets/img/icons/mine/stocks/commodities/silver.png',
    descr: 'Invest in silver for a strong hedge against inflation.',
    price: 550,
    pph: 30,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.1,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'OIL', level: 8 },
    category: 'Commodities',
  },
  {
    hisse: 'NATGAS',
    img: 'assets/img/icons/mine/stocks/commodities/natural-gas.png',
    descr: 'Invest in natural gas for strong energy sector growth.',
    price: 700,
    pph: 45,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.2,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'SILVER', level: 7 },
    category: 'Commodities',
  },
  {
    hisse: 'COPPER',
    img: 'assets/img/icons/mine/stocks/commodities/copper.png',
    descr: 'Invest in copper for its essential industrial uses.',
    price: 600,
    pph: 35,
    purchased: 0,
    priceIncrease: 1.2,
    pphIncrease: 1.15,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'NATGAS', level: 6 },
    category: 'Commodities',
  },
  {
    hisse: 'PLATINUM',
    img: 'assets/img/icons/mine/stocks/commodities/platinum.png',
    descr: 'Invest in platinum for high-value precious metal returns.',
    price: 800,
    pph: 50,
    purchased: 0,
    priceIncrease: 1.25,
    pphIncrease: 1.3,
    maxLevel: 15,
    disabled: true,
    unlockCondition: { hisse: 'COPPER', level: 5 },
    category: 'Commodities',
  },
];

const mineTabButtons = document.querySelectorAll('.mine-tab__btn');
mineTabButtons.forEach((mineTabButton) => {
  mineTabButton.addEventListener('click', (e) => {
    mineTabButtons.forEach((mineTabButton) => {
      mineTabButton.classList.remove('mine-tab__btn__active');
    });
    e.target.classList.add('mine-tab__btn__active');
    loadStocks();
    const category = e.target.textContent;
    renderStockCards(category);
  });
});

export function loadStocks() {
  const savedStocks = localStorage.getItem('stocks');
  if (savedStocks) {
    stocks = JSON.parse(savedStocks);
  }
}

function saveStocks() {
  localStorage.setItem('stocks', JSON.stringify(stocks));
}

export function checkUnlockConditions() {
  const friendsCount = getReferral();

  stocks.forEach((stock) => {
    if (stock.unlockCondition) {
      const requiredStock = stocks.find(
        (s) => s.hisse === stock.unlockCondition.hisse
      );
      if (requiredStock.purchased >= stock.unlockCondition.level) {
        stock.disabled = false;
      }
    }

    // Check if the stock requires a certain number of friends to unlock
    if (stock.friendCondition && friendsCount >= stock.friendCondition) {
      stock.disabled = false;
    }
  });

  saveStocks();
}

export function renderStockCards(category) {
  let str = '';
  stocks.forEach((stock, index) => {
    if (category === stock.category) {
      const isDisabled = stock.disabled === true;
      const disabledClass = isDisabled ? 'disabled' : '';
      const disabledAttr = isDisabled ? 'aria-disabled="true"' : '';

      const {
        unlockCondition,
        hisse,
        img,
        descr,
        price,
        pph,
        purchased,
        maxLevel,
      } = stock;

      const unlockText =
        isDisabled && unlockCondition
          ? `Unlock after ${unlockCondition.hisse} reaches level ${unlockCondition.level}`
          : isDisabled && stock.friendCondition
          ? `Unlock after inviting ${stock.friendCondition} friends`
          : '';

      const maxLevelText = purchased >= maxLevel ? 'Max level reached' : '';

      str += `<div class="mine-tab__card ${disabledClass}" data-index="${index}" ${disabledAttr}>
                <div class="mine-tab__card-image">
                    <h3 class="mine-tab__card-title">${hisse}</h3>
                    <img src="${img}">
                </div>
                <div class="mine-tab__card-content">
                    <p class="mine-tab__card-description">${descr}</p>
                    <div class="mine-tab__card-details">
                        <span class="mine-tab__card-price">Fee: ${price}</span>
                        <span class="card-income">Profit: ${pph}</span>
                        <p style="color: #bbb;"><span>lvl </span><span class="PerHour-level">${purchased}</span></p>
                    </div>
                </div>
                <div class="mine-tab__card-unlock">
                  <img src="/assets/img/icons/mine/lock.svg">
                  <p>${unlockText}</p>
                  <p style="color: red;">${maxLevelText}</p>
                </div>
            </div>`;
    }
  });

  const $cardContainer = document.querySelector('.mine-tab__grid');
  $cardContainer.innerHTML = str;

  document.querySelectorAll('.mine-tab__card').forEach((card) => {
    card.addEventListener('click', (e) => {
      showCardsUpgradeMenu(card);
    });
  });
}
