import { renderToStaticMarkup } from 'react-dom/server';
import screens, { AffiliateCarouselGuide } from './src/screens.jsx';

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
const putu = asRole('merchant', 'Putu Dewi', 'P', 'Toko Grosir Bu Putu', 96500);
const ratna = putu; // backward compatibility alias

for (const [name, Screen] of Object.entries(screens)) {
  const html = renderToStaticMarkup(<Screen {...rian} />);
  if (html.length < 500) throw new Error(`screen ${name} rendered suspiciously little markup`);
  console.log(`${name}: ok (${html.length} chars)`);
}

// Regression: host-app screens must never render another persona's identity.
const ratnaHome = renderToStaticMarkup(<screens.home {...ratna} />);
if (ratnaHome.includes('Rian')) throw new Error('Home leaks the consumer persona while viewing as Bu Putu');
if (!ratnaHome.includes('96.500')) throw new Error('Home does not show the active persona wallet');
const ratnaBiz = renderToStaticMarkup(<screens.bizdash {...ratna} />);
if (!ratnaBiz.includes('Toko Grosir Bu Putu')) throw new Error('Bisnis tab does not show the merchant store');
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
if (!jokoBizHtml.includes('Tampilkan QRIS di HP atau cetak poster kasir untuk terima semua bank.')) {
  throw new Error('BizDash is missing the Bubble Chat Guide');
}
if (jokoBizHtml.includes('Panduan Fitur') || jokoBizHtml.includes('PEMBAYARAN DIGITAL') || jokoBizHtml.includes('1. QRIS Toko')) {
  throw new Error('BizDash guide should only show description, without header or tags');
}
if (!jokoBizHtml.includes('Lihat Rincian Kupon Saya di Tab Reward')) {
  throw new Error('BizDash is missing button to open Reward tab');
}
// Regression: Trust Signals horizontal scroll deck (toko di luar tanda quote)
if (!jokoBizHtml.includes('Toko Grosir Bu Siti') || !jokoBizHtml.includes('Aktivasi QRIS Dana Bisnis meningkatkan pendapatan sampai 20%')) {
  throw new Error('BizDash is missing required Bu Siti trust signal');
}
if (!jokoBizHtml.includes('Bukti Nyata Rekan Usaha') || !jokoBizHtml.includes('Warung Madura Cak Munir')) {
  throw new Error('BizDash is missing trust signals deck');
}
if (jokoBizHtml.includes('&ldquo;Warung Madura Cak Munir') || jokoBizHtml.includes('“Warung Madura Cak Munir')) {
  throw new Error('Store name must be outside quotation marks');
}
if (jokoBizHtml.includes('★') || jokoBizHtml.includes('Geser')) {
  throw new Error('BizDash trust signals section should not have star icon or Geser indicator');
}
const ratnaBizHtml = renderToStaticMarkup(<screens.bizdash {...ratna} />);
if (!ratnaBizHtml.includes('Lihat Rincian Kupon Saya di Tab Reward')) {
  throw new Error('Bu Putu BizDash is missing button to open Reward tab');
}
// Regression: Combined card has 3 stages (Transaksi >= Rp 10k, 5 Transaksi, Tempel QRIS)
for (const stepLabel of ['Transaksi ≥ Rp 10k', '5 Transaksi', 'Tempel QRIS']) {
  if (!jokoBizHtml.includes(stepLabel)) throw new Error(`BizDash combined card missing stage: ${stepLabel}`);
}
console.log('4 quick actions, bubble chat guide, trust signals, 3-stage progress card & reward buttons: ok');

// Regression: Once guide is completed, it should NOT show automatically when reopened
const jokoBizAfterGuide = renderToStaticMarkup(
  <screens.bizdash {...jokoQris} progress={{ biz_guide: true }} />
);
if (jokoBizAfterGuide.includes('Tampilkan QRIS di HP atau cetak poster kasir untuk terima semua bank.')) {
  throw new Error('BizDash guide should NOT appear after being completed');
}
console.log('guide dismissal on reopen: ok');

