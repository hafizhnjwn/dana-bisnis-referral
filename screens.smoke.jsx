import { renderToStaticMarkup } from 'react-dom/server';
import screens from './src/screens.jsx';

const base = {
  s: {
    role: 'consumer',
    screen: 'home',
    balances: { consumer: 152300, merchant: 96500, referred: 0 },
    inviter: 'Dimas Prasetya',
    referrals: [
      { id: 1, name: 'Warung A', category: 'F&B / Warung Makan', phone: '0812', stage: 0, claimedStage: 0, tx: 0, day: 'x' },
      { id: 2, name: 'Warung B', category: 'F&B / Warung Makan', phone: '0812', stage: 1, claimedStage: 0, tx: 0, day: 'x' },
      { id: 3, name: 'Warung C', category: 'Toko Kelontong', phone: '0812', stage: 2, claimedStage: 0, tx: 3, day: 'x' },
      { id: 4, name: 'Warung D', category: 'Jasa / Bengkel', phone: '0812', stage: 3, claimedStage: 3, tx: 41, day: 'x' },
    ],
    merchant: {
      name: 'Warung Nasi Bu Siti',
      category: 'F&B / Warung Makan',
      location: '',
      issued: true,
      testScan: true,
      firstPayment: 12000,
      modalBonus: 15000,
    },
    nominatedId: 1,
    soundbox: null,
    toast: null,
  },
  go() {},
  notify() {},
  patch() {},
  announce() {},
  nominate() {},
  issueQris() {},
  testScan() {},
  receivePayment() {},
  reachRetention() {},
  nudge() {},
  claim() {},
  reset() {},
  inviter: 'Dimas Prasetya',
  earned: 50000,
  activeCount: 2,
  claimable: {
    rows: [{ merchant: 'Warung C', label: 'x', amount: 20000, type: 'saldo' }],
    saldo: 20000,
    voucher: 5000,
    total: 25000,
  },
};

const asRole = (id, name, initial, store, balance) => ({
  ...base,
  s: { ...base.s, role: id },
  user: { id, name, initial, store, balance },
});

const dimas = asRole('consumer', 'Dimas Prasetya', 'D', null, 152300);
const joko = asRole('merchant', 'Joko Santoso', 'J', 'Martabak Pak Joko', 96500);

for (const [name, Screen] of Object.entries(screens)) {
  const html = renderToStaticMarkup(<Screen {...dimas} />);
  if (html.length < 500) throw new Error(`screen ${name} rendered suspiciously little markup`);
  console.log(`${name}: ok (${html.length} chars)`);
}

// Regression: host-app screens must never render another persona's identity.
const jokoHome = renderToStaticMarkup(<screens.home {...joko} />);
if (jokoHome.includes('Dimas')) throw new Error('Home leaks the consumer persona while viewing as Pak Joko');
if (!jokoHome.includes('96.500')) throw new Error('Home does not show the active persona wallet');
const jokoBiz = renderToStaticMarkup(<screens.bizdash {...joko} />);
if (!jokoBiz.includes('Martabak Pak Joko')) throw new Error('Bisnis tab does not show the merchant store');
const jokoHub = renderToStaticMarkup(<screens.hub {...joko} />);
if (!jokoHub.includes('Mitra Bisnis')) throw new Error('Hub does not adapt to merchant');
console.log('persona isolation: ok');
