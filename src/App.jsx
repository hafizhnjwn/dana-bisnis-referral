import { useMemo, useRef, useState } from 'react';
import { activeMerchants, claimAll, claimBreakdown, paidTotal, rupiah } from './rewards.js';
import screens, { WHATSAPP_NOTIFICATIONS, WhatsAppChatModal } from './screens.jsx';
import { Icon } from './ui.jsx';

/**
 * One identity per role.
 */
const ROLES = [
  {
    id: 'consumer',
    label: 'Rian — Konsumen DANA',
    hint: 'Track A · Sahabat Warung (C2B)',
    entry: 'home',
    name: 'Rian Prasetya',
    initial: 'R',
    store: null,
    balance: 152300,
  },
  {
    id: 'merchant',
    label: 'Bu Ratna — DANA Bisnis',
    hint: 'Track B · Mitra Bisnis (B2B)',
    entry: 'bizdash',
    name: 'Ratna Dewi',
    initial: 'R',
    store: 'Martabak Bu Ratna',
    balance: 96500,
  },
  {
    id: 'referred',
    label: 'Pak Joko — Warung Diundang',
    hint: 'Prospek: KYC Light, QRIS instan & Profil Bisnis',
    entry: 'landing',
    name: 'Joko Santoso',
    initial: 'J',
    store: 'Warung Nasi Pak Joko',
    balance: 0,
  },
];

const roleOf = (id) => ROLES.find((r) => r.id === id);

const SCENARIOS = [
  {
    id: 'rian_joko',
    title: 'Skenario 1: Rian (Konsumen) ➔ Pak Joko (Warung)',
    tag: 'Track A · Sahabat Warung (C2B)',
    badgeColor: 'bg-dana-500 text-white',
    summary: 'Rian bantu daftarkan warung nasi langganan. Reward: Saldo DANA Rp10k (Tahap 1) + Rp30k (Tahap 2).',
    role1: 'consumer',
    role2: 'referred',
  },
  {
    id: 'ratna_joko',
    title: 'Skenario 2: Bu Ratna (Merchant) ➔ Pak Joko (Warung)',
    tag: 'Track B · Mitra Bisnis (B2B)',
    badgeColor: 'bg-emerald-600 text-white',
    summary: 'Bu Ratna (Martabak Bu Ratna) mengajak warung sebelah. Reward: Bebas Transfer 10x (Tahap 1) + Bebas Admin 10x (Tahap 2).',
    role1: 'merchant',
    role2: 'referred',
  },
];

const SEED_REFERRALS = [
  {
    id: 0,
    name: 'Warung Nasi Pak Joko',
    category: 'F&B / Warung Makan',
    phone: '0812••••4409',
    stage: 0,
    claimedStage: 0,
    tx: 0,
    day: 'Undangan terkirim hari ini',
  },
  {
    id: 1,
    name: 'Warung Soto Barokah',
    category: 'F&B / Warung Makan',
    phone: '0812••••1121',
    stage: 2,
    claimedStage: 2,
    tx: 8,
    day: 'Tahap 2 lolos audit validasi',
  },
  {
    id: 2,
    name: 'Toko Kelontong Jaya',
    category: 'Toko Kelontong',
    phone: '0857••••7788',
    stage: 2,
    claimedStage: 2,
    tx: 41,
    day: 'Tahap 2 lolos audit validasi',
  },
  {
    id: 3,
    name: 'Kopi Pak Rudi',
    category: 'F&B / Warung Makan',
    phone: '0813••••2210',
    stage: 1,
    claimedStage: 1,
    tx: 1,
    day: 'Tahap 1 selesai · Menunggu 5 tx',
  },
  {
    id: 4,
    name: 'Bengkel Motor Jaya Abadi',
    category: 'Jasa / Bengkel',
    phone: '0898••••3345',
    stage: 2,
    claimedStage: 2,
    tx: 96,
    day: 'Tahap 2 lolos audit validasi',
  },
  {
    id: 5,
    name: 'Kedai Es Teh Mbak Sri',
    category: 'F&B / Warung Makan',
    phone: '0821••••9901',
    stage: 1,
    claimedStage: 0,
    tx: 0,
    day: 'QRIS aktif · Menunggu transaksi',
  },
];