// Regression: Pak Joko compact reward cards & referal isolation
const jokoIsolated = {
  ...jokoQris,
  s: {
    ...jokoQris.s,
    role: 'referred',
    referrals: [],
    rewardQuotas: { referred: { withdraw: 2, admin: 10 } },
  },
};
const jokoRewardsBeforeStage2 = renderToStaticMarkup(<screens.rewards {...jokoIsolated} />);
if (!jokoRewardsBeforeStage2.includes('Reward Tahap 1 : Merchant Baru') || !jokoRewardsBeforeStage2.includes('Gratis Tarik Tunai 2x') || !jokoRewardsBeforeStage2.includes('Gunakan Kupon')) {
  throw new Error('Pak Joko Reward Tahap 1 missing concise card elements');
}
// Tahap 2 harus belum ada sebelum tahap 2 selesai
if (jokoRewardsBeforeStage2.includes('Reward Tahap 2 : Merchant Baru')) {
  throw new Error('Pak Joko Reward Tahap 2 should NOT appear before stage 2 is complete');
}

// Setelah Tahap 2 selesai, barulah Tahap 2 muncul
const jokoIsolatedStage2 = {
  ...jokoIsolated,
  progress: { stage2: true },
};
const jokoRewardsAfterStage2 = renderToStaticMarkup(<screens.rewards {...jokoIsolatedStage2} />);
if (!jokoRewardsAfterStage2.includes('Reward Tahap 2 : Merchant Baru') || !jokoRewardsAfterStage2.includes('Gratis Admin 10x')) {
  throw new Error('Pak Joko Reward Tahap 2 missing after stage 2 is complete');
}

const jokoTrackerHtml = renderToStaticMarkup(<screens.tracker {...jokoIsolated} />);
if (!jokoTrackerHtml.includes('Program Referal Kosong')) {
  throw new Error('Pak Joko referral tracker is not empty');
}

// Regression: Bu Ratna compact reward cards
const ratnaRewardsBeforeStage2 = renderToStaticMarkup(<screens.rewards {...ratna} />);
if (!ratnaRewardsBeforeStage2.includes('Reward Tahap 1 : Warung Sembako Pak Joko') || !ratnaRewardsBeforeStage2.includes('Gratis Transfer 2x') || !ratnaRewardsBeforeStage2.includes('Gunakan Kupon')) {
  throw new Error('Bu Ratna Reward Tahap 1 missing concise card elements');
}
if (ratnaRewardsBeforeStage2.includes('Reward Tahap 2 : Warung Sembako Pak Joko')) {
  throw new Error('Bu Ratna Reward Tahap 2 should NOT appear before stage 2 is complete');
}

// Regression: Rian compact reward cards
const rianRewardsHtml = renderToStaticMarkup(<screens.rewards {...rian} />);
if (!rianRewardsHtml.includes('Reward Tahap 1 : Warung Sembako Pak Joko') || !rianRewardsHtml.includes('Saldo DANA Rp 5.000') || !rianRewardsHtml.includes('Telah masuk ke saldo')) {
  throw new Error('Rian Reward Tahap 1 missing concise card elements');
}
// Regression: Bu Ratna isolated with no referral history
const ratnaIsolated = {
  ...ratna,
  s: {
    ...ratna.s,
    referrals: [],
  },
};
const ratnaTrackerHtml = renderToStaticMarkup(<screens.tracker {...ratnaIsolated} />);
if (!ratnaTrackerHtml.includes('Program Referal Kosong')) {
  throw new Error('Bu Ratna referral tracker is not empty');
}

// Regression: Tracker list must have Tempel QRIS step
const rianTrackerHtml = renderToStaticMarkup(<screens.tracker {...rian} />);
if (!rianTrackerHtml.includes('Tempel QRIS')) {
  throw new Error('Tracker missing Tempel QRIS progress pill');
}

const ratnaTransferHtml = renderToStaticMarkup(<screens.transfer {...ratnaIsolated} />);
if (!ratnaTransferHtml.includes('Kirim Uang ke Bank') || !ratnaTransferHtml.includes('CV Berkah Pangan') || !ratnaTransferHtml.includes('BCA') || !ratnaTransferHtml.includes('Rp2.500') || !ratnaTransferHtml.includes('Coba →')) {
  throw new Error('Transfer page missing Bank BCA admin fee simulation or Coba → button');
}
if (ratnaTransferHtml.includes('+Rp2.500')) {
  throw new Error('Duplicate +Rp2.500 badge should not exist in transfer screen');
}

