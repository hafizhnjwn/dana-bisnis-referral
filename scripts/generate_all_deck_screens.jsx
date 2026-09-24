import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import screens, { AffiliateCarouselGuide } from '../src/screens.jsx';

const base = {
  s: {
    role: 'consumer',
    screen: 'home',
    balances: { consumer: 152300, merchant: 96500, referred: 12000 },
    inviter: 'Rian Prasetya',
    referrals: [
      { id: 1, name: 'Warung Nasi Bu Siti', category: 'F&B / Warung Makan', phone: '0812-3344-5566', stage: 0, claimedStage: 0, tx: 0, day: 'Hari ini' },
      { id: 2, name: 'Toko Kelontong Berkah', category: 'Toko Kelontong', phone: '0812-7788-9900', stage: 1, claimedStage: 0, tx: 1, day: 'Kemarin' },
      { id: 3, name: 'Warung Sembako Pak Joko', category: 'Toko Kelontong', phone: '0812-4409-8822', stage: 2, claimedStage: 0, tx: 5, day: '3 hari lalu' },
    ],
    merchant: {
      name: 'Warung Sembako Pak Joko',
      category: 'Toko Kelontong',
      location: 'Jl. Tebet Barat Dalam VIII No.12, Jakarta Selatan',
      issued: true,
      testScan: true,
      firstPayment: 15000,
      modalBonus: 15000,
    },
    nominatedId: 1,
    soundbox: null,
    toast: null,
    hasSeenAffiliateGuide: true,
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
  earned: 35000,
  activeCount: 1,
  claimable: {
    rows: [{ merchant: 'Warung Sembako Pak Joko', label: 'Tahap 2 Selesai', amount: 30000, type: 'saldo' }],
    saldo: 30000,
    voucher: 0,
    total: 30000,
  },
};

const asRole = (id, name, initial, store, balance) => ({
  ...base,
  s: { ...base.s, role: id },
  user: { id, name, initial, store, balance },
});

const rian = asRole('consumer', 'Rian Prasetya', 'R', null, 152300);
const putu = asRole('merchant', 'Putu Dewi', 'P', 'Toko Grosir Bu Putu', 96500);
const joko = asRole('referred', 'Joko Santoso', 'J', 'Warung Sembako Pak Joko', 15000);
const jokoCheckpoint = {
  ...joko,
  s: {
    ...joko.s,
    role: 'referred',
    referrals: [],
    hasSeenBizGuide: true,
  },
  progress: { stage1: true, biz_guide: true },
};

// Read compiled CSS
const cssDir = path.resolve('dist/assets');
const cssFile = fs.readdirSync(cssDir).find((f) => f.startsWith('index-') && f.endsWith('.css'));
const cssContent = fs.readFileSync(path.join(cssDir, cssFile), 'utf8');

function wrapHtml(content, bg = '#f8fafc') {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=375, height=812, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    ${cssContent}
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 375px;
      height: 812px;
      overflow: hidden;
      background: ${bg};
      font-family: 'Open Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    #phone-container {
      width: 375px;
      height: 812px;
      position: relative;
      overflow: hidden;
      background: ${bg};
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="phone-container">
    ${content}
  </div>
</body>
</html>`;
}

const outDir = '/tmp/dana_deck_htmls';
fs.mkdirSync(outDir, { recursive: true });

const list = [
  // 3.1 Discovery & Understanding
  { id: '3_1_1_dana_home', html: wrapHtml(renderToStaticMarkup(<screens.home {...rian} />)) },
  { id: '3_1_2_guide_slide1', html: wrapHtml(renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={0} />), '#0D5995') },
  { id: '3_1_3_guide_slide2', html: wrapHtml(renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={1} />), '#0D5995') },
  { id: '3_1_4_guide_slide3', html: wrapHtml(renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={2} />), '#0D5995') },
  { id: '3_1_5_guide_slide4', html: wrapHtml(renderToStaticMarkup(<AffiliateCarouselGuide isOpen role="consumer" initialStep={3} />), '#0D5995') },
  { id: '3_1_6_hub_beranda', html: wrapHtml(renderToStaticMarkup(<screens.hub {...rian} s={{ ...rian.s, hasSeenAffiliateGuide: true }} />)) },
  { id: '3_1_7_discovery_transfer_bca', html: wrapHtml(renderToStaticMarkup(<screens.transfer {...putu} />)) },
  { id: '3_1_8_discovery_biz_profile', html: wrapHtml(renderToStaticMarkup(<screens.bizdash {...putu} />)) },

  // 3.2 Referral Experience
  { id: '3_2_1_hub_nominate_cta', html: wrapHtml(renderToStaticMarkup(<screens.hub {...rian} s={{ ...rian.s, hasSeenAffiliateGuide: true }} />)) },
  { id: '3_2_2_nominate_form', html: wrapHtml(renderToStaticMarkup(<screens.nominate {...rian} />)) },
  { id: '3_2_3_tracker_status', html: wrapHtml(renderToStaticMarkup(<screens.tracker {...rian} />)) },

  // 3.3 Reward Experience
  { id: '3_3_1_reward_consumer', html: wrapHtml(renderToStaticMarkup(<screens.rewards {...rian} />)) },
  { id: '3_3_2_reward_merchant', html: wrapHtml(renderToStaticMarkup(<screens.rewards {...putu} />)) },
  {
    id: '3_3_3_bizprofile_milestone',
    html: wrapHtml(
      renderToStaticMarkup(
        <screens.bizprofile
          {...joko}
          initialTour={false}
          progress={{ biz_guide: true, stage2: true }}
          s={{ ...joko.s, hasSeenBizGuide: true }}
        />
      )
    ),
  },
  { id: '3_3_4_inbox_notifications', html: wrapHtml(renderToStaticMarkup(<screens.inbox {...rian} />)) },
  { id: '3_3_5_reward_joko', html: wrapHtml(renderToStaticMarkup(<screens.rewards {...joko} />)) },
  { id: '3_3_6_bizprofile_checkpoint_progres', html: wrapHtml(renderToStaticMarkup(<screens.bizdash {...jokoCheckpoint} />)) },

  // 3.4 Referred Merchant Experience
  { id: '3_4_0_whatsapp_invite_joko', html: wrapHtml(renderToStaticMarkup(<screens.whatsapp_invite />), '#ECE5DD') },
  { id: '3_4_1_merchant_landing', html: wrapHtml(renderToStaticMarkup(<screens.landing {...joko} inviter="Rian Prasetya" />)) },
  { id: '3_4_2_merchant_register', html: wrapHtml(renderToStaticMarkup(<screens.register {...joko} />)) },
  { id: '3_4_3_merchant_qris_active', html: wrapHtml(renderToStaticMarkup(<screens.qris {...joko} />)) },
  { id: '3_4_4_merchant_bizdash', html: wrapHtml(renderToStaticMarkup(<screens.bizdash {...jokoCheckpoint} />)) },
  { id: '3_4_5_merchant_progres_tahap_toko', html: wrapHtml(renderToStaticMarkup(<screens.bizdash {...jokoCheckpoint} />)) },
];

for (const item of list) {
  fs.writeFileSync(path.join(outDir, `${item.id}.html`), item.html);
}

console.log(`Generated ${list.length} phone HTML pages in ${outDir}`);
