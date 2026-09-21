import { useMemo, useRef, useState } from 'react';
import { activeMerchants, claimAll, claimBreakdown, paidTotal, rupiah } from './rewards.js';
import screens, { WHATSAPP_NOTIFICATIONS, WhatsAppChatModal } from './screens.jsx';
import { Icon } from './ui.jsx';

/**
 * One identity per role. Every screen reads the active persona from here, so the
 * host-app screens can never show another persona's name or wallet.
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

const SEED_REFERRALS = [
  // Pre-linked to the "referred" role so the cross-role demo works without nominating first.
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

const initialState = () => ({
  role: 'consumer',
  screen: 'home',
  hasSeenAffiliateGuide: false,
  referrals: SEED_REFERRALS.map((r) => ({ ...r })),
  // Dompet per persona, reward masuk otomatis ke akun pengundang.
  balances: Object.fromEntries(ROLES.map((r) => [r.id, r.balance])),
  // Siapa yang mengundang warung ini; dipakai di seluruh sisi warung.
  inviter: roleOf('consumer').name,
  nominatedId: 0,
  // The warung on the receiving end of the invitation.
  merchant: {
    name: 'Warung Nasi Pak Joko',
    category: 'F&B / Warung Makan',
    location: '',
    issued: false,
    testScan: false,
    firstPayment: 0,
    modalBonus: 0,
  },
  soundbox: null,
  toast: null,
  whatsappPush: null,
  activeWhatsAppChat: null,
});

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
  const [s, setS] = useState(initialState);
  const toastTimer = useRef(0);
  const soundboxTimer = useRef(0);

  const patch = (p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }));

  const notify = (toast) => {
    clearTimeout(toastTimer.current);
    patch({ toast });
    toastTimer.current = setTimeout(() => patch({ toast: null }), 3800);
  };

  /** Soundbox DANA: banner "suara di tiap transaksi" + nada. */
  const announce = (amount) => {
    playChime();
    clearTimeout(soundboxTimer.current);
    patch({ soundbox: amount });
    soundboxTimer.current = setTimeout(() => patch({ soundbox: null }), 4200);
  };

  const go = (screen) => patch({ screen });

  const setRole = (role) => patch({ role, screen: roleOf(role).entry });

  const mapReferral = (id, fn) =>
    patch((prev) => ({ referrals: prev.referrals.map((r) => (r.id === id ? fn(r) : r)) }));

  const actions = {
    go,
    notify,
    patch,
    announce,

    triggerWhatsApp: (id) => {
      const notif = WHATSAPP_NOTIFICATIONS.find((n) => n.id === id) || WHATSAPP_NOTIFICATIONS[0];
      patch({ whatsappPush: notif });
    },

    openWhatsApp: (notif) => {
      patch({ activeWhatsAppChat: notif, whatsappPush: null });
    },

    closeWhatsApp: () => {
      patch({ activeWhatsAppChat: null });
    },

    dismissWhatsAppPush: () => {
      patch({ whatsappPush: null });
    },

    /** "Bantu Daftarkan": referrer pre-fills 3 fields -> referral at stage 0. */
    nominate: ({ name, category, phone }) => {
      const id = Date.now();
      patch((prev) => ({
        referrals: [
          { id, name, category, phone, stage: 0, claimedStage: 0, tx: 0, day: 'Undangan baru terkirim' },
          ...prev.referrals,
        ],
        nominatedId: id,
        inviter: roleOf(prev.role).name,
        merchant: {
          ...prev.merchant,
          name,
          category,
          issued: false,
          testScan: false,
          firstPayment: 0,
          modalBonus: 0,
        },
        screen: 'tracker',
      }));
      notify(`Undangan resmi DANA Bisnis terkirim ke ${phone}. Kode referral sudah terpasang otomatis.`);
    },

    /** KYC Light selesai -> QRIS terbit, referral naik ke Tier 1. */
    issueQris: ({ name, category, location }) => {
      patch((prev) => ({
        merchant: { ...prev.merchant, name, category, location, issued: true },
        referrals: prev.referrals.map((r) =>
          r.id === prev.nominatedId && r.stage < 1 ? { ...r, stage: 1, name, day: 'Baru saja daftar' } : r,
        ),
        screen: 'qris',
      }));
      notify('QRIS Nasional Anda terbit. Tidak perlu menunggu verifikasi 1–14 hari.');
    },

    testScan: () => {
      patch((prev) => ({ merchant: { ...prev.merchant, testScan: true } }));
      announce(1000);
      notify('Transaksi uji Rp1.000 masuk. Nada DANA berbunyi, notifikasi aktif.');
    },

    /** Transaksi pelanggan pertama (Tahap 1): jika >= Rp10.000, reward Tahap 1 otomatis masuk */
    receivePayment: (amount = 12000) => {
      const qualifies = amount >= 10000;

      patch((prev) => {
        const target = prev.referrals.find((r) => r.id === prev.nominatedId);
        const willPromote = target && target.stage < 1 && qualifies;

        return {
          merchant: { ...prev.merchant, firstPayment: amount, modalBonus: 15000 },
          balances: {
            ...prev.balances,
            // Reward Tahap 1: Rp10.000 otomatis masuk ke saldo DANA pengundang
            consumer: prev.balances.consumer + (willPromote ? 10000 : 0),
            // Uang pembayaran + bonus modal usaha Rp15.000 masuk ke saldo DANA Bisnis merchant
            referred: prev.balances.referred + amount + (willPromote ? 15000 : 0),
          },
          referrals: prev.referrals.map((r) =>
            r.id === prev.nominatedId && r.stage < 1 && qualifies
              ? { ...r, stage: 1, claimedStage: 1, tx: r.tx + 1, day: 'Tahap 1 selesai · Menuju 5 tx' }
              : r,
          ),
        };
      });

      announce(amount);
      const isRefMerchant = s.role === 'referred';
      notify(
        isRefMerchant
          ? `🎉 Pembayaran ${rupiah(amount)} berhasil! Bonus Modal Usaha Rp15.000 telah masuk ke saldo tokomu.`
          : qualifies
          ? `🎉 Pembayaran ${rupiah(amount)} berhasil! Reward Tahap 1 (Rp10.000) otomatis masuk ke Saldo Pocket DANA.`
          : `Pembayaran ${rupiah(amount)} berhasil diterima.`
      );
    },

    /** Simulasi Tahap 2: 5 transaksi unik dari pembeli berbeda & lolos audit validitas DANA (1-14 hari) */
    completeStage2: () => {
      patch((prev) => {
        const target = prev.referrals.find((r) => r.id === prev.nominatedId);
        const willPromote = target && target.stage === 1;

        return {
          balances: {
            ...prev.balances,
            // Reward Tahap 2: Rp30.000 otomatis masuk ke saldo DANA pengundang (Total Rp40.000)
            consumer: prev.balances.consumer + (willPromote ? 30000 : 0),
          },
          referrals: prev.referrals.map((r) =>
            r.id === prev.nominatedId && r.stage === 1
              ? { ...r, stage: 2, claimedStage: 2, tx: Math.max(r.tx + 4, 5), day: 'Tahap 2 lolos audit validasi' }
              : r,
          ),
        };
      });

      playChime();
      notify(
        s.role === 'referred'
          ? '🎉 5 Transaksi unik berhasil diverifikasi! Tokomu resmi berstatus Merchant Juara.'
          : '🎉 5 Transaksi unik warung binaan terverifikasi! Reward Tahap 2 (Rp30.000) otomatis masuk ke Saldo DANA.'
      );
    },

    nudge: (referral) =>
      notify(
        referral.stage === 0
          ? `Membuka WhatsApp untuk mengirim link pendaftaran ke ${referral.name}...`
          : `Membuka WhatsApp untuk koordinasi transaksi dengan ${referral.name}...`
      ),

    claim: () => {
      const { saldo, total } = claimBreakdown(s.referrals);
      if (!total) return notify('Semua reward telah otomatis masuk ke saldo DANA Anda.');
      patch((prev) => ({
        balances: { ...prev.balances, [prev.role]: prev.balances[prev.role] + saldo },
        referrals: claimAll(prev.referrals),
      }));
      playChime();
      notify(`${rupiah(saldo)} masuk ke Saldo DANA seketika.`);
    },

    reset: () => {
      clearTimeout(toastTimer.current);
      clearTimeout(soundboxTimer.current);
      setS(initialState());
    },
  };

  const claimable = useMemo(() => claimBreakdown(s.referrals), [s.referrals]);
  const role = roleOf(s.role);
  const ctx = {
    s,
    ...actions,
    claimable,
    user: { ...role, balance: s.balances[s.role] },
    inviter: s.inviter,
    earned: paidTotal(s.referrals),
    activeCount: activeMerchants(s.referrals),
  };
  const Screen = screens[s.screen] ?? screens.home;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-center">
        <div className="flex-1 lg:max-w-sm">
          <p className="text-xs font-bold tracking-widest text-dana-700">AFFILIATE DANA BISNIS · V2.1</p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold text-slate-900">
            Merchant Referral Program
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Prototipe interaktif yang mengembangkan fitur <strong>Affiliate DANA Bisnis</strong>: tetap memakai runtime Mini Program dan 4 tab bawah (Beranda, Referal, Reward, Inbox), dengan fitur <em>Bantu Daftarkan</em>, KYC Light tanpa syarat e-KTP di awal (Rp0), skema 2 tahap reward (Rian: Rp10k + Rp30k; Bu Ratna: Bebas transfer 10x + Bebas admin 10x; Pak Joko: Bebas tarik tunai 7x + Bebas admin 10x), Carousel Onboarding Guide layar penuh model AIDA, dan WhatsApp official engagement.
          </p>

          {/* Section 1: Persona Picker */}
          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Pilih peran pengguna</p>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  s.role === r.id
                    ? 'border-dana-500 bg-white shadow-lg shadow-dana-500/10'
                    : 'border-slate-200 bg-white/60 hover:border-slate-300'
                }`}
              >
                <span className="block text-sm font-bold text-slate-900">{r.label}</span>
                <span className="block text-xs text-slate-500">{r.hint}</span>
              </button>
            ))}
          </div>

          {/* Section 2: Simulasi Entrypoint Transaksi (Kena Admin) */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              Entrypoint Transaksi (Kena Biaya Admin)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Bukti transaksi pasca-bayar yang memicu penawaran promo ajak warung:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={() => go('receipt_data')}
                className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/70 px-3 py-2 text-left text-xs font-bold text-rose-900 transition hover:bg-rose-100"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500 text-white text-[10px]">
                    📶
                  </span>
                  <div>
                    <p className="font-bold">Habis Beli Paket Internet</p>
                    <p className="text-[10px] text-rose-700">Rp55.000 + Biaya Admin Rp1.500</p>
                  </div>
                </div>
                <span className="rounded bg-rose-200 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-800">
                  Lihat Bukti →
                </span>
              </button>

              <button
                onClick={() => go('receipt_emoney')}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-left text-xs font-bold text-amber-900 transition hover:bg-amber-100"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500 text-white text-[10px]">
                    💳
                  </span>
                  <div>
                    <p className="font-bold">Habis Top Up E-Money</p>
                    <p className="text-[10px] text-amber-700">Rp100.000 + Biaya Admin Rp1.500</p>
                  </div>
                </div>
                <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-800">
                  Lihat Bukti →
                </span>
              </button>
            </div>
          </div>

          {/* Section 3: Simulasi Notifikasi WhatsApp Resmi */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-wider text-[#075E54] uppercase">
                Simulasi Notifikasi WhatsApp
              </p>
              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-800">
                <Icon name="whatsapp" className="h-2.5 w-2.5" /> 5 Skenario
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Notifikasi resmi DANA Bisnis via WhatsApp di jam operasional toko:
            </p>
            <div className="mt-3 space-y-1.5">
              {[
                {
                  id: 'wa-h1-joko',
                  label: '[H+1] Unduh QRIS Kasir Toko',
                  sub: 'Ke Pak Joko di jam operasional toko',
                  roleSwitch: 'referred',
                },
                {
                  id: 'wa-payment-joko',
                  label: 'Terima Pembayaran QRIS DANA',
                  sub: 'Ke Pak Joko: Rp12.000, 0% MDR + Bonus Rp15k',
                  roleSwitch: 'referred',
                },
                {
                  id: 'wa-routine-joko',
                  label: 'Rutin Menerima Transaksi QRIS',
                  sub: 'Ke Pak Joko: Ringkasan mingguan & tips usaha',
                  roleSwitch: 'referred',
                },
                {
                  id: 'wa-h3-ratna',
                  label: '[H+3] Belum Ada Transaksi QRIS',
                  sub: 'Ke Bu Ratna (pengundang) di jam operasional',
                  roleSwitch: 'merchant',
                },
                {
                  id: 'wa-h7-inactive',
                  label: '[H+7] 7 Hari Tanpa Aktivitas QRIS',
                  sub: 'Ke Bu Ratna & Pak Joko untuk reaktivasi',
                  roleSwitch: 'merchant',
                },
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => {
                    if (w.roleSwitch && s.role !== w.roleSwitch) {
                      setRole(w.roleSwitch);
                    }
                    actions.triggerWhatsApp(w.id);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 p-2 text-left text-xs transition hover:bg-emerald-100 active:scale-[0.99]"
                >
                  <div>
                    <p className="font-bold text-emerald-950 text-[11px]">{w.label}</p>
                    <p className="text-[9px] text-emerald-700">{w.sub}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold text-emerald-600">Kirim 💬</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Simulasi Event Backend */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Simulasi event backend</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SimButton onClick={() => actions.testScan()} disabled={!s.merchant.issued}>
                Scan uji Rp1.000
              </SimButton>
              <SimButton onClick={() => actions.receivePayment(12000)} disabled={!s.merchant.issued}>
                Pelanggan bayar Rp12.000 (Tahap 1)
              </SimButton>
              <SimButton
                onClick={() => actions.completeStage2()}
                disabled={!s.merchant.issued || !s.referrals.find((r) => r.id === s.nominatedId && r.stage === 1)}
              >
                5 tx &amp; audit lolos (Tahap 2)
              </SimButton>
              <SimButton onClick={() => go('bizprofile')} disabled={!s.merchant.issued}>
                Profil Bisnis Pak Joko
              </SimButton>
              <SimButton onClick={actions.reset}>Reset prototipe</SimButton>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {s.merchant.issued
                ? 'Sistem 2 Tahap: Transaksi pertama ≥ Rp10.000 mencairkan reward Tahap 1. Kemudian 5 transaksi unik & audit mencairkan reward Tahap 2.'
                : 'Terbitkan QRIS dulu di peran Pak Joko agar simulasi transaksi & profil bisnis aktif.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Phone
            toast={s.toast}
            soundbox={s.soundbox}
            whatsappPush={s.whatsappPush}
            onOpenWhatsApp={actions.openWhatsApp}
            onDismissWhatsApp={actions.dismissWhatsAppPush}
            activeWhatsAppChat={s.activeWhatsAppChat}
            onCloseWhatsApp={actions.closeWhatsApp}
            go={go}
          >
            <Screen key={s.screen} {...ctx} />
          </Phone>
          <p className="max-w-[22rem] text-center text-xs text-slate-500">
            Sedang melihat sebagai <strong>{role.label}</strong> · layar{' '}
            <code className="rounded bg-slate-200 px-1">{s.screen}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

function SimButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="rounded-full border border-dana-200 bg-dana-50 px-3 py-1.5 text-xs font-bold text-dana-700 transition hover:bg-dana-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
    >
      {children}
    </button>
  );
}

/** iPhone-style frame. The screen itself scrolls, the frame does not. */
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
      <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-white">
        <div className="absolute top-2 left-1/2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
        
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

        {soundbox && (
          <div className="absolute inset-x-3 top-12 z-40 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-white shadow-xl">
            <span className="text-lg">🔊</span>
            <span className="text-[11px] leading-snug font-bold">
              Nada DANA: “Pembayaran diterima {new Intl.NumberFormat('id-ID').format(soundbox)} rupiah”
            </span>
          </div>
        )}
        {toast && (
          <div
            className={`absolute inset-x-3 z-40 rounded-2xl bg-slate-900/92 px-4 py-3 text-[11px] leading-snug font-semibold text-white shadow-xl ${
              soundbox || whatsappPush ? 'top-32' : 'top-12'
            }`}
          >
            {toast}
          </div>
        )}
        <div className="no-scrollbar h-full overflow-y-auto overscroll-contain">{children}</div>

        {/* Full WhatsApp Chat View Modal */}
        {activeWhatsAppChat && (
          <WhatsAppChatModal
            chat={activeWhatsAppChat}
            onClose={onCloseWhatsApp}
            go={go}
          />
        )}

        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1.5 w-32 -translate-x-1/2 rounded-full bg-slate-900/25" />
      </div>
    </div>
  );
}
