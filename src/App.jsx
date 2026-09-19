import { useMemo, useRef, useState } from 'react';
import { activeMerchants, claimAll, claimBreakdown, paidTotal, rupiah } from './rewards.js';
import screens from './screens.jsx';

/**
 * One identity per role. Every screen reads the active persona from here, so the
 * host-app screens can never show another persona's name or wallet.
 */
const ROLES = [
  {
    id: 'consumer',
    label: 'Dimas — Konsumen DANA',
    hint: 'Track A · Sahabat Warung (C2B)',
    entry: 'home',
    name: 'Dimas Prasetya',
    initial: 'D',
    store: null,
    balance: 152300,
  },
  {
    id: 'merchant',
    label: 'Pak Joko — DANA Bisnis',
    hint: 'Track B · Mitra Bisnis (B2B)',
    entry: 'bizdash',
    name: 'Joko Santoso',
    initial: 'J',
    store: 'Martabak Pak Joko',
    balance: 96500,
  },
  {
    id: 'referred',
    label: 'Bu Siti — Warung Diundang',
    hint: 'Prospek: KYC Light, QRIS instan & Profil Bisnis',
    entry: 'landing',
    name: 'Siti Aminah',
    initial: 'S',
    store: 'Warung Nasi Bu Siti',
    balance: 0,
  },
];

const roleOf = (id) => ROLES.find((r) => r.id === id);

const SEED_REFERRALS = [
  // Pre-linked to the "referred" role so the cross-role demo works without nominating first.
  {
    id: 0,
    name: 'Warung Nasi Bu Siti',
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
    tx: 3,
    day: 'Aktif 4 hari',
  },
  {
    id: 2,
    name: 'Toko Kelontong Jaya',
    category: 'Toko Kelontong',
    phone: '0857••••7788',
    stage: 2,
    claimedStage: 2,
    tx: 41,
    day: 'Aktif 18 hari',
  },
  {
    id: 3,
    name: 'Kopi Pak Rudi',
    category: 'F&B / Warung Makan',
    phone: '0813••••2210',
    stage: 1,
    claimedStage: 0,
    tx: 0,
    day: 'Daftar 3 hari lalu',
  },
  {
    id: 4,
    name: 'Bengkel Motor Jaya Abadi',
    category: 'Jasa / Bengkel',
    phone: '0898••••3345',
    stage: 2,
    claimedStage: 2,
    tx: 96,
    day: 'Aktif 28 hari',
  },
];