// Regression: Pak Joko manual photo verification button directly under progress stages
const jokoBizWaitingTx = renderToStaticMarkup(
  <screens.bizdash {...jokoIsolated} progress={{ stage1: true }} />
);
if (!jokoBizWaitingTx.includes('Menunggu 5 Transaksi Selesai')) {
  throw new Error('Pak Joko BizDash should wait for 5 transactions before photo verification');
}

const jokoBizReadyPhoto = renderToStaticMarkup(
  <screens.bizdash {...jokoIsolated} progress={{ stage1: true, stage2_tx: true }} />
);
if (!jokoBizReadyPhoto.includes('Verifikasi Tempel QRIS')) {
  throw new Error('Pak Joko BizDash missing active photo verification button after 5 tx');
}
// The bulky separate card was removed as requested
if (jokoBizReadyPhoto.includes('5/5 Transaksi Unik Selesai!')) {
  throw new Error('Bulky separate card should be removed from BizDash');
}

// Regression: Bu Ratna kupon 2x gratis transfer TIDAK muncul sebelum Pak Joko selesai Tahap 1
const ratnaBeforeStage1 = {
  ...ratna,
  s: {
    ...ratna.s,
    merchant: {
      ...ratna.s.merchant,
      firstPayment: 0,
    },
    referrals: [],
  },
  progress: {},
};
const ratnaRewardsBeforeStage1 = renderToStaticMarkup(<screens.rewards {...ratnaBeforeStage1} />);
if (ratnaRewardsBeforeStage1.includes('Gratis Transfer 2x')) {
  throw new Error('Bu Ratna should NOT see Gratis Transfer 2x before Pak Joko finishes Tahap 1');
}
if (!ratnaRewardsBeforeStage1.includes('Kupon Belum Tersedia')) {
  throw new Error('Bu Ratna missing Kupon Belum Tersedia placeholder before Tahap 1');
}

// Regression: JUARA ⭐ dan B2B REWARD tidak boleh muncul di profil DANA Bisnis siapapun
if (ratnaBiz.includes('JUARA') || ratnaBiz.includes('B2B REWARD')) {
  throw new Error('ratnaBiz should not contain JUARA or B2B REWARD badges');
}
if (jokoBizWaitingTx.includes('JUARA') || jokoBizWaitingTx.includes('B2B REWARD')) {
  throw new Error('jokoBizWaitingTx should not contain JUARA or B2B REWARD badges');
}
if (jokoBizReadyPhoto.includes('JUARA') || jokoBizReadyPhoto.includes('B2B REWARD')) {
  throw new Error('jokoBizReadyPhoto should not contain JUARA or B2B REWARD badges');
}

// Regression: Bu Ratna juga memiliki button "Panduan Toko" di profil DANA Bisnis
if (!ratnaBiz.includes('Panduan Toko')) {
  throw new Error('ratnaBiz must include Panduan Toko button');
}

// Regression: Keuntungan Mengajak Bisnis Lain & Banner PROGRAM MITRA BISNIS tidak boleh muncul di profil DANA Bisnis siapapun
if (ratnaBiz.includes('Keuntungan Mengajak Bisnis Lain') || ratnaBiz.includes('PROGRAM MITRA BISNIS')) {
  throw new Error('ratnaBiz should not contain Keuntungan Mengajak Bisnis Lain or PROGRAM MITRA BISNIS');
}
if (jokoBizWaitingTx.includes('Keuntungan Mengajak Bisnis Lain') || jokoBizWaitingTx.includes('PROGRAM MITRA BISNIS')) {
  throw new Error('jokoBizWaitingTx should not contain Keuntungan Mengajak Bisnis Lain or PROGRAM MITRA BISNIS');
}

