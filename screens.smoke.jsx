import { renderToStaticMarkup } from 'react-dom/server';
import screens, { AffiliateCarouselGuide } from './src/screens.jsx';
import { QrisCashierVerificationModal } from './src/hostApp.jsx';

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
if (!ratnaHub.includes('Gratis transfer bank 2x') || !ratnaHub.includes('Gratis biaya admin 10x')) {
  throw new Error('ratnaHub must show merchant reward tiers');
}
if (ratnaHub.includes('Rian: Saldo') || ratnaHub.includes('Pak Joko: Gratis')) {
  throw new Error('ratnaHub should not show other persona tiers');
}
if (ratnaHub.includes('Benefit Warung:') || ratnaHub.includes('Kupon bebas biaya transfer &amp; bebas admin')) {
  throw new Error('ratnaHub should not contain Benefit Warung or business coupon footnote');
}

// Panduan juga harus tampil untuk track Mitra Bisnis, dengan reward kupon (bukan saldo),
// supaya langkah "selesaikan panduan" bisa diselesaikan di skenario 2.
const ratnaGuide = renderToStaticMarkup(<screens.hub {...ratna} />);
if (!ratnaGuide.includes('DANA SAHABAT WARUNG (1/4)')) throw new Error('Guide header missing DANA SAHABAT WARUNG (1/4)');
if (ratnaGuide.includes('PANDUAN REFERER')) throw new Error('Guide header still contains PANDUAN REFERER');
console.log('persona isolation: ok');

