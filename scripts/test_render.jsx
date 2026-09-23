import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs';
import path from 'node:path';
import screens, { AffiliateCarouselGuide } from '../src/screens.jsx';

const base = {
  s: {
    role: 'consumer',
    screen: 'home',
    balances: { consumer: 152300, merchant: 96500, referred: 0 },
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
    rows: [{ merchant: 'Warung Sembako Pak Joko', label: 'Tahap 2', amount: 30000, type: 'saldo' }],
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

// Read compiled CSS
const cssPath = path.resolve('dist/assets/index-CQk5C1vz.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

function wrapHtml(content) {
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
      background: #000;
      font-family: 'Open Sans', system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    #phone-container {
      width: 375px;
      height: 812px;
      position: relative;
      overflow: hidden;
      background: #f8fafc;
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

const html = wrapHtml(renderToStaticMarkup(<screens.home {...rian} />));
fs.writeFileSync('/tmp/test_phone.html', html);
console.log('HTML generated successfully');