// Regression: Differentiate 5-slide guide between DANA Bisnis owners (Bu Putu/Ratna & Pak Joko) vs consumer (Rian)
// Slide 1 (Index 0): Headline, Body, Box Uang Tunai, Box QRIS DANA Bisnis, Social Proof
const rianGuideSlide0 = renderToStaticMarkup(<screens.hub {...rian} />);
if (!rianGuideSlide0.includes('Bantu Warung Favoritmu Naik Kelas, Dapetin Saldo Rp 35 Ribu!') || !rianGuideSlide0.includes('Drama kembalian &amp; ribet cari uang pas')) {
  throw new Error('Rian guide slide 0 missing consumer perspective headline/body');
}
if (!rianGuideSlide0.includes('Bayar apa aja tinggal scan, simpel &amp; modern') || !rianGuideSlide0.includes('7 dari 10 orang sudah cashless')) {
  throw new Error('Rian guide slide 0 missing boxes or social proof');
}

const ratnaGuideSlide0 = renderToStaticMarkup(<screens.hub {...ratna} />);
if (!ratnaGuideSlide0.includes('Bantu Usaha Sekitarmu Naik Kelas, Bebas Biaya Operasional Toko!') || !ratnaGuideSlide0.includes('Drama kembalian &amp; ribet cari uang pas')) {
  throw new Error('Bu Ratna guide slide 0 missing merchant peer perspective');
}

// Slide 2 (Index 1): Reward slide differences (10x bebas biaya admin vs Saldo Rp35k)
const rianGuideReward = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={1} />);
if (!rianGuideReward.includes('Program Referral Merchant, dapatkan saldo hingga Rp 35 Ribu')) {
  throw new Error('Rian guide reward slide must contain Saldo DANA rewards headline');
}
if (rianGuideReward.includes('10x bebas biaya admin')) {
  throw new Error('Rian guide reward slide should not contain merchant kupon rewards');
}

const ratnaGuideReward = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={1} />);
if (!ratnaGuideReward.includes('10x bebas biaya admin')) {
  throw new Error('Bu Ratna guide reward slide must contain merchant kupon rewards headline');
}
if (ratnaGuideReward.includes('Saldo DANA hingga Rp 35 Ribu')) {
  throw new Error('Bu Ratna guide reward slide should not contain consumer saldo rewards');
}

const jokoGuideReward = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="referred" initialStep={1} />);
if (!jokoGuideReward.includes('10x bebas biaya admin')) {
  throw new Error('Pak Joko guide reward slide must contain merchant kupon rewards headline');
}

// Slide 3 (Index 2): Cukup bantu daftarin usaha kenalanmu, lewat hp tanpa babibuu
const guideSlide2 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={2} />);
if (!guideSlide2.includes('Cukup bantu daftarin usaha kenalanmu, lewat hp tanpa babibuu')) {
  throw new Error('Guide slide 2 missing headline');
}

// Slide 4 (Index 3): Bu Roro telah membantu 5 usaha menjadi dana bisnis, dan telah menghemat operasional hingga 50K!
const guideSlide3 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={3} />);
if (!guideSlide3.includes('Bu Roro telah membantu 5 usaha menjadi dana bisnis, dan telah menghemat operasional hingga 50K!')) {
  throw new Error('Guide slide 3 missing Bu Roro testimonial headline');
}

// Slide 5 (Index 4): Daftarkan usaha kenalanmu, hanya 1 menit!
const guideSlide4 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={4} />);
if (!guideSlide4.includes('Daftarkan usaha kenalanmu, hanya 1 menit!') || !guideSlide4.includes('Daftarkan Usaha Sekarang (1 Menit)')) {
  throw new Error('Guide slide 4 missing 1-minute CTA content');
}

console.log('compact reward cards & pak joko referal isolation: ok');
console.log('bu ratna clean referrals & transfer admin prompt: ok');
// Regression: Ensure NO MDR or 0% MDR is rendered across all key prototype screens
const allRenderedScreens = [
  jokoBizHtml,
  ratnaBizHtml,
  rianGuideSlide0,
  ratnaGuideSlide0,
  rianGuideReward,
  ratnaGuideReward,
  guideSlide2,
  guideSlide3,
  guideSlide4,
  renderToStaticMarkup(<screens.landing {...jokoQris} />),
  renderToStaticMarkup(<screens.bizprofile {...jokoQris} />),
  renderToStaticMarkup(<screens.inbox {...jokoQris} />),
].join(' ');

if (allRenderedScreens.includes('MDR') || allRenderedScreens.includes('0% MDR')) {
  throw new Error('Prototype should not mention MDR as benefit');
}
console.log('no MDR references across prototype screens: ok');



