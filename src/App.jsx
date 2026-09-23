import { useMemo, useRef, useState } from 'react';
import {
  activeMerchants,
  claimAll,
  claimBreakdown,
  MAX_PER_REFERRAL,
  paidTotal,
  PERSONA_REWARDS,
  rupiah,
  TIERS,
} from './rewards.js';
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
    label: 'Bu Putu — DANA Bisnis',
    hint: 'Track B · Mitra Bisnis (B2B)',
    entry: 'transfer',
    name: 'Putu Dewi',
    initial: 'P',
    store: 'Toko Grosir Bu Putu',
    balance: 96500,
  },
  {
    id: 'referred',
    label: 'Pak Joko — Warung Diundang',
    hint: 'Prospek: KYC Light, QRIS instan & Profil Bisnis',
    entry: 'landing',
    name: 'Joko Santoso',
    initial: 'J',
    store: 'Warung Sembako Pak Joko',
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
    summary: `Rian bantu daftarkan warung sembako langganan. Reward: ${PERSONA_REWARDS.consumer.tahap1.title} (Tahap 1) + ${PERSONA_REWARDS.consumer.tahap2.title} (Tahap 2).`,
    role1: 'consumer',
    role2: 'referred',
  },
  {
    id: 'ratna_joko',
    title: 'Skenario 2: Bu Putu (Merchant) ➔ Pak Joko (Warung)',
    tag: 'Track B · Mitra Bisnis (B2B)',
    badgeColor: 'bg-emerald-600 text-white',
    summary: `Bu Putu (Toko Grosir Bu Putu) mengajak warung sebelah. Reward: ${PERSONA_REWARDS.merchant.tahap1.title} (Tahap 1) + ${PERSONA_REWARDS.merchant.tahap2.title} (Tahap 2).`,
    role1: 'merchant',
    role2: 'referred',
  },
];

/**
 * 10 Langkah alur skenario end-to-end yang dijalankan langsung di kedua handphone.
 * Setiap langkah ditandai selesai oleh aksi nyata di layar HP.
 */
const stepDefs = (scenario, role1) => {
  const r = PERSONA_REWARDS[role1];
  const who1 = scenario === 'rian_joko' ? 'Rian' : 'Bu Putu';
  return [
    {
      id: 'open_hub',
      stepNum: 1,
      phone: 1,
      title:
        scenario === 'rian_joko'
          ? 'Rian membuka banner program'
          : 'Bu Putu melihat simulasi transfer Bank BCA',
      hint:
        scenario === 'rian_joko'
          ? `Ketuk banner "Ajak Warung Langganan, Dapat Saldo s/d ${rupiah(MAX_PER_REFERRAL)}" di Beranda DANA.`
          : 'Di halaman transfer Bank BCA, lihat biaya admin Rp2.500 lalu ketuk tombol "Coba →".',
    },
    {
      id: 'guide_done',
      stepNum: 2,
      phone: 1,
      title: 'Menyelesaikan panduan referal program',
      hint: 'Di panduan awal, baca sampai slide 4 lalu tekan tombol untuk masuk ke beranda program referal.',
    },
    {
      id: 'open_nominate',
      stepNum: 3,
      phone: 1,
      title: 'Klik banner ajak warung',
      hint: `Ketuk tombol "${scenario === 'rian_joko' ? 'Bantu Daftarkan Warung Langganan' : 'Bantu Daftarkan Rekan Usaha'}" untuk buka form pendaftaran.`,
    },
    {
      id: 'invite_sent',
      stepNum: 4,
      phone: 1,
      title: 'Mengajak warung Pak Joko dengan isi form',
      hint: 'Lengkapi formulir (Nama Warung, Kategori, No WA) lalu ketuk "Kirim Undangan Resmi DANA Bisnis".',
    },
    {
      id: 'wa_notif',
      stepNum: 5,
      phone: 2,
      title: 'Pak Joko menerima notifikasi WhatsApp',
      hint: 'Notifikasi undangan pendaftaran dari pengundang masuk secara instan di layar HP 2.',
    },
    {
      id: 'open_invite',
      stepNum: 6,
      phone: 2,
      title: 'Pak Joko buka link WhatsApp & daftar toko',
      hint: 'Buka notifikasi WhatsApp di HP 2, ketuk link pendaftaran, lalu tekan "Terbitkan QRIS Saya Sekarang".',
    },
    {
      id: 'stage1_tx',
      stepNum: 7,
      phone: 2,
      title: 'Transaksi pertama ≥Rp10.000 dari Rian (Tahap 1)',
      hint: 'Di checklist QRIS, tekan "💳 Pelanggan Bayar Rp15.000". Saldo bertambah & reward Tahap 1 aktif!',
    },
    {
      id: 'open_bizprofile',
      stepNum: 8,
      phone: 2,
      title: 'Tekan "Buka Profil DANA Bisnis & Panduan Toko"',
      hint: 'Tekan tombol hijau "Buka Profil DANA Bisnis & Panduan Toko" di bawah layar QRIS.',
    },
    {
      id: 'biz_guide',
      stepNum: 9,
      phone: 2,
      title: 'Panduan aksi fitur DANA Bisnis Pak Joko',
      hint: 'Lihat bubble chat yang menyorot 4 aksi: Buka QRIS, Tarik Saldo, Transfer, & Pembayaran.',
    },
    {
      id: 'stage2_verify',
      stepNum: 10,
      phone: 2,
      title: '5 transaksi unik & foto verifikasi kasir (Tahap 2)',
      hint: 'Tekan "+ Tambah 5 Transaksi", lalu lakukan verifikasi foto kasir secara manual di HP Pak Joko.',
    },
  ];
};