/** Simulasi "Nada DANA": dua nada pendek lewat Web Audio, tanpa aset suara. */
function playChime() {
  try {
    const Ctx = window.AudioContext ?? window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    [880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02 + i * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22 + i * 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + 0.3 + i * 0.16);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {
    /* Audio diblokir browser: prototipe tetap jalan, hanya tanpa suara. */
  }
}

export default function App() {
  // Scenario state: 'rian_joko' | 'ratna_joko'
  const [scenario, setScenario] = useState('rian_joko');

  // Shared application state
  const [referrals, setReferrals] = useState(() => SEED_REFERRALS.map((r) => ({ ...r })));
  const [balances, setBalances] = useState(() => Object.fromEntries(ROLES.map((r) => [r.id, r.balance])));
  const [rewardQuotas, setRewardQuotas] = useState({
    merchant: { transfer: 10, admin: 10 },
    referred: { withdraw: 7, admin: 10 },
  });
  const [merchant, setMerchant] = useState({
    name: 'Warung Nasi Pak Joko',
    category: 'F&B / Warung Makan',
    location: 'Jakarta Selatan',
    issued: false,
    testScan: false,
    firstPayment: 0,
    modalBonus: 0,
  });

  // Phone 1 (Pengundang: Rian / Bu Ratna) State
  const activeRole1 = scenario === 'rian_joko' ? 'consumer' : 'merchant';
  const [screen1, setScreen1] = useState(scenario === 'rian_joko' ? 'home' : 'bizdash');
  const [toast1, setToast1] = useState(null);
  const [soundbox1, setSoundbox1] = useState(null);
  const [whatsappPush1, setWhatsappPush1] = useState(null);
  const [activeWhatsAppChat1, setActiveWhatsAppChat1] = useState(null);
  const toastTimer1 = useRef(0);
  const soundboxTimer1 = useRef(0);

  // Phone 2 (Penerima: Pak Joko) State
  const [screen2, setScreen2] = useState('landing');
  const [toast2, setToast2] = useState(null);
  const [soundbox2, setSoundbox2] = useState(null);
  const [whatsappPush2, setWhatsappPush2] = useState(null);
  const [activeWhatsAppChat2, setActiveWhatsAppChat2] = useState(null);
  const toastTimer2 = useRef(0);
  const soundboxTimer2 = useRef(0);

  const notify1 = (msg) => {
    clearTimeout(toastTimer1.current);
    setToast1(msg);
    toastTimer1.current = setTimeout(() => setToast1(null), 3800);
  };

  const notify2 = (msg) => {
    clearTimeout(toastTimer2.current);
    setToast2(msg);
    toastTimer2.current = setTimeout(() => setToast2(null), 3800);
  };

  const announce1 = (amount) => {
    playChime();
    clearTimeout(soundboxTimer1.current);
    setSoundbox1(amount);
    soundboxTimer1.current = setTimeout(() => setSoundbox1(null), 4200);
  };

  const announce2 = (amount) => {
    playChime();
    clearTimeout(soundboxTimer2.current);
    setSoundbox2(amount);
    soundboxTimer2.current = setTimeout(() => setSoundbox2(null), 4200);
  };

  const user1 = { ...roleOf(activeRole1), balance: balances[activeRole1] };
  const user2 = { ...roleOf('referred'), balance: balances.referred, store: merchant.name };

  const handleSwitchScenario = (scId) => {
    setScenario(scId);
    setScreen1(scId === 'rian_joko' ? 'home' : 'bizdash');
    setScreen2(merchant.issued ? 'bizdash' : 'landing');
    setWhatsappPush1(null);
    setWhatsappPush2(null);
    setActiveWhatsAppChat1(null);
    setActiveWhatsAppChat2(null);
    const label = scId === 'rian_joko' ? 'Skenario 1 (Rian ➔ Pak Joko)' : 'Skenario 2 (Bu Ratna ➔ Pak Joko)';
    notify1(`Beralih ke ${label}`);
  };

  const handleReset = () => {
    clearTimeout(toastTimer1.current);
    clearTimeout(toastTimer2.current);
    clearTimeout(soundboxTimer1.current);
    clearTimeout(soundboxTimer2.current);
    setToast1(null);
    setToast2(null);
    setSoundbox1(null);
    setSoundbox2(null);
    setWhatsappPush1(null);
    setWhatsappPush2(null);
    setActiveWhatsAppChat1(null);
    setActiveWhatsAppChat2(null);
    setReferrals(SEED_REFERRALS.map((r) => ({ ...r })));
    setBalances(Object.fromEntries(ROLES.map((r) => [r.id, r.balance])));
    setRewardQuotas({
      merchant: { transfer: 10, admin: 10 },
      referred: { withdraw: 7, admin: 10 },
    });
    setMerchant({
      name: 'Warung Nasi Pak Joko',
      category: 'F&B / Warung Makan',
      location: 'Jakarta Selatan',
      issued: false,
      testScan: false,
      firstPayment: 0,
      modalBonus: 0,
    });
    setScreen1(scenario === 'rian_joko' ? 'home' : 'bizdash');
    setScreen2('landing');
    notify1('Data prototipe berhasil di-reset.');
  };

  // Cross-phone interactive actions
  const actions = {
    /** Phone 1: Referrer pre-fills 3 fields -> sends WhatsApp invitation to Phone 2 */
    nominate: ({ name, category, phone }) => {
      const id = Date.now();
      const warungName = name || 'Warung Nasi Pak Joko';
      setMerchant((m) => ({
        ...m,
        name: warungName,
        category: category || 'F&B / Warung Makan',
        issued: false,
        testScan: false,
        firstPayment: 0,
        modalBonus: 0,
      }));
      setReferrals((prev) => [
        {
          id,
          name: warungName,
          category: category || 'F&B / Warung Makan',
          phone: phone || '0812••••4409',
          stage: 0,
          claimedStage: 0,
          tx: 0,
          day: 'Undangan baru terkirim',
        },
        ...prev.filter((r) => r.id !== 0),
      ]);
      setScreen1('tracker');
      notify1(`Undangan pendaftaran terkirim ke ${warungName} via WhatsApp.`);

      // Trigger instant real-time WhatsApp invitation on Phone 2 (Pak Joko)
      const inviteNotif = {
        id: 'wa-invite-joko',
        recipient: 'Pak Joko',
        roleTarget: 'referred',
        sender: user1.name,
        phone: phone || '0812-4409-xxxx',
        time: 'Baru saja',
        tag: 'Undangan Warung',
        title: 'Undangan Bergabung DANA Bisnis',
        preview: `Halo Pak Joko! ${user1.name} sudah bantu daftarkan ${warungName} ke DANA Bisnis. QRIS langsung aktif Rp0...`,
        message: `Halo Pak Joko! 🏪\n\nSaya (${user1.name}) sudah bantu daftarkan *${warungName}* agar bisa terima pembayaran digital QRIS dari semua bank & e-wallet tanpa biaya potongan (0% MDR).\n\nData sudah disiapkan, tinggal 1 langkah konfirmasi:\n👉 https://dana.id/bisnis/gabung?ref=HAF58W\n\nPajang QRIS di meja kasir, jualan makin laris & praktis!`,
        actionText: 'Buka Undangan Pendaftaran',
        targetScreen: 'landing',
      };
      setWhatsappPush2(inviteNotif);
    },

    /** Phone 2: Pak Joko completes KYC Light -> QRIS is issued & Phone 1 updates in real-time */
    issueQris: ({ name, category, location }) => {
      const storeName = name || merchant.name;
      setMerchant((m) => ({
        ...m,
        name: storeName,
        category: category || m.category,
        location: location || m.location,
        issued: true,
      }));
      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, stage: 1, name: storeName, day: 'QRIS aktif · Menunggu transaksi' }
            : r
        )
      );
      setScreen2('qris');
      notify2('QRIS Nasional aktif seketika (KYC Light Rp0). Siap menerima pembayaran digital!');
      notify1(`🎉 ${storeName} berhasil menerbitkan QRIS! Menunggu transaksi pertama.`);
    },

    testScan: () => {
      setMerchant((m) => ({ ...m, testScan: true }));
      announce2(1000);
      notify2('Transaksi uji Rp1.000 masuk. Nada DANA berbunyi!');
    },

    /** Pelanggan bayar ke QRIS Pak Joko: Tahap 1 Reward aktif */
    receivePayment: (amount = 15000) => {
      const qualifies = amount >= 10000;
      setMerchant((m) => ({ ...m, firstPayment: amount, modalBonus: 15000 }));
      announce2(amount);

      setBalances((prev) => ({
        ...prev,
        referred: prev.referred + amount + (qualifies ? 15000 : 0),
        consumer: prev.consumer + (scenario === 'rian_joko' && qualifies ? 10000 : 0),
      }));

      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, stage: 1, claimedStage: 1, tx: (r.tx || 0) + 1, day: 'Tahap 1 selesai · Menuju 5 tx' }
            : r
        )
      );

      notify2(`🎉 Pembayaran ${rupiah(amount)} diterima! Bonus Modal Usaha Rp15.000 masuk ke saldo tokomu.`);
      if (scenario === 'rian_joko') {
        notify1(`🎉 Warung Pak Joko transaksi pertama! Reward Tahap 1 (Rp10.000) cair ke Saldo DANA.`);
      } else {
        notify1(`🎉 Warung Pak Joko transaksi pertama! Kupon Gratis Transfer 10x aktif di tab Reward.`);
      }
    },

    /** Tahap 2: 5 transaksi unik tercapai & lolos audit validasi */
    completeStage2: () => {
      playChime();
      setBalances((prev) => ({
        ...prev,
        consumer: prev.consumer + (scenario === 'rian_joko' ? 30000 : 0),
      }));

      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, stage: 2, claimedStage: 2, tx: 5, day: 'Tahap 2 lolos audit validasi' }
            : r
        )
      );

      notify2('🎉 Tokomu resmi memenuhi target 5 transaksi unik! Status toko naik menjadi Merchant Juara.');
      if (scenario === 'rian_joko') {
        notify1(`🎉 Target 5 transaksi warung binaan tercapai! Reward Tahap 2 (Rp30.000) cair ke Saldo DANA.`);
      } else {
        notify1(`🎉 Target 5 transaksi warung binaan tercapai! Kupon Bebas Biaya Admin 10x aktif di tab Reward.`);
      }
    },

    triggerWhatsApp: (id) => {
      const notif = WHATSAPP_NOTIFICATIONS.find((n) => n.id === id) || WHATSAPP_NOTIFICATIONS[0];
      if (notif.roleTarget === 'referred') {
        setWhatsappPush2(notif);
        notify2('💬 Notifikasi WhatsApp DANA Bisnis masuk ke HP Pak Joko.');
      } else {
        setWhatsappPush1(notif);
        notify1('💬 Notifikasi WhatsApp DANA Bisnis masuk ke HP Pengundang.');
      }
    },

    claim1: () => {
      const { saldo, total } = claimBreakdown(referrals);
      if (!total) return notify1('Semua reward telah otomatis masuk ke akun Anda.');
      setBalances((prev) => ({ ...prev, [activeRole1]: prev[activeRole1] + saldo }));
      setReferrals(claimAll(referrals));
      playChime();
      notify1(`${rupiah(saldo)} masuk ke Saldo DANA seketika.`);
    },

    claim2: () => {
      notify2('Reward kupon tarik tunai & modal usaha Pak Joko otomatis aktif di akun DANA Bisnis.');
    },
  };

  const sharedCtx = {
    referrals,
    rewardQuotas,
    merchant,
    patch: (fnOrObj) => {
      if (typeof fnOrObj === 'function') {
        const res = fnOrObj({ referrals, rewardQuotas, merchant, balances });
        if (res.rewardQuotas) setRewardQuotas(res.rewardQuotas);
        if (res.referrals) setReferrals(res.referrals);
        if (res.balances) setBalances(res.balances);
        if (res.merchant) setMerchant(res.merchant);
      } else {
        if (fnOrObj.rewardQuotas) setRewardQuotas(fnOrObj.rewardQuotas);
        if (fnOrObj.referrals) setReferrals(fnOrObj.referrals);
        if (fnOrObj.balances) setBalances(fnOrObj.balances);
        if (fnOrObj.merchant) setMerchant(fnOrObj.merchant);
      }
    },
  };

  // Phone 1 context
  const ctx1 = {
    ...sharedCtx,
    s: {
      role: activeRole1,
      screen: screen1,
      referrals,
      rewardQuotas,
      merchant,
      balances,
    },
    user: user1,
    go: (scr) => setScreen1(scr),
    notify: notify1,
    announce: announce1,
    nominate: actions.nominate,
    claim: actions.claim1,
    inviter: user1.name,
    earned: paidTotal(referrals),
    activeCount: activeMerchants(referrals),
    claimable: claimBreakdown(referrals),
  };

  // Phone 2 context
  const ctx2 = {
    ...sharedCtx,
    s: {
      role: 'referred',
      screen: screen2,
      referrals,
      rewardQuotas,
      merchant,
      balances,
    },
    user: user2,
    go: (scr) => setScreen2(scr),
    notify: notify2,
    announce: announce2,
    issueQris: actions.issueQris,
    testScan: actions.testScan,
    receivePayment: actions.receivePayment,
    claim: actions.claim2,
    inviter: user1.name,
    earned: paidTotal(referrals),
    activeCount: activeMerchants(referrals),
    claimable: claimBreakdown(referrals),
  };

  const Screen1 = screens[screen1] ?? screens.home;
  const Screen2 = screens[screen2] ?? screens.landing;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-3 py-5 sm:px-6">
      {/* Top Header & Interactive Scenario Bar */}
      <div className="mx-auto max-w-7xl flex flex-col gap-4">
        {/* Top bar title & reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-dana-500 font-black text-white text-base shadow-lg shadow-dana-500/30">
              D
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-dana-400 uppercase">
                  AFFILIATE DANA BISNIS · DUAL-PHONE LIVE DEMO
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold text-emerald-400 border border-emerald-500/30">
                  REAL-TIME SYNC
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Simulasi Interaksi 2 Handphone
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95"
              title="Kembalikan semua data ke awal"
            >
              <span>↺</span> Reset Demo
            </button>
          </div>
        </div>

        {/* Section 1: Scenario Selector (2 Skenario Saja) */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {SCENARIOS.map((sc) => {
            const active = scenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSwitchScenario(sc.id)}
                className={`flex-1 flex flex-col justify-between rounded-2xl p-3.5 text-left border transition-all ${
                  active
                    ? 'border-dana-400 bg-gradient-to-br from-dana-950/90 to-slate-900 shadow-xl shadow-dana-500/15 ring-2 ring-dana-500/50'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 opacity-75 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide uppercase ${sc.badgeColor}`}>
                    {sc.tag}
                  </span>
                  {active && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-dana-400">
                      <span className="h-2 w-2 rounded-full bg-dana-400 animate-ping" /> Sedang Aktif
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm font-extrabold text-white">{sc.title}</p>
                <p className="mt-1 text-[11px] text-slate-400 leading-snug">{sc.summary}</p>
              </button>
            );
          })}
        </div>

        {/* Section 2: Real-time Action Triggers Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>⚡</span> Tombol Simulasi Interaksi Lintas Handphone (Real-Time)
            </span>
            <span className="text-[10px] text-slate-400">
              Aksi otomatis disinkronkan &amp; memicu efek di kedua handphone
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              onClick={() => actions.nominate({ name: 'Warung Nasi Pak Joko', category: 'F&B / Warung Makan', phone: '081244098811' })}
              className="flex items-center gap-1.5 rounded-xl bg-dana-600 hover:bg-dana-500 px-3 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              <span>💬</span> Bantu Daftarkan &amp; Kirim WA ke Pak Joko
            </button>

            <button
              onClick={() => actions.issueQris({ name: 'Warung Nasi Pak Joko', category: 'F&B / Warung Makan', location: 'Jakarta Selatan' })}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              <span>⚡</span> Pak Joko Aktifkan QRIS (KYC Light Rp0)
            </button>

            <button
              onClick={() => actions.receivePayment(15000)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              <span>💳</span> Pelanggan Bayar Rp15.000 ke QRIS (Nada DANA)
            </button>

            <button
              onClick={() => actions.completeStage2()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
            >
              <span>🏆</span> Selesaikan 5 Transaksi (Reward Tahap 2)
            </button>

            {/* WA Dropdown Trigger Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pl-1 border-l border-slate-700/80">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <Icon name="whatsapp" className="h-3 w-3" /> Notifikasi WA:
              </span>
              {[
                { id: 'wa-h1-joko', label: '[H+1] Unduh QRIS Kasir' },
                { id: 'wa-payment-joko', label: 'Terima QRIS DANA' },
                { id: 'wa-routine-joko', label: 'Rutin Terima QRIS' },
                { id: 'wa-h3-ratna', label: '[H+3] Belum Ada Pembayaran' },
                { id: 'wa-h7-inactive', label: '[H+7] Inaktivitas 7 Hari' },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => actions.triggerWhatsApp(w.id)}
                  className="rounded-lg bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900 px-2 py-1 text-[10px] font-bold text-emerald-300 transition active:scale-95"
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dual Phone Showcase Side-by-Side */}
        <div className="mt-2 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 xl:gap-14">
          {/* ----------------- LEFT PHONE: Pengundang (Rian / Bu Ratna) ----------------- */}
          <div className="flex flex-col items-center gap-3">
            {/* Persona Badge & Quick Screen Jumper for Phone 1 */}
            <div className="w-[394px] rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-dana-500 font-bold text-white text-xs">
                    {user1.initial}
                  </span>
                  <div>
                    <p className="text-xs font-black text-white">
                      HP 1 · {user1.name} {scenario === 'rian_joko' ? '(Konsumen)' : '(Merchant)'}
                    </p>
                    <p className="text-[10px] text-dana-400 font-semibold">
                      {scenario === 'rian_joko' ? 'Track A: Sahabat Warung (C2B)' : 'Track B: Mitra Bisnis (B2B)'}
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-dana-500/20 px-2 py-0.5 text-[9px] font-black text-dana-300 border border-dana-500/30">
                  PENGUNDANG
                </span>
              </div>

              {/* Quick Screen Selector Buttons for Phone 1 */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                <span className="text-[9px] font-bold text-slate-400 self-center mr-1">Layar:</span>
                {[
                  ['home', 'Beranda DANA'],
                  ['hub', 'Affiliate Hub'],
                  ['nominate', 'Bantu Daftar'],
                  ['tracker', 'Daftar Referal'],
                  ['rewards', 'Reward'],
                  ['receipt_data', 'Kasir Data (Admin)'],
                  ['receipt_emoney', 'Kasir E-Money (Admin)'],
                ].map(([scr, lbl]) => (
                  <button
                    key={scr}
                    onClick={() => setScreen1(scr)}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                      screen1 === scr
                        ? 'bg-dana-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Handphone 1 Frame */}
            <Phone
              toast={toast1}
              soundbox={soundbox1}
              whatsappPush={whatsappPush1}
              onOpenWhatsApp={(push) => {
                setActiveWhatsAppChat1(push);
                setWhatsappPush1(null);
              }}
              onDismissWhatsApp={() => setWhatsappPush1(null)}
              activeWhatsAppChat={activeWhatsAppChat1}
              onCloseWhatsApp={() => setActiveWhatsAppChat1(null)}
              go={(scr) => setScreen1(scr)}
            >
              <Screen1 key={screen1} {...ctx1} />
            </Phone>
          </div>

          {/* Center Connection Indicator (Desktop) */}
          <div className="hidden xl:flex flex-col items-center justify-center pt-64 gap-3 text-slate-500">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 shadow-xl text-center">
              <span className="text-2xl animate-spin" style={{ animationDuration: '8s' }}>
                🔄
              </span>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
                Interaksi Real-Time
              </p>
              <div className="text-[9px] text-slate-400 space-y-0.5 mt-0.5">
                <p>Kirim Undangan WA ➔</p>
                <p>⚡ KYC Light 30 Detik</p>
                <p>🔊 Nada DANA Kasir</p>
                <p>🎁 Reward 2 Tahap</p>
              </div>
            </div>
          </div>

          {/* ----------------- RIGHT PHONE: Penerima (Pak Joko) ----------------- */}
          <div className="flex flex-col items-center gap-3">
            {/* Persona Badge & Quick Screen Jumper for Phone 2 */}
            <div className="w-[394px] rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white text-xs">
                    {user2.initial}
                  </span>
                  <div>
                    <p className="text-xs font-black text-white">
                      HP 2 · Pak Joko (Warung Nasi Pak Joko)
                    </p>
                    <p className="text-[10px] text-emerald-400 font-semibold">
                      Warung Binaan · KYC Light Rp0 Tanpa e-KTP di Awal
                    </p>
                  </div>
                </div>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black text-emerald-300 border border-emerald-500/30">
                  WARUNG TERDAFTAR
                </span>
              </div>

              {/* Quick Screen Selector Buttons for Phone 2 */}
              <div className="mt-2.5 pt-2 border-t border-slate-800 flex flex-wrap gap-1">
                <span className="text-[9px] font-bold text-slate-400 self-center mr-1">Layar:</span>
                {[
                  ['landing', 'Undangan Web'],
                  ['register', 'Form KYC Light'],
                  ['qris', 'QRIS Toko'],
                  ['bizprofile', 'Profil Bisnis & Panduan Toko'],
                  ['rewards', 'Reward Pak Joko'],
                ].map(([scr, lbl]) => (
                  <button
                    key={scr}
                    onClick={() => setScreen2(scr)}
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                      screen2 === scr
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Handphone 2 Frame */}
            <Phone
              toast={toast2}
              soundbox={soundbox2}
              whatsappPush={whatsappPush2}
              onOpenWhatsApp={(push) => {
                setActiveWhatsAppChat2(push);
                setWhatsappPush2(null);
              }}
              onDismissWhatsApp={() => setWhatsappPush2(null)}
              activeWhatsAppChat={activeWhatsAppChat2}
              onCloseWhatsApp={() => setActiveWhatsAppChat2(null)}
              go={(scr) => setScreen2(scr)}
            >
              <Screen2 key={screen2} {...ctx2} />
            </Phone>
          </div>
        </div>
      </div>
    </div>
  );
}

/** iPhone-style frame with fixed bottom navbar support. */
function Phone({
  children,
  toast,
  soundbox,
  whatsappPush,
  onOpenWhatsApp,
  onDismissWhatsApp,
  activeWhatsAppChat,
  onCloseWhatsApp,
  go,
}) {
  return (
    <div className="relative h-[820px] w-[394px] shrink-0 rounded-[3.2rem] border-[3px] border-slate-700 bg-slate-900 p-[10px] shadow-2xl shadow-slate-500/40">
      <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-white flex flex-col">
        {/* Dynamic Island Notch */}
        <div className="pointer-events-none absolute top-2 left-1/2 z-40 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900" />

        {/* WhatsApp Push Notification Banner */}
        {whatsappPush && (
          <div className="absolute inset-x-3 top-10 z-50 animate-in slide-in-from-top-4 duration-200">
            <div
              onClick={() => onOpenWhatsApp(whatsappPush)}
              className="flex items-start gap-2.5 rounded-2xl bg-white/95 p-3 shadow-2xl backdrop-blur-md border border-slate-200/90 cursor-pointer active:scale-98 transition"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-xs">
                <Icon name="whatsapp" className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-wide text-[#075E54] uppercase">
                    WhatsApp · {whatsappPush.sender}
                  </span>
                  <span className="text-[9px] text-slate-400">Baru saja</span>
                </div>
                <p className="truncate text-xs font-extrabold text-slate-900 mt-0.5">
                  {whatsappPush.title}
                </p>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-snug mt-0.5">
                  {whatsappPush.preview}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismissWhatsApp();
                }}
                className="text-slate-400 hover:text-slate-600 p-1 text-xs"
                aria-label="Tutup notifikasi"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Soundbox DANA: Nada DANA chime banner */}
        {soundbox && (
          <div className="absolute inset-x-3 top-12 z-40 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl animate-in slide-in-from-top-3">
            <span className="text-lg">🔊</span>
            <span className="text-[11px] leading-snug font-bold">
              Nada DANA: “Pembayaran diterima {new Intl.NumberFormat('id-ID').format(soundbox)} rupiah”
            </span>
          </div>
        )}

        {/* System Toast */}
        {toast && (
          <div
            className={`absolute inset-x-3 z-40 rounded-2xl bg-slate-900/92 px-4 py-3 text-[11px] leading-snug font-semibold text-white shadow-xl animate-in fade-in duration-150 ${
              soundbox || whatsappPush ? 'top-32' : 'top-12'
            }`}
          >
            {toast}
          </div>
        )}

        {/* The screen itself fills the phone and controls internal scrolling */}
        <div className="relative h-full w-full flex-1 overflow-hidden">{children}</div>

        {/* Full WhatsApp Chat View Modal */}
        {activeWhatsAppChat && (
          <WhatsAppChatModal
            chat={activeWhatsAppChat}
            onClose={onCloseWhatsApp}
            go={go}
          />
        )}

        {/* Home indicator bar */}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-40 h-1.5 w-32 -translate-x-1/2 rounded-full bg-slate-900/25" />
      </div>
    </div>
  );
}
