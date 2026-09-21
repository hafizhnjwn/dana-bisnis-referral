import { renderToStaticMarkup } from 'react-dom/server';
import screens from './src/screens.jsx';

const base = {
  s: {
    role: 'consumer',
    screen: 'home',
    balances: { consumer: 152300, merchant: 96500, referred: 0 },
    inviter: 'Rian Prasetya',
    referrals: [
      { id: 1, name: 'Warung A', category: 'F&B / Warung Makan', phone: '0812', stage: 0, claimedStage: 0, tx: 0, day: 'x' },
      { id: 2, name: 'Warung B', category: 'F&B / Warung Makan', phone: '0812', stage: 1, claimedStage: 0, tx: 0, day: 'x' },
      { id: 3, name: 'Warung C', category: 'Toko Kelontong', phone: '0812', stage: 2, claimedStage: 0, tx: 3, day: 'x' },
      { id: 4, name: 'Warung D', category: 'Jasa / Bengkel', phone: '0812', stage: 3, claimedStage: 3, tx: 41, day: 'x' },
    ],
    merchant: {
      name: 'Warung Nasi Pak Joko',
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
  inviter: 'Rian Prasetya',
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

const rian = asRole('consumer', 'Rian Prasetya', 'R', null, 152300);
const ratna = asRole('merchant', 'Ratna Dewi', 'R', 'Martabak Bu Ratna', 96500);

for (const [name, Screen] of Object.entries(screens)) {
  const html = renderToStaticMarkup(<Screen {...rian} />);
  if (html.length < 500) throw new Error(`screen ${name} rendered suspiciously little markup`);
  console.log(`${name}: ok (${html.length} chars)`);
}

// Regression: host-app screens must never render another persona's identity.
const ratnaHome = renderToStaticMarkup(<screens.home {...ratna} />);
if (ratnaHome.includes('Rian')) throw new Error('Home leaks the consumer persona while viewing as Bu Ratna');
if (!ratnaHome.includes('96.500')) throw new Error('Home does not show the active persona wallet');
const ratnaBiz = renderToStaticMarkup(<screens.bizdash {...ratna} />);
if (!ratnaBiz.includes('Martabak Bu Ratna')) throw new Error('Bisnis tab does not show the merchant store');
const ratnaHub = renderToStaticMarkup(<screens.hub {...ratna} />);
if (!ratnaHub.includes('Bantu Daftarkan Rekan Usaha')) throw new Error('Hub does not adapt to merchant');
console.log('persona isolation: ok');