const SEED_REFERRALS = [
  {
    id: 0,
    name: 'Warung Sembako Pak Joko',
    category: 'Toko Kelontong',
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

  // Progres skenario: diisi oleh aksi nyata di kedua handphone atau tombol trigger transaksi.
  const [progress, setProgress] = useState({});
  const mark = (id) => setProgress((p) => (p[id] ? p : { ...p, [id]: true }));

  // Penanda UI yang dikirim layar lewat patch(), mis. hasSeenAffiliateGuide.
  const [flags, setFlags] = useState({});

  // Shared application state: Rian memiliki mock data referral, Bu Putu bersih (tanpa histori referral)
  const [referralsRian, setReferralsRian] = useState(() => SEED_REFERRALS.map((r) => ({ ...r })));
  const [referralsRatna, setReferralsRatna] = useState(() => []);

  const referrals = scenario === 'ratna_joko' ? referralsRatna : referralsRian;
  const setReferrals = (updater) => {
    if (scenario === 'ratna_joko') {
      setReferralsRatna(updater);
    } else {
      setReferralsRian(updater);
    }
  };
  const [balances, setBalances] = useState(() => Object.fromEntries(ROLES.map((r) => [r.id, r.balance])));
  const [rewardQuotas, setRewardQuotas] = useState({
    merchant: { transfer: 2, admin: 10 },
    referred: { withdraw: 2, admin: 10 },
  });
  const [merchant, setMerchant] = useState({
    name: 'Warung Sembako Pak Joko',
    category: 'Toko Kelontong',
    location: 'Jl. Tebet Barat Dalam VIII No.12, Jakarta Selatan',
    issued: false,
    testScan: false,
    firstPayment: 0,
  });

  // Phone 1 (Pengundang: Rian / Bu Putu) State
  const activeRole1 = scenario === 'rian_joko' ? 'consumer' : 'merchant';
  const [screen1, setScreen1] = useState(scenario === 'rian_joko' ? 'home' : 'transfer');
  const [toast1, setToast1] = useState(null);
  const [soundbox1, setSoundbox1] = useState(null);
  const [whatsappPush1, setWhatsappPush1] = useState(null);
  const [activeWhatsAppChat1, setActiveWhatsAppChat1] = useState(null);
  const toastTimer1 = useRef(0);
  const soundboxTimer1 = useRef(0);

  // Phone 2 (Penerima: Pak Joko) State
  // HP 2 menunggu undangan dulu; halaman pendaftaran baru terbuka dari notifikasi WhatsApp.
  const [screen2, setScreen2] = useState('waiting');
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

  /** Ganti skenario = mulai alur dari langkah 1 lagi, supaya progres tidak campur. */
  const handleSwitchScenario = (scId) => {
    if (scId === scenario) return;
    setScenario(scId);
    resetDemo(scId);
    const label = scId === 'rian_joko' ? 'Skenario 1 (Rian ➔ Pak Joko)' : 'Skenario 2 (Bu Putu ➔ Pak Joko)';
    notify1(`Beralih ke ${label}. Ikuti langkah 1 di bawah.`);
  };

  const resetDemo = (sc = scenario) => {
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
    setProgress({});
    setFlags({});
    setReferralsRian(SEED_REFERRALS.map((r) => ({ ...r })));
    setReferralsRatna([]);
    setBalances(Object.fromEntries(ROLES.map((r) => [r.id, r.balance])));
    setRewardQuotas({
      merchant: { transfer: 2, admin: 10 },
      referred: { withdraw: 2, admin: 10 },
    });
    setMerchant({
      name: 'Warung Sembako Pak Joko',
      category: 'Toko Kelontong',
      location: 'Jl. Tebet Barat Dalam VIII No.12, Jakarta Selatan',
      issued: false,
      testScan: false,
      firstPayment: 0,
    });
    setScreen1(sc === 'rian_joko' ? 'home' : 'transfer');
    setScreen2('waiting');
  };

  const handleReset = () => {
    resetDemo();
    notify1('Data prototipe berhasil di-reset. Mulai lagi dari langkah 1.');
  };

  /** Navigasi HP 1 sekaligus penanda langkah skenario. */
  const go1 = (scr) => {
    setScreen1(scr);
    if (scr === 'hub') mark('open_hub');
    if (scr === 'nominate') mark('open_nominate');
  };

  /** Navigasi HP 2 sekaligus penanda langkah skenario. */
  const go2 = (scr) => {
    setScreen2(scr);
    // Membuka halaman undangan setelah undangan dikirim = Pak Joko mengklik link WhatsApp.
    if ((scr === 'landing' || scr === 'register') && progress.invite_sent) mark('open_invite');
    if (scr === 'bizprofile' || scr === 'bizdash') mark('open_bizprofile');
  };

  // Cross-phone interactive actions
  const actions = {
    /** Phone 1: Referrer pre-fills 3 fields -> sends WhatsApp invitation to Phone 2 */
    nominate: ({ name, category, phone }) => {
      const id = Date.now();
      const warungName = name || 'Warung Sembako Pak Joko';
      setMerchant((m) => ({
        ...m,
        name: warungName,
        category: category || 'Toko Kelontong',
        issued: false,
        testScan: false,
        firstPayment: 0,
      }));
      setReferrals((prev) => [
        {
          id,
          name: warungName,
          category: category || 'Toko Kelontong',
          phone: phone || '0812••••4409',
          stage: 0,
          claimedStage: 0,
          tx: 0,
          day: 'Undangan baru terkirim',
        },
        ...prev.filter((r) => r.id !== 0),
      ]);
      setScreen1('tracker');
      mark('invite_sent');
      mark('wa_notif'); // Pak Joko menerima notifikasi WhatsApp secara instan
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
      mark('open_invite');
      mark('qris_issued');
      notify2('QRIS Nasional aktif seketika (KYC Light Rp0). Siap menerima pembayaran digital!');
      notify1(`🎉 ${storeName} berhasil menerbitkan QRIS! Menunggu transaksi pertama.`);
    },

    testScan: () => {
      setMerchant((m) => ({ ...m, testScan: true }));
      announce2(1000);
      mark('test_scan');
      notify2('Transaksi uji Rp1.000 masuk. Nada DANA berbunyi!');
    },

    /** Pelanggan bayar ke QRIS Pak Joko: Tahap 1 Reward aktif */
    receivePayment: (amount = 15000) => {
      const qualifies = amount >= 10000;
      setMerchant((m) => ({ ...m, testScan: true, firstPayment: amount }));
      announce2(amount);
      if (qualifies) {
        mark('stage1_tx');
        mark('stage1');
      }

      // Pak Joko menerima uang penjualannya di Saldo DANA Bisnis
      setBalances((prev) => ({
        ...prev,
        referred: prev.referred + amount,
        consumer: prev.consumer + (scenario === 'rian_joko' && qualifies ? TIERS[0].amount : 0),
      }));

      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, stage: 1, claimedStage: 1, tx: (r.tx || 0) + 1, day: 'Tahap 1 selesai · Menuju 5 tx' }
            : r
        )
      );

      if (scenario === 'rian_joko') {
        notify1(`🎉 Warung Pak Joko transaksi pertama! Reward Tahap 1 (${rupiah(TIERS[0].amount)}) cair ke Saldo DANA.`);
      } else {
        notify1(`🎉 Warung Pak Joko transaksi pertama! Kupon Gratis Transfer 2x aktif di tab Reward.`);
      }
    },

    /** Menambahkan 5 transaksi unik (kriteria transaksi Tahap 2) tanpa menyelesaikan verifikasi foto */
    triggerStage2Tx: () => {
      playChime();
      mark('stage2_tx');
      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, tx: 5, day: '5 transaksi unik tercapai · Menunggu foto kasir' }
            : r
        )
      );
      announce2(75000);
      notify2('🎉 5 transaksi unik dari pembeli berbeda masuk (5/5)! Silakan lakukan verifikasi foto kasir di HP Pak Joko.');
      notify1('Warung Pak Joko mencapai 5 transaksi unik! Menunggu verifikasi foto kasir.');
    },

    /** Tahap 2: Foto kasir terverifikasi secara manual & reward Tahap 2 cair */
    completeStage2: () => {
      playChime();
      mark('stage2_tx');
      mark('stage2_verify');
      mark('stage2');
      setBalances((prev) => ({
        ...prev,
        consumer: prev.consumer + (scenario === 'rian_joko' ? TIERS[1].amount : 0),
      }));

      setReferrals((prev) =>
        prev.map((r) =>
          r.name.toLowerCase().includes('joko') || r.id === 0
            ? { ...r, stage: 2, claimedStage: 2, tx: 5, day: 'Tahap 2 lolos audit validasi' }
            : r
        )
      );

      notify2('🎉 Verifikasi foto kasir berhasil! Tokomu resmi terverifikasi & Kupon 10x Bebas Admin aktif.');
      if (scenario === 'rian_joko') {
        notify1(`🎉 Verifikasi foto warung binaan selesai! Reward Tahap 2 (${rupiah(TIERS[1].amount)}) cair ke Saldo DANA.`);
      } else {
        notify1(`🎉 Verifikasi foto warung binaan selesai! Kupon Bebas Biaya Admin 10x aktif di tab Reward.`);
      }
    },

    completeBizGuide: () => {
      mark('biz_guide');
      setFlags((prev) => ({ ...prev, hasSeenBizGuide: true }));
      notify2('🎉 Panduan aksi DANA Bisnis selesai dipelajari!');
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

  /**
   * patch() dari layar. Kunci yang tidak dikenal TIDAK dibuang lagi — disimpan di
   * `flags` — supaya penanda UI seperti hasSeenAffiliateGuide benar-benar tersimpan.
   */
  const applyPatch = (fnOrObj) => {
    const obj =
      typeof fnOrObj === 'function' ? fnOrObj({ referrals, rewardQuotas, merchant, balances, ...flags }) : fnOrObj;
    if (!obj) return;
    const { referrals: r, rewardQuotas: q, balances: b, merchant: m, ...rest } = obj;
    if (r) setReferrals(r);
    if (q) setRewardQuotas(q);
    if (b) setBalances(b);
    if (m) setMerchant(m);
    if (Object.keys(rest).length) {
      setFlags((prev) => ({ ...prev, ...rest }));
      if (rest.hasSeenAffiliateGuide) mark('guide_done');
      if (rest.hasSeenBizGuide) mark('biz_guide');
    }
  };

  /** Nudge WhatsApp dari tracker: kirim pesan pendampingan ke HP warung. */
  const makeNudge = (notify) => (referral) => {
    const waId =
      referral.stage === 0
        ? 'wa-invite-joko'
        : referral.tx >= 1
          ? 'wa-routine-joko'
          : 'wa-payment-joko';
    const notif = WHATSAPP_NOTIFICATIONS.find((n) => n.id === waId) ?? WHATSAPP_NOTIFICATIONS[0];
    setWhatsappPush2({ ...notif, sender: user1.name });
    notify(`Pesan pendampingan untuk ${referral.name} terkirim via WhatsApp.`);
  };

  const sharedCtx = {
    referrals,
    rewardQuotas,
    merchant,
    patch: applyPatch,
  };

  const isStage2Done = !!(progress.stage2 || progress.stage2_verify);

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
      isStage2Done,
      ...flags,
    },
    user: user1,
    go: go1,
    notify: notify1,
    announce: announce1,
    nominate: actions.nominate,
    claim: actions.claim1,
    nudge: makeNudge(notify1),
    openWhatsApp: (wa) => setActiveWhatsAppChat1(wa),
    inviter: user1.name,
    earned: paidTotal(referrals),
    activeCount: activeMerchants(referrals),
    claimable: claimBreakdown(referrals),
    mark,
    progress,
  };

  // Phone 2 context (Pak Joko - merchant binaan)
  const ctx2 = {
    ...sharedCtx,
    s: {
      role: 'referred',
      screen: screen2,
      referrals: [],
      rewardQuotas,
      merchant,
      balances,
      isStage2Done,
      ...flags,
    },
    user: user2,
    go: go2,
    notify: notify2,
    announce: announce2,
    issueQris: actions.issueQris,
    testScan: actions.testScan,
    receivePayment: actions.receivePayment,
    completeStage2: actions.completeStage2,
    completeBizGuide: actions.completeBizGuide,
    claim: actions.claim2,
    nudge: makeNudge(notify2),
    openWhatsApp: (wa) => setActiveWhatsAppChat2(wa),
    inviter: user1.name,
    earned: 0,
    activeCount: 0,
    claimable: { rows: [], saldo: 0, voucher: 0, total: 0 },
    mark,
    progress,
  };

  const Screen1 = screens[screen1] ?? screens.home;
  const Screen2 = screens[screen2] ?? screens.landing;

  const steps = stepDefs(scenario, activeRole1);
  const currentIndex = steps.findIndex((st) => !progress[st.id]);
  const currentStep = currentIndex === -1 ? null : steps[currentIndex];

  /** Trigger khusus untuk menambahkan transaksi (Step 7 dan Step 10) */
  const handleTriggerStep = (stepId) => {
    if (stepId === 'stage1_tx') {
      if (!merchant.issued) {
        setMerchant((m) => ({ ...m, issued: true }));
      }
      if (screen2 !== 'qris' && screen2 !== 'bizprofile') {
        setScreen2('qris');
      }
      actions.receivePayment(15000);
    } else if (stepId === 'stage2_verify' || stepId === 'stage2_tx') {
      actions.triggerStage2Tx();
    }
  };

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
                  REFERRAL MERCHANT PROGRAM · DUAL-PHONE LIVE DEMO
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
                className={`flex-1 flex flex-col justify-between rounded-2xl p-3.5 text-left border transition-all ${active
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

        {/* Section 2: Step-by-step scenario progress */}
        <ScenarioSteps steps={steps} progress={progress} onTriggerStep={handleTriggerStep} />

        {/* Dual Phone Showcase Side-by-Side */}
        <div className="mt-2 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 xl:gap-14">
          {/* ----------------- LEFT PHONE: Pengundang (Rian / Bu Putu) ----------------- */}
          <div className="flex flex-col items-center gap-3">
            {/* Persona badge HP 1 (pengundang) */}
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

              <p className="mt-2 border-t border-slate-800 pt-2 text-[10px] leading-snug text-slate-400">
                {currentStep?.phone === 1 ? (
                  <>
                    <span className="font-bold text-dana-300">Langkah {currentIndex + 1}:</span> {currentStep.hint}
                  </>
                ) : (
                  'Navigasi hanya lewat layar, persis seperti aplikasi asli.'
                )}
              </p>
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
              go={go1}
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
            {/* Persona badge HP 2 (warung diundang) */}
            <div className="w-[394px] rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 font-bold text-white text-xs">
                    {user2.initial}
                  </span>
                  <div>
                    <p className="text-xs font-black text-white">
                      HP 2 · Pak Joko (Warung Sembako Pak Joko)
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

              <p className="mt-2 border-t border-slate-800 pt-2 text-[10px] leading-snug text-slate-400">
                {currentStep?.phone === 2 ? (
                  <>
                    <span className="font-bold text-emerald-300">Langkah {currentIndex + 1}:</span> {currentStep.hint}
                  </>
                ) : (
                  'Menunggu aksi di HP 1 dulu.'
                )}
              </p>
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
              go={go2}
            >
              <Screen2 key={screen2} {...ctx2} />
            </Phone>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Papan progres skenario interaktif dengan tombol trigger langsung pada setiap langkah.
 */
function ScenarioSteps({ steps, progress, onTriggerStep }) {
  const doneCount = steps.filter((st) => progress[st.id]).length;
  const currentIndex = steps.findIndex((st) => !progress[st.id]);
  const finished = currentIndex === -1;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[11px] font-black tracking-wider text-amber-400 uppercase">
          <span>🧭</span> 10 Langkah Referral Merchant Program · Selesai Langsung di HP atau Lewat Tombol Trigger
        </span>
        <span className="text-[10px] font-bold text-slate-300">
          {finished ? (
            <span className="text-emerald-400 font-extrabold">Semua {steps.length} langkah selesai 🎉</span>
          ) : (
            <>
              <span className="text-amber-300 font-extrabold">{doneCount}</span>/{steps.length} langkah selesai
            </>
          )}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-dana-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${(doneCount / steps.length) * 100}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {steps.map((st, i) => {
          const done = Boolean(progress[st.id]);
          const active = i === currentIndex;
          const isLast = i === steps.length - 1;
          const isStep7 = st.id === 'stage1_tx';
          const isStep10 = st.id === 'stage2_verify';

          return (
            <div
              key={st.id}
              className={`relative flex flex-col justify-between rounded-xl border p-2.5 transition-all ${
                done
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : active
                    ? isStep7
                      ? 'border-emerald-400 bg-emerald-950/70 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-500/20'
                      : isStep10
                        ? 'border-amber-400 bg-amber-950/70 ring-2 ring-amber-500/60 shadow-lg shadow-amber-500/20'
                        : 'border-dana-400 bg-dana-950/70 ring-2 ring-dana-500/50 shadow-lg shadow-dana-500/15'
                    : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : active
                          ? isStep7
                            ? 'bg-emerald-500 text-white'
                            : isStep10
                              ? 'bg-amber-500 text-white'
                              : 'bg-dana-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {done ? '✓' : i + 1}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-black ${
                      st.phone === 1 ? 'bg-dana-500/20 text-dana-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    HP {st.phone}
                  </span>
                  {active && (
                    <span className="ml-auto flex items-center gap-1 text-[8px] font-black text-amber-300">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-300" /> AKTIF
                    </span>
                  )}
                  {done && <span className="ml-auto text-[8px] font-black text-emerald-400">SELESAI</span>}
                </div>

                <p
                  className={`mt-1.5 text-[11px] leading-snug font-bold ${
                    done ? 'text-emerald-200/90' : active ? 'text-white font-extrabold' : 'text-slate-300'
                  }`}
                >
                  {st.title}
                </p>
                <p className={`mt-0.5 text-[10px] leading-snug ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                  {st.hint}
                </p>
              </div>

              {/* Tombol trigger HANYA untuk Step 7 dan Step 10 untuk menambahkan transaksi */}
              {isStep7 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onTriggerStep('stage1_tx')}
                    className={`flex w-full items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[10px] font-black shadow-md transition active:scale-95 cursor-pointer ${
                      done
                        ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-white ring-2 ring-emerald-300/60 shadow-emerald-500/30'
                    }`}
                  >
                    {done ? '✓ Transaksi Rp15.000 Masuk' : '+ Tambah Transaksi Rp15.000'}
                  </button>
                </div>
              )}

              {isStep10 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => onTriggerStep('stage2_tx')}
                    className={`flex w-full items-center justify-center gap-1 rounded-lg py-1.5 px-2 text-[10px] font-black shadow-md transition active:scale-95 cursor-pointer ${
                      progress.stage2_tx || done
                        ? 'bg-emerald-800/40 text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-300/60 shadow-emerald-500/30'
                    }`}
                  >
                    {progress.stage2_tx || done ? '✓ 5 Transaksi Masuk (5/5)' : '+ Tambah 5 Transaksi'}
                  </button>
                  {progress.stage2_tx && !done && (
                    <p className="mt-1 text-center text-[9px] font-bold text-amber-300 animate-pulse">
                      Menunggu verifikasi foto di HP Pak Joko
                    </p>
                  )}
                </div>
              )}

              {/* Step Flow Connector Arrow */}
              {!isLast && (
                <div className="mt-1.5 flex items-center justify-end text-[9px] font-bold text-slate-500">
                  <span className="flex items-center gap-0.5 opacity-60">
                    <span>Lanjut</span> ➔
                  </span>
                </div>
              )}
            </div>
          );
        })}
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
          <div className="absolute inset-x-3 top-12 z-40 flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl animate-in slide-in-from-top-3">
            <span className="text-xs leading-snug font-bold">
              Pembayaran diterima Rp {new Intl.NumberFormat('id-ID').format(soundbox)}
            </span>
          </div>
        )}

        {/* System Toast */}
        {toast && (
          <div
            className={`absolute inset-x-3 z-40 rounded-2xl bg-slate-900/92 px-4 py-3 text-[11px] leading-snug font-semibold text-white shadow-xl animate-in fade-in duration-150 ${soundbox || whatsappPush ? 'top-32' : 'top-12'
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