// Regression: panduan affiliate wajib hilang begitu penandanya tersimpan, kalau tidak
// tombol "Bantu Daftarkan Warung Sekarang!" terasa mati karena panduan terbuka ulang.
const rianAfterGuide = { ...rian, s: { ...rian.s, hasSeenAffiliateGuide: true } };
const hubAfterGuide = renderToStaticMarkup(<screens.hub {...rianAfterGuide} />);
if (hubAfterGuide.includes('DANA SAHABAT WARUNG (1/5)')) {
  throw new Error('Guide still covers the hub after hasSeenAffiliateGuide is set');
}
if (!hubAfterGuide.includes('Bantu Daftarkan Warung Langganan')) {
  throw new Error('Hub content missing after the guide is dismissed');
}
if (!hubAfterGuide.includes('Saldo DANA Rp5.000') || !hubAfterGuide.includes('Saldo DANA Rp30.000 (Total Rp35.000)')) {
  throw new Error('hubAfterGuide must show consumer reward tiers');
}
if (hubAfterGuide.includes('Bu Putu: Gratis') || hubAfterGuide.includes('Pak Joko: Gratis')) {
  throw new Error('hubAfterGuide should not show business persona tiers');
}
if (hubAfterGuide.includes('Benefit Warung:') || hubAfterGuide.includes('Kupon bebas biaya transfer &amp; bebas admin') || hubAfterGuide.includes('Reward Tahap 1 &amp; 2 otomatis masuk')) {
  throw new Error('hubAfterGuide should not contain Benefit Warung, business coupon footnote, or consumer footnote');
}
if (hubAfterGuide.includes('Panduan Affiliate')) {
  throw new Error('Hub should not contain Panduan Affiliate section');
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
if (ratnaBizHtml.includes('Bukti Nyata Rekan Usaha')) {
  throw new Error('Bu Putu (active Sahabat Dana) should NOT see Bukti Nyata Rekan Usaha');
}
if (ratnaBizHtml.includes('Progres Tahap Toko')) {
  throw new Error('Bu Putu should NOT see Progres Tahap Toko onboarding');
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

// Regression: Pak Joko can verify tempel QRIS even before 5 transactions
const jokoBizWaitingTx = renderToStaticMarkup(
  <screens.bizdash {...jokoIsolated} progress={{ stage1: true }} />
);
if (!jokoBizWaitingTx.includes('Verifikasi Tempel QRIS')) {
  throw new Error('Pak Joko BizDash should be able to verify tempel QRIS even before 5 transactions');
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

// Regression: Once Tahap 2 is done, everything disappears except Lihat Rincian Kupon Saya di Tab Reward
const jokoBizCompleted = renderToStaticMarkup(
  <screens.bizdash {...jokoIsolated} progress={{ stage1: true, stage2_tx: true, stage2_verify: true, stage2: true }} />
);
if (!jokoBizCompleted.includes('Lihat Rincian Kupon Saya di Tab Reward')) {
  throw new Error('Completed BizDash missing Lihat Rincian Kupon Saya di Tab Reward');
}
if (jokoBizCompleted.includes('Progres Tahap Toko') || jokoBizCompleted.includes('Verifikasi Tempel QRIS')) {
  throw new Error('Completed BizDash should hide progress stages and verification button');
}
if (jokoBizCompleted.includes('Bukti Nyata Rekan Usaha')) {
  throw new Error('Completed BizDash should hide Bukti Nyata Rekan Usaha after Tahap 2');
}

// Regression: Kalau belum 5x transaksi lalu selesai verifikasi foto, Tahap 2 belum selesai (masih nunggu 5x transaksi)
const jokoBizPhotoOnly = renderToStaticMarkup(
  <screens.bizdash {...jokoIsolated} progress={{ stage1: true, stage2_verify: true }} />
);
if (!jokoBizPhotoOnly.includes('Progres Tahap Toko')) {
  throw new Error('BizDash should still show progress stages when only photo is verified without 5 tx');
}
if (!jokoBizPhotoOnly.includes('2/3 Tahap Selesai')) {
  throw new Error('BizDash should show 2/3 Tahap Selesai when 10k & photo are done but 5 tx is not');
}
if (!jokoBizPhotoOnly.includes('Tempel QRIS Terverifikasi · Menunggu 5 Transaksi')) {
  throw new Error('BizDash should show Tempel QRIS Terverifikasi · Menunggu 5 Transaksi');
}
if (!jokoBizPhotoOnly.includes('Bukti Nyata Rekan Usaha')) {
  throw new Error('BizDash should still show Bukti Nyata Rekan Usaha when Tahap 2 is not completed');
}

// Regression: Modal verifikasi checklist & button berbeda jika belum 5 transaksi vs sudah 5 transaksi
const modalWaitingTxHtml = renderToStaticMarkup(
  <QrisCashierVerificationModal isOpen has5Tx={false} txCount={1} />
);
if (!modalWaitingTxHtml.includes('Menunggu 5 transaksi') || !modalWaitingTxHtml.includes('Konfirmasi Verifikasi Tempel QRIS ✓')) {
  throw new Error('Modal with < 5 tx missing waiting status or confirmation text');
}

const modalReadyTxHtml = renderToStaticMarkup(
  <QrisCashierVerificationModal isOpen has5Tx={true} txCount={5} />
);
if (!modalReadyTxHtml.includes('5 / 5 Unik ✓') || !modalReadyTxHtml.includes('Konfirmasi &amp; Klaim Reward Tahap 2 ✓')) {
  throw new Error('Modal with 5 tx missing 5/5 unik or claim button');
}

// Regression: Rewards screen also must NOT consider Tahap 2 done if only photo is verified
const rianPhotoOnlyRewards = renderToStaticMarkup(
  <screens.rewards {...rian} progress={{ stage1: true, stage2_verify: true }} />
);
if (rianPhotoOnlyRewards.includes('Reward Tahap 2 : Warung Sembako Pak Joko')) {
  throw new Error('Rian rewards should NOT consider Tahap 2 done when only photo is verified');
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
if (ratnaRewardsBeforeStage1.includes('Kupon Belum Tersedia') || ratnaRewardsBeforeStage1.includes('Kupon 2x Gratis Transfer akan aktif otomatis')) {
  throw new Error('Bu Ratna should NOT see Kupon Belum Tersedia placeholder when no rewards have been earned');
}

// Regression: Bu Putu BizDash tidak boleh menampilkan card kupon / 0/3 Tahap Selesai sebelum punya reward
const ratnaBizBeforeStage1 = renderToStaticMarkup(<screens.bizdash {...ratnaBeforeStage1} />);
if (ratnaBizBeforeStage1.includes('Lihat Rincian Kupon Saya di Tab Reward') || ratnaBizBeforeStage1.includes('0/3 Tahap Selesai')) {
  throw new Error('Bu Putu BizDash should NOT show coupon banner or 0/3 Tahap Selesai before she has earned rewards');
}

// Setelah Tahap 1 selesai, barulah card kupon Bu Putu muncul di BizDash
const ratnaBizAfterStage1 = renderToStaticMarkup(<screens.bizdash {...ratnaBeforeStage1} progress={{ stage1: true }} />);
if (!ratnaBizAfterStage1.includes('Lihat Rincian Kupon Saya di Tab Reward') || !ratnaBizAfterStage1.includes('Kupon Gratis Transfer 2x Aktif')) {
  throw new Error('Bu Putu BizDash missing coupon banner after Tahap 1');
}
if (ratnaBizAfterStage1.includes('0/3 Tahap Selesai') || ratnaBizAfterStage1.includes('Progres Tahap Toko')) {
  throw new Error('Bu Putu BizDash should NOT leak Pak Joko onboarding stages');
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
if (rianGuideSlide0.includes('Box Uang Tunai') || rianGuideSlide0.includes('Box QRIS Dana Bisnis')) {
  throw new Error('Rian guide slide 0 should not contain "Box Uang Tunai" or "Box QRIS Dana Bisnis" prefix');
}
if (!rianGuideSlide0.includes('Uang Tunai') || !rianGuideSlide0.includes('QRIS Dana Bisnis')) {
  throw new Error('Rian guide slide 0 missing "Uang Tunai" or "QRIS Dana Bisnis"');
}
if (!rianGuideSlide0.includes('DANA SAHABAT WARUNG')) {
  throw new Error('Rian guide slide 0 missing DANA SAHABAT WARUNG tag');
}

// Slide 2 (Index 1): Reward slide (Saldo Rp35k untuk Rian)
const rianGuideReward = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={1} />);
if (!rianGuideReward.includes('Program Referral Merchant, dapatkan saldo hingga Rp 35 Ribu')) {
  throw new Error('Rian guide reward slide must contain Saldo DANA rewards headline');
}
if (rianGuideReward.includes('10x bebas biaya admin')) {
  throw new Error('Rian guide reward slide should not contain merchant kupon rewards');
}

// Slide 3 (Index 2): Cukup bantu daftarin warung favoritmu, lewat hp tanpa babibuu
const guideSlide2 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={2} />);
if (!guideSlide2.includes('Cukup bantu daftarin warung favoritmu, lewat hp tanpa babibuu')) {
  throw new Error('Guide slide 2 missing headline');
}
if (!guideSlide2.includes('Warung Favoritmu')) {
  throw new Error('Guide slide 2 missing Warung Favoritmu badge');
}
if (guideSlide2.includes('usaha kenalanmu') || guideSlide2.includes('Sahabat Dana')) {
  throw new Error('Guide slide 2 should not contain "usaha kenalanmu" or "Sahabat Dana"');
}

// Slide 4 (Index 3): Ka Adit telah membantu 5 warung menjadi Sahabat Dana, dan udah dapetin saldo Dana >100K!
const guideSlide3 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={3} />);
if (!guideSlide3.includes('Ka Adit telah membantu 5 warung menjadi Sahabat Dana') || !guideSlide3.includes('100K!')) {
  throw new Error('Guide slide 3 missing Ka Adit testimonial headline');
}
if (guideSlide3.includes('Bu Roro')) {
  throw new Error('Guide slide 3 should not contain Bu Roro');
}

// Slide 5 (Index 4): Daftarkan warung favoritmu, hanya 1 menit!
const guideSlide4 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={4} />);
if (!guideSlide4.includes('Daftarkan warung favoritmu, hanya 1 menit!') || !guideSlide4.includes('Daftarkan Warung Favoritmu Sekarang')) {
  throw new Error('Guide slide 4 missing 1-minute CTA content');
}
if (guideSlide4.includes('usaha kenalanmu') || guideSlide4.includes('Sahabat Dana')) {
  throw new Error('Guide slide 4 should not contain "usaha kenalanmu" or "Sahabat Dana"');
}

// Business Owner Guide checks (Bu Putu / Pak Joko: role="merchant" or role="referred")
// Slide 1: Headline, body, Uang Tunai, QRIS Dana Bisnis, Quote
const bizGuideSlide0 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={0} />);
if (!bizGuideSlide0.includes('Bantu Usaha Sekitarmu Lebih Maju, Nikmati Gratis Biaya Admin hingga 10 Transaksi!')) {
  throw new Error('Biz guide slide 0 missing business headline');
}
if (!bizGuideSlide0.includes('Sangat mengecewakan saat pelanggan ingin belanja namun harus batal')) {
  throw new Error('Biz guide slide 0 missing business body');
}
if (!bizGuideSlide0.includes('Repot menyiapkan uang kembalian &amp; risiko uang palsu')) {
  throw new Error('Biz guide slide 0 missing Uang Tunai text');
}
if (!bizGuideSlide0.includes('Terima pembayaran mudah, tinggal scan, praktis.')) {
  throw new Error('Biz guide slide 0 missing QRIS text');
}
if (!bizGuideSlide0.includes('Kini banyak pelanggan lebih suka membayar non-tunai. Mari bersama-sama memajukan usaha di lingkungan kita!')) {
  throw new Error('Biz guide slide 0 missing quote');
}
if (!bizGuideSlide0.includes('DANA SAHABAT WARUNG (1/4)')) {
  throw new Error('Biz guide slide 0 missing (1/4) indicator');
}