const initialState = () => ({
  role: 'consumer',
  screen: 'home',
  referrals: SEED_REFERRALS.map((r) => ({ ...r })),
  // Dompet per persona, reward masuk otomatis ke akun pengundang.
  balances: Object.fromEntries(ROLES.map((r) => [r.id, r.balance])),
  // Siapa yang mengundang warung ini; dipakai di seluruh sisi warung.
  inviter: roleOf('consumer').name,
  nominatedId: 0,
  // The warung on the receiving end of the invitation.
  merchant: {
    name: 'Warung Nasi Bu Siti',
    category: 'F&B / Warung Makan',
    location: '',
    issued: false,
    testScan: false,
    firstPayment: 0,
    modalBonus: 0,
  },
  soundbox: null,
  toast: null,
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

    /** Transaksi pelanggan pertama: jika >= Rp10.000, reward Rp10.000 langsung masuk otomatis ke saldo referrer */
    receivePayment: (amount = 12000) => {
      const qualifies = amount >= 10000;

      patch((prev) => {
        const target = prev.referrals.find((r) => r.id === prev.nominatedId);
        const willPromote = target && target.stage < 2 && qualifies;

        return {
          merchant: { ...prev.merchant, firstPayment: amount, modalBonus: 0 },
          balances: {
            ...prev.balances,
            // Reward Rp10.000 otomatis masuk ke saldo DANA pengundang (consumer / inviter)
            consumer: prev.balances.consumer + (willPromote ? 10000 : 0),
            // Uang pembayaran masuk ke saldo DANA Bisnis merchant
            referred: prev.balances.referred + amount,
          },
          referrals: prev.referrals.map((r) =>
            r.id === prev.nominatedId && r.stage < 2
              ? { ...r, stage: qualifies ? 2 : 1, claimedStage: qualifies ? 2 : 0, tx: r.tx + 1, day: 'Aktif hari ini' }
              : r,
          ),
        };
      });

      announce(amount);
      notify(
        qualifies
          ? `🎉 Pembayaran ${rupiah(amount)} diterima! Reward Rp10.000 telah otomatis masuk ke Saldo DANA pengundang.`
          : `Pembayaran ${rupiah(amount)} diterima (belum memenuhi syarat minimal Rp10.000).`,
      );
    },

    nudge: (referral) =>
      notify(
        referral.stage === 0
          ? `WhatsApp terbuka: "Halo, ini link pendaftaran DANA Bisnis untuk ${referral.name}. Tinggal konfirmasi ya, QRIS-nya langsung jadi."`
          : `WhatsApp terbuka: "Halo ${referral.name}, QRIS DANA Bisnis-nya sudah aktif! Nanti saya bayar pakai DANA ya, agar dapat benefit operasional 0% MDR."`,
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
            Prototipe interaktif yang mengembangkan fitur <strong>Affiliate DANA Bisnis</strong>: tetap memakai runtime Mini Program dan 4 tab bawah, dengan fitur <em>Bantu Daftarkan</em>, KYC Light tanpa syarat e-KTP di awal (Rp0), reward Rp10.000 otomatis masuk saldo setelah transaksi pertama ≥Rp10.000, serta panduan step-by-step di profil bisnis merchant.
          </p>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Pilih peran pengguna</p>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${s.role === r.id
                  ? 'border-dana-500 bg-white shadow-lg shadow-dana-500/10'
                  : 'border-slate-200 bg-white/60 hover:border-slate-300'
                  }`}
              >
                <span className="block text-sm font-bold text-slate-900">{r.label}</span>
                <span className="block text-xs text-slate-500">{r.hint}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Simulasi event backend</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <SimButton onClick={() => actions.testScan()} disabled={!s.merchant.issued}>
                Scan uji Rp1.000
              </SimButton>
              <SimButton onClick={() => actions.receivePayment(12000)} disabled={!s.merchant.issued}>
                Pelanggan bayar Rp12.000
              </SimButton>
              <SimButton onClick={() => go('bizprofile')} disabled={!s.merchant.issued}>
                Profil Bisnis Bu Siti
              </SimButton>
              <SimButton onClick={actions.reset}>Reset prototipe</SimButton>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {s.merchant.issued
                ? 'KYC Light = Rp0. Begitu transaksi pertama ≥ Rp10.000 tercatat, reward Rp10.000 otomatis masuk ke Saldo DANA referrer.'
                : 'Terbitkan QRIS dulu di peran Bu Siti agar simulasi transaksi & profil bisnis aktif.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Phone toast={s.toast} soundbox={s.soundbox}>
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
function Phone({ children, toast, soundbox }) {
  return (
    <div className="relative h-[820px] w-[394px] shrink-0 rounded-[3.2rem] border-[3px] border-slate-700 bg-slate-900 p-[10px] shadow-2xl shadow-slate-500/40">
      <div className="relative h-full w-full overflow-hidden rounded-[2.6rem] bg-white">
        <div className="absolute top-2 left-1/2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-slate-900" />
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
            className={`absolute inset-x-3 z-40 rounded-2xl bg-slate-900/92 px-4 py-3 text-[11px] leading-snug font-semibold text-white shadow-xl ${soundbox ? 'top-30' : 'top-12'
              }`}
          >
            {toast}
          </div>
        )}
        <div className="no-scrollbar h-full overflow-y-auto overscroll-contain">{children}</div>
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1.5 w-32 -translate-x-1/2 rounded-full bg-slate-900/25" />
      </div>
    </div>
  );
}
