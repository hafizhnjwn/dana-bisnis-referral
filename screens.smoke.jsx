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
  go() { },
  notify() { },
  patch() { },
  announce() { },
  nominate() { },
  issueQris() { },
  testScan() { },
  receivePayment() { },
  reachRetention() { },
  nudge() { },
  claim() { },
  reset() { },
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
const ratnaHub = renderToStaticMarkup(
  <screens.hub {...ratna} s={{ ...ratna.s, hasSeenAffiliateGuide: true }} />,
);
if (!ratnaHub.includes('Bantu Daftarkan Rekan Usaha')) throw new Error('Hub does not adapt to merchant');

// Panduan juga harus tampil untuk track Mitra Bisnis, dengan reward kupon (bukan saldo),
// supaya langkah "selesaikan panduan" bisa diselesaikan di skenario 2.
const ratnaGuide = renderToStaticMarkup(<screens.hub {...ratna} />);
if (!ratnaGuide.includes('PANDUAN REFERER')) throw new Error('Merchant track never sees the affiliate guide');
console.log('persona isolation: ok');

// Regression: panduan affiliate wajib hilang begitu penandanya tersimpan, kalau tidak
// tombol "Bantu Daftarkan Warung Sekarang!" terasa mati karena panduan terbuka ulang.
const rianAfterGuide = { ...rian, s: { ...rian.s, hasSeenAffiliateGuide: true } };
const hubAfterGuide = renderToStaticMarkup(<screens.hub {...rianAfterGuide} />);
if (hubAfterGuide.includes('PANDUAN REFERER')) {
  throw new Error('Guide still covers the hub after hasSeenAffiliateGuide is set');
}
if (!hubAfterGuide.includes('Bantu Daftarkan Warung Langganan')) {
  throw new Error('Hub content missing after the guide is dismissed');
}

// Regression: checklist QRIS menampilkan milestone status tanpa tombol trigger demo
const jokoQris = {
  ...base,
  s: { ...base.s, role: 'referred', merchant: { ...base.s.merchant, testScan: false, firstPayment: 0 } },
  user: { id: 'referred', name: 'Joko Santoso', initial: 'J', store: 'Warung Nasi Pak Joko', balance: 0 },
};
const qrisHtml = renderToStaticMarkup(<screens.qris {...jokoQris} />);
for (const label of ['QRIS toko aktif', 'Terima pembayaran pertama min. Rp10.000']) {
  if (!qrisHtml.includes(label)) throw new Error(`QRIS checklist is missing milestone: ${label}`);
}
console.log('guide dismissal & in-phone actions: ok');

// Regression: Qris must have button to open complete business profile & guide (Step 8)
if (!qrisHtml.includes('Buka Profil DANA Bisnis &amp; Panduan Toko')) {
  throw new Error('QRIS is missing button to open BizProfile');
}

// Regression: BizDash for Pak Joko must show the 4 actions, bubble guide, and reward cards (Step 9 & 10)
const jokoBizHtml = renderToStaticMarkup(<screens.bizdash {...jokoQris} initialTour={true} />);
for (const act of ['Buka QRIS', 'Tarik Saldo', 'Transfer', 'Pembayaran']) {
  if (!jokoBizHtml.includes(act)) throw new Error(`BizDash is missing action: ${act}`);
}
if (!jokoBizHtml.includes('Panduan Aksi')) {
  throw new Error('BizDash is missing the Bubble Chat Guide');
}
if (!jokoBizHtml.includes('Hadiah Tahap 1: Bebas Tarik Tunai 2x')) {
  throw new Error('BizDash is missing Hadiah Tahap 1 card');
}
if (!jokoBizHtml.includes('Hadiah Tahap 2: Bebas Biaya Admin 10x')) {
  throw new Error('BizDash is missing Hadiah Tahap 2 card');
}
console.log('4 quick actions, bubble chat guide & reward cards: ok');