// Slide 2 for Biz Owner (Index 1 of 4: Slide 3 in consumer)
const bizGuideSlide1 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={1} />);
if (!bizGuideSlide1.includes('Cukup bantu daftarin usaha sekitarmu, lewat hp tanpa ribet')) {
  throw new Error('Biz guide slide 1 missing headline');
}
if (!bizGuideSlide1.includes('Usaha Sekitarmu')) {
  throw new Error('Biz guide slide 1 missing Usaha Sekitarmu badge');
}
if (bizGuideSlide1.includes('babibuu') || bizGuideSlide1.includes('kenalanmu')) {
  throw new Error('Biz guide slide 1 should not contain "babibuu" or "kenalanmu"');
}

// Slide 3 for Biz Owner (Index 2 of 4: Slide 4 in consumer)
const bizGuideSlide2 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={2} />);
if (!bizGuideSlide2.includes('Ka Adit telah membantu 5 usaha menjadi Sahabat Dana, dan telah menghemat operasional hingga 100K!')) {
  throw new Error('Biz guide slide 2 missing Ka Adit testimonial headline');
}

// Slide 4 for Biz Owner (Index 3 of 4: Slide 5 in consumer)
const bizGuideSlide3 = renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="merchant" initialStep={3} />);
if (!bizGuideSlide3.includes('Daftarkan usaha sekitarmu, hanya 1 menit!')) {
  throw new Error('Biz guide slide 3 missing headline');
}
if (!bizGuideSlide3.includes('Daftarkan Warung Favoritmu Sekarang')) {
  throw new Error('Biz guide slide 3 missing CTA button');
}
if (bizGuideSlide3.includes('kenalanmu')) {
  throw new Error('Biz guide slide 3 should not contain "kenalanmu"');
}

console.log('compact reward cards & pak joko referal isolation: ok');
console.log('bu ratna clean referrals & transfer admin prompt: ok');
// Regression: Ensure NO MDR or 0% MDR is rendered across all key prototype screens
const allRenderedScreens = [
  jokoBizHtml,
  ratnaBizHtml,
  rianGuideSlide0,
  rianGuideReward,
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

// Regression: Verify program name DANA Sahabat Warung and merchant designation Sahabat DANA
if (!hubAfterGuide.includes('DANA Sahabat Warung')) {
  throw new Error('Hub screen must have title DANA Sahabat Warung');
}
if (!ratnaBiz.includes('Sahabat DANA')) {
  throw new Error('BizDash must indicate registered merchant status as Sahabat DANA');
}
console.log('DANA Sahabat Warung & Sahabat DANA naming: ok');



