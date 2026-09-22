/**
 * Replicas of the DANA host-app screens that are already settled in production
 * (audited from context/IMG_8049, IMG_8050, IMG_8055, IMG_8058). Layout, labels,
 * and ordering follow the real app; only the promo slots carry this program's
 * campaign material.
 */
import { useState } from 'react';
import { MAX_PER_REFERRAL, PERSONA_REWARDS, rupiah, TIERS } from './rewards.js';
import { HostNav, Icon, ServiceTile, Shell, StatusBar } from './ui.jsx';

/* ------------------------------------------------------------ Home */

const HOME_SHORTCUTS = [
  { label: 'Skin Mission', icon: 'gift', tone: 'red' },
  { label: 'DANA CICIL', icon: 'wallet', tone: 'dana', badge: 'NEW' },
  { label: 'Apple Zone', icon: 'cart', tone: 'dark' },
  { label: 'Pulsa & Data', icon: 'bolt', tone: 'rose', nav: 'receipt_data' },
  { label: 'DANA Deals', icon: 'ticket', tone: 'orange' },
  { label: 'Travel', icon: 'plane', tone: 'violet' },
  { label: 'Referral Merchant', icon: 'users', tone: 'blue', nav: 'hub' },
  { label: 'View All', icon: 'more', tone: 'slate', nav: 'grid' },
];

const FEED_LINES = [
  'Feed hi 👋, ready to explore our exciting feed?',
  'Feed give a 💬, ❤️, 🎁 to spread joy!',
  'Feed connect only with trusted connection!',
  'Feed come on in for the latest updates!',
];

/** Kartu promo program ini — mengisi slot promo bawaan aplikasi. */
function ProgramHeroBanner({ onClick }) {
  return (
    <button onClick={onClick} className="relative mt-5 w-full overflow-hidden px-5 pb-2 text-left">
      <span className="absolute -top-6 right-2 h-32 w-32 rounded-full bg-white/10" />
      <p className="text-2xl leading-tight font-extrabold text-white">
        Ajak <span className="text-amber-300">Warung Langganan</span>
      </p>
      <p className="text-2xl leading-tight font-extrabold text-amber-300">
        Dapat Saldo s/d {rupiah(MAX_PER_REFERRAL)}
      </p>
      <span className="mt-2 inline-block rounded-full border-2 border-amber-200 bg-amber-400 px-4 py-1.5 text-xs font-extrabold text-amber-900">
        AJAK SEKARANG
      </span>
      <p className="mt-2 text-[9px] text-white/70">
        Tahap 1: Rp5.000 (QRIS &amp; tx ≥Rp10k) · Tahap 2: Rp30.000 (5 tx &amp; validasi). S&amp;K berlaku.
      </p>
      <span className="absolute right-4 bottom-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15">
        <Icon name="store" className="h-10 w-10 text-white" />
      </span>
    </button>
  );
}

function ProgramWideBanner({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative mt-3 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-dana-600 to-dana-900 p-4 text-left text-white"
    >
      <span className="absolute -top-8 -right-4 h-28 w-28 rounded-full bg-white/10" />
      <p className="text-[10px] font-bold text-amber-300">SAHABAT WARUNG</p>
      <p className="mt-1 text-base leading-tight font-extrabold">
        Warung langganan belum punya QRIS?
        <br />
        Bantu daftarkan, 3 data saja.
      </p>
      <p className="mt-1 text-[10px] text-white/80">
        Raih Saldo DANA hingga {rupiah(MAX_PER_REFERRAL)} per warung ({rupiah(TIERS[0].amount)} cair otomatis di
        transaksi pertama).
      </p>
      <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-dana-700">
        Bantu Daftarkan <Icon name="next" className="h-3 w-3" />
      </span>
    </button>
  );
}

export function Home({ s, user, go, notify }) {
  const [hidden, setHidden] = useState(false);
  return (
    <Shell className="overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain">
        <div className="bg-dana-500 pb-4 text-white">
          <StatusBar dark />
          <div className="flex items-center gap-2 px-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <span className="h-3.5 w-4 rounded-[3px] bg-dana-500" />
            </span>
            <span className="text-xl font-extrabold">{hidden ? 'Rp ••••••' : `Rp ${new Intl.NumberFormat('id-ID').format(user.balance)}`}</span>
            <button onClick={() => setHidden(!hidden)} aria-label="Sembunyikan saldo" className="p-1">
              <Icon name={hidden ? 'eyeOff' : 'eye'} className="h-4 w-4" />
            </button>
            <span className="flex-1" />
            <button
              onClick={() => notify('Daily reward berhasil diklaim!')}
              className="relative rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold"
            >
              Get daily reward!
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>

          <div className="mt-5 flex px-5">
            {[
              ['topup', 'Top Up'],
              ['request', 'Request'],
              ['send', 'Send'],
              ['inbox', 'Inbox'],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() => {
                  if (icon === 'inbox') go('inbox');
                  else if (icon === 'topup') go('receipt_emoney');
                  else if (icon === 'request') notify('Fitur Minta Saldo DANA.');
                  else if (icon === 'send') notify('Fitur Kirim Saldo DANA.');
                  else notify(`Fitur ${label} DANA.`);
                }}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40">
                  <Icon name={icon} />
                </span>
                <span className="text-[11px] font-semibold">{label}</span>
              </button>
            ))}
          </div>

          <ProgramHeroBanner onClick={() => go('hub')} />
        </div>

        <div className="px-3 pb-4">
          <div className="-mt-2 rounded-2xl bg-white p-4 shadow-sm">
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {HOME_SHORTCUTS.map((sc) => (
                <ServiceTile
                  key={sc.label}
                  {...sc}
                  onClick={() => (sc.nav ? go(sc.nav) : notify(`Layanan ${sc.label} akan segera hadir.`))}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-3 shadow-sm">
            {FEED_LINES.map((line) => (
              <div key={line} className="flex items-center gap-2 py-1.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dana-500">
                  <span className="h-2 w-2.5 rounded-[2px] bg-white" />
                </span>
                <span className="flex-1 truncate text-[11px] text-slate-700">{line}</span>
                <Icon name="sound" className="h-3.5 w-3.5 text-dana-500" />
              </div>
            ))}
          </div>

          <ProgramWideBanner onClick={() => go('hub')} />

          <button
            onClick={() => notify('DANA Protection melindungi akun dan seluruh transaksi Anda 100%.')}
            className="mt-3 flex w-full items-center gap-2 rounded-2xl bg-dana-500 px-4 py-3 text-left text-white"
          >
            <Icon name="shield" className="h-4 w-4" />
            <span className="flex-1 text-xs font-semibold">Get info about DANA Protection</span>
            <Icon name="next" className="h-4 w-4" />
          </button>

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-xs text-slate-400">
              <Icon name="search" className="h-4 w-4" /> A stranger reaching out?
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Icon name="shield" className="h-5 w-5 text-dana-600" />
              <span className="flex-1 text-sm font-extrabold text-dana-600">DANA PROTECTION</span>
              <span className="flex overflow-hidden rounded-md border border-dana-500 text-[10px] font-bold">
                <span className="bg-dana-500 px-2 py-1 text-white">25%</span>
                <span className="px-2 py-1 text-dana-600">UPGRADE</span>
              </span>
            </div>
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-base font-extrabold text-slate-900">DANA Deals</p>
                <p className="text-[11px] text-slate-500">Best vouchers around your area!</p>
              </div>
              <button
                onClick={() => notify('Membuka katalog promo DANA Deals terdekat.')}
                className="rounded-lg border border-dana-500 px-3 py-1.5 text-[11px] font-bold text-dana-600"
              >
                EXPLORE
              </button>
            </div>
            {[
              ['Voucher Belanja', 'Rp50.000', 'Rp40.000', '455 m', 'bg-amber-300'],
              ['Voucher Perkakas', 'Rp25.000', 'Rp20.000', '717 m', 'bg-amber-400'],
            ].map(([title, face, price, distance, color]) => (
              <div key={title} className="mt-3 flex overflow-hidden rounded-xl border border-slate-100">
                <div className={`flex-1 p-3 ${color}`}>
                  <p className="text-[11px] font-bold text-slate-800">{title}</p>
                  <p className="text-lg leading-none font-extrabold text-slate-900">{face}</p>
                  <p className="text-[10px] text-slate-700">Shopping Voucher</p>
                </div>
                <div className="flex w-24 flex-col items-center justify-center bg-white">
                  <p className="text-sm font-extrabold text-dana-600">{price}</p>
                  <p className="flex items-center gap-0.5 text-[10px] text-slate-500">
                    <Icon name="pin" className="h-3 w-3 text-red-500" />
                    {distance}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-base font-extrabold text-slate-900">What's New</p>
                <p className="text-[11px] text-slate-500">The best news of the week!</p>
              </div>
              <button
                onClick={() => notify('Semua pembaruan berita & promo DANA.')}
                className="rounded-lg border border-dana-500 px-3 py-1.5 text-[11px] font-bold text-dana-600"
              >
                VIEW ALL
              </button>
            </div>
            {[
              {
                icon: 'users',
                tone: 'bg-dana-50 text-dana-600',
                title: 'Ajak Warung Langganan',
                desc: `Bantu daftarkan, dapat Saldo s/d ${rupiah(MAX_PER_REFERRAL)}`,
                nav: 'hub',
              },
              {
                icon: 'bolt',
                tone: 'bg-rose-50 text-rose-600',
                title: 'Beli Paket Internet (Kena Admin)',
                desc: 'Konfirmasi bayar & tombol coba bebas admin',
                nav: 'receipt_data',
              },
              {
                icon: 'wallet',
                tone: 'bg-amber-50 text-amber-600',
                title: 'Top Up E-Money (Kena Admin)',
                desc: 'Konfirmasi bayar & tombol coba bebas admin',
                nav: 'receipt_emoney',
              },
              {
                icon: 'ticket',
                tone: 'bg-orange-50 text-orange-500',
                title: 'DANA Deals Mingguan',
                desc: 'Voucher terbaik di sekitarmu',
              },
            ].map((row) => (
              <button
                key={row.title}
                onClick={() => (row.nav ? go(row.nav) : notify(`Fitur ${row.title} akan segera hadir.`))}
                className="mt-3 flex w-full items-center gap-3 text-left"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${row.tone}`}>
                  <Icon name={row.icon} />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold text-slate-800">{row.title}</span>
                  <span className="block text-[10px] text-slate-500">{row.desc}</span>
                </span>
                {row.nav && <span className="text-[10px] font-bold text-dana-600">Lihat</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <HostNav active="Home" go={go} notify={notify} />
    </Shell>
  );
}

/* --------------------------------------------------- All Services */

const SERVICE_GROUPS = [
  {
    title: 'Mini Games',
    items: [
      { label: 'mgames', icon: 'game', tone: 'amber' },
      { label: 'GGames', icon: 'game', tone: 'violet' },
      { label: 'Lumi Games', icon: 'game', tone: 'blue', badge: 'BARU' },
      { label: 'Jolibox Games', icon: 'game', tone: 'violet', badge: 'BARU' },
      { label: 'Joy Games', icon: 'game', tone: 'orange' },
      { label: 'Free Prize', icon: 'gift', tone: 'emerald' },
      { label: 'Skin Mission', icon: 'gift', tone: 'red' },
      { label: 'Lucky Jump', icon: 'trophy', tone: 'rose' },
    ],
  },
  {
    title: 'Lifestyle & Deals',
    items: [
      { label: 'Kopi Kenangan', icon: 'coffee', tone: 'red' },
      { label: 'TOMORO', icon: 'coffee', tone: 'orange' },
      { label: 'Aice', icon: 'heart', tone: 'blue' },
      { label: 'A+ Rewards', icon: 'gift', tone: 'violet' },
      { label: 'Halodoc', icon: 'heart', tone: 'rose' },
      { label: 'DANA Deals', icon: 'ticket', tone: 'orange' },
      { label: 'Nearby', icon: 'pin', tone: 'red' },
      { label: 'DANA Points', icon: 'trophy', tone: 'amber' },
      { label: 'Daily Prize', icon: 'gift', tone: 'rose' },
      { label: 'Tempo', icon: 'doc', tone: 'red' },
      { label: 'Patungan', icon: 'users', tone: 'dana' },
      { label: 'Jobseeker Partners', icon: 'person', tone: 'violet' },
      { label: 'Referral Merchant', icon: 'users', tone: 'blue', nav: 'hub' },
      { label: 'iBlooming', icon: 'heart', tone: 'dana' },
      { label: 'Kirim Barang by VELO', icon: 'send', tone: 'amber' },
      { label: 'Edit Foto Jualan', icon: 'camera', tone: 'violet' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'DANA Bisnis', icon: 'store', tone: 'dana', nav: 'bizdash' },
      { label: 'DANA CICIL', icon: 'wallet', tone: 'dana' },
      { label: 'eMAS', icon: 'wallet', tone: 'amber' },
      { label: 'Reksa Dana', icon: 'doc', tone: 'emerald' },
      { label: 'DANA Protection', icon: 'shield', tone: 'blue' },
      { label: 'Kartu Kredit', icon: 'wallet', tone: 'slate' },
    ],
  },
  {
    title: 'Travel & Transportation',
    items: [
      { label: 'Travel', icon: 'plane', tone: 'violet' },
      { label: 'Tiket.com', icon: 'plane', tone: 'blue' },
      { label: 'PELNI', icon: 'send', tone: 'dana' },
      { label: 'Traveloka Flight', icon: 'plane', tone: 'blue' },
    ],
  },
];

export function Grid({ go, notify }) {
  return (
    <Shell>
      <div className="bg-dana-500 pb-3 text-white">
        <StatusBar dark />
        <div className="flex items-center px-4">
          <button onClick={() => go('home')} aria-label="Kembali" className="p-1">
            <Icon name="back" className="h-6 w-6" />
          </button>
          <p className="flex-1 text-center text-lg font-extrabold">All Services</p>
          <button onClick={() => notify('Fitur pencarian layanan akan segera hadir.')} aria-label="Cari" className="p-1">
            <Icon name="search" className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="space-y-3 px-3 py-3">
        {SERVICE_GROUPS.map((g) => (
          <div key={g.title} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="mb-4 text-base font-extrabold text-slate-900">{g.title}</p>
            <div className="grid grid-cols-4 gap-x-2 gap-y-4">
              {g.items.map((it) => (
                <ServiceTile
                  key={it.label}
                  {...it}
                  onClick={() => (it.nav ? go(it.nav) : notify(`Layanan ${it.label} akan segera hadir.`))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ------------------------------------------------- Me / DANA Bisnis */

/* ------------------------------------------------- Me / DANA Bisnis */

/** Guide untuk Merchant / Referee (Pak Joko) sesuai AIDA Stages */
export function MerchantAidaGuide({ isOpen, onClose, onAction }) {
  const [step, setStep] = useState(0);
  if (!isOpen) return null;

  const slides = [
    {
      tag: '[A] ATTENTION · KESADARAN USAHA',
      title: 'Pembeli Cari QRIS? Jangan Sampai Pindah!',
      subtitle: 'Pelanggan masa kini lebih suka bayar non-tunai lewat HP. Beralih ke QRIS DANA Bisnis sekarang!',
      visual: (
        <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-xl">
              🏪
            </span>
            <div className="flex-1 text-left text-xs">
              <p className="font-bold text-amber-200">Warung Nasi Pak Joko</p>
              <p className="text-[10px] text-white/80 leading-snug">
                Bebas repot uang receh kembalian, transaksi langsung beres!
              </p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-white/10 p-1.5 text-center text-[9px] font-semibold">
            <span>🚀 Tanpa Palsu</span>
            <span>📱 Kasir Cepat</span>
            <span>👥 Pembeli Suka</span>
          </div>
        </div>
      ),
    },
    {
      tag: '[I] INTEREST · KETERTARIKAN FITUR',
      title: '1 QRIS Semua Bank, 0% MDR & Nada DANA',
      subtitle: 'Terima BCA, BRI, Mandiri, DANA, GoPay, OVO. Uang jualan 100% utuh tanpa potongan MDR!',
      visual: (
        <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md space-y-1.5 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">💳 Semua Bank &amp; E-Wallet</span>
            <span className="font-bold text-emerald-300 text-[11px]">1 QRIS Nasional ✓</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">💰 Potongan Transaksi</span>
            <span className="font-bold text-amber-300 text-[11px]">0% MDR (Gratis Rp0) ✓</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">🔊 Notifikasi Pembayaran</span>
            <span className="font-bold text-emerald-300 text-[11px]">Nada DANA Otomatis ✓</span>
          </div>
        </div>
      ),
    },
    {
      tag: '[D] DESIRE · MANFAAT & BONUS KHUSUS',
      title: `${PERSONA_REWARDS.referred.tahap1.title} & ${PERSONA_REWARDS.referred.tahap2.title}`,
      subtitle: `Tahap 1: ${PERSONA_REWARDS.referred.tahap1.benefit}. Tahap 2: ${PERSONA_REWARDS.referred.tahap2.benefit} sebulan!`,
      visual: (
        <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-amber-300/40 bg-white/15 p-2">
              <p className="text-[9px] font-bold text-amber-200">TAHAP 1</p>
              <p className="mt-0.5 text-sm font-black text-white">{PERSONA_REWARDS.referred.tahap1.title}</p>
              <p className="text-[9px] text-emerald-300 font-bold">{PERSONA_REWARDS.referred.tahap1.extra}</p>
            </div>
            <div className="rounded-lg border border-emerald-300/40 bg-white/15 p-2">
              <p className="text-[9px] font-bold text-emerald-200">TAHAP 2</p>
              <p className="mt-0.5 text-sm font-black text-white">{PERSONA_REWARDS.referred.tahap2.title}</p>
              <p className="text-[9px] text-amber-300 font-bold">Listrik, Pulsa, Bank</p>
            </div>
          </div>
          <p className="mt-2 text-center text-[9px] text-white/80">
            ⏰ Seluruh kupon reward berlaku 1 bulan (30 hari).
          </p>
        </div>
      ),
    },
    {
      tag: '[A] ACTION · LANGKAH NYATA KASIR',
      title: 'Pajang Poster QRIS & Mulai Transaksi!',
      subtitle: 'Unduh poster meja kasir (PDF A6), pajang di warung, dan terima transaksi pertama min. Rp10.000!',
      visual: (
        <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md space-y-1.5">
          {[
            ['1', 'Unduh poster meja kasir (PDF A6) atau buka di layar HP.'],
            ['2', 'Pajang poster di meja kasir warung agar mudah di-scan.'],
            ['3', 'Terima pembayaran pertama min. Rp10.000 untuk aktifkan reward!'],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-2 rounded-lg bg-white/15 p-1.5 text-xs">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-black text-slate-900">
                {num}
              </span>
              <p className="text-[10px] font-semibold text-white/90 leading-tight">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const curr = slides[step];

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1B4E9B] via-[#0D7AD0] to-[#064E8A] text-white animate-in fade-in duration-200">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />

      {/* Tap zones for left/right navigation */}
      <div
        onClick={() => step > 0 && setStep(step - 1)}
        className="absolute inset-y-16 left-0 w-1/2 z-10 cursor-pointer"
        aria-label="Slide sebelumnya"
      />
      <div
        onClick={() => step < slides.length - 1 && setStep(step + 1)}
        className="absolute inset-y-16 right-0 w-1/2 z-10 cursor-pointer"
        aria-label="Slide berikutnya"
      />

      <div className="relative z-20 pt-3 px-4 shrink-0">
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Slide ${i + 1}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25 transition-all"
            >
              <div
                className={`h-full transition-all duration-300 ${step === i ? 'w-full bg-white shadow-sm' : step > i ? 'w-full bg-white/90' : 'w-0'
                  }`}
              />
            </button>
          ))}
        </div>

        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#1B4E9B]">
              D
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-white/90">
              PANDUAN USAHA PAK JOKO (AIDA)
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-white backdrop-blur-xs transition hover:bg-white/25 active:scale-95"
          >
            LEWATI <Icon name="close" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto no-scrollbar px-4 py-2 flex flex-col justify-center">
        <div>
          <div className="inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[8px] font-black tracking-widest uppercase text-amber-200">
            {curr.tag}
          </div>
          <h2 className="mt-1.5 text-base font-black leading-tight text-white">{curr.title}</h2>
          <p className="mt-1 text-[11px] text-white/85 leading-snug">{curr.subtitle}</p>

          <div className="mt-2.5">{curr.visual}</div>
        </div>
      </div>

      <div className="relative z-20 shrink-0 px-4 pb-4 pt-1">
        {step === slides.length - 1 ? (
          <button
            onClick={() => {
              onClose();
              if (onAction) onAction();
            }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-300 py-3 text-center text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/30 transition active:scale-98"
          >
            Buka QRIS Toko Saya Sekarang! <Icon name="qr" className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/20 py-2.5 text-center text-xs font-bold text-white transition active:bg-white/30"
          >
            Lanjut ke Langkah Berikutnya →
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------- Modal Verifikasi Foto QRIS Kasir (Tahap 2) */

export function QrisCashierVerificationModal({ isOpen, onClose, onConfirm, merchant }) {
  if (!isOpen) return null;
  const storeName = merchant?.name || 'Warung Sembako Pak Joko';

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-xs text-slate-900 animate-in fade-in duration-200 justify-end">
      <div className="w-full rounded-t-[2.5rem] bg-white p-5 shadow-2xl max-h-[92%] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white text-base shadow-sm">
              📸
            </span>
            <div>
              <p className="text-xs font-extrabold text-slate-900">Verifikasi Meja Kasir (Tahap 2)</p>
              <p className="text-[10px] text-slate-400">Bukti Fisik QRIS Terpasang di Meja Warung</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        {/* Store badge */}
        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-2.5">
          <div>
            <p className="text-xs font-bold text-slate-900">{storeName}</p>
            <p className="text-[10px] text-slate-500">Jl. Tebet Barat Dalam VIII No.12, Jakarta Selatan</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700">
            GPS MATCH ✓
          </span>
        </div>

        {/* Visual Photo Card of Warung Cashier */}
        <div className="relative mt-3 overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-950 text-white shadow-md">
          {/* Simulated Photo of Cashier Desk */}
          <div className="relative h-44 w-full bg-gradient-to-t from-slate-900 via-amber-950/40 to-slate-800 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between opacity-80">
              <span className="text-[9px] font-mono tracking-widest text-slate-300">
                AUDIT-MEJA-KASIR · 1080P HDR
              </span>
              <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> VALID
              </span>
            </div>

            {/* Standee in foreground */}
            <div className="mx-auto flex flex-col items-center">
              <div className="relative rounded-xl border-2 border-white/80 bg-white p-2 text-slate-900 shadow-2xl">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-0.5">
                  <span className="text-[8px] font-black tracking-wider text-dana-600">QRIS DANA BISNIS</span>
                  <span className="text-[7px] font-bold text-slate-400">ASPI</span>
                </div>
                <div className="my-1 flex h-12 w-12 items-center justify-center bg-slate-900 text-white font-mono text-[7px] rounded">
                  [ QRIS ]
                </div>
                <p className="text-center text-[7px] font-extrabold text-slate-800 truncate max-w-[65px]">
                  {storeName}
                </p>
                {/* Acrylic Stand Base */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-md bg-slate-300/90 border border-slate-400 shadow-xs" />
              </div>
            </div>

            {/* Counter Desk Simulation */}
            <div className="rounded-lg bg-amber-900/60 p-1.5 backdrop-blur-xs border border-white/15">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-amber-200 uppercase">
                  ✓ QRIS Terpajang di Meja Kasir
                </span>
                <span className="text-[8px] text-slate-300">Stempel Audit DANA Bisnis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 p-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">1. Transaksi Pembeli Berbeda:</span>
            <span className="font-extrabold text-emerald-600">5 / 5 Unik ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">2. Standee QRIS Meja Kasir:</span>
            <span className="font-extrabold text-emerald-600">Terpasang Rapi ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">3. Audit Anti-Fraud:</span>
            <span className="font-extrabold text-emerald-600">Lolos Verifikasi ✓</span>
          </div>
        </div>

        {/* Unlocked rewards summary */}
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900">
          <p className="font-bold">🎁 Reward Terbuka Pasca Konfirmasi:</p>
          <p className="mt-0.5 text-[10px] text-emerald-800 leading-snug">
            • <b>Pak Joko</b>: Kupon 10x Bebas Biaya Admin (Listrik PLN, Pulsa, TF Bank)<br />
            • <b>Pengundang</b>: Saldo DANA Rp30.000 (Rian) / 10x Bebas Admin (Bu Ratna)
          </p>
        </div>

        {/* Confirm Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/30 active:scale-98 transition"
          >
            Konfirmasi &amp; Klaim Reward Tahap 2 ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export function BizDash({
  s,
  user,
  go,
  notify,
  initialTour = false,
  completeBizGuide,
  completeStage2,
  receivePayment,
  mark,
  progress,
}) {
  const isReferred = user?.id === 'referred' || s?.role === 'referred';
  const isMerchant = user?.id === 'merchant' || s?.role === 'merchant';
  const m = s?.merchant || {};

  // Interactive Bubble Chat state (Step 9)
  const [showBubbleGuide, setShowBubbleGuide] = useState(Boolean(initialTour || isReferred));
  const [bubbleStep, setBubbleStep] = useState(0);

  const storeName = isMerchant
    ? (user?.store || 'Martabak Bu Ratna')
    : (m.name || user?.store || 'Warung Sembako Pak Joko');
  const storeCategory = isMerchant ? 'F&B / Martabak' : (m.category || 'Toko Kelontong');

  const myReferral = s?.referrals?.find(
    (r) => r.name === storeName || r.name?.toLowerCase().includes('joko') || r.id === 0
  );
  const stage2Done = (myReferral?.stage ?? 0) >= 2 || Boolean(progress?.stage2_verify || progress?.stage2);
  const storeStatus = isMerchant
    ? 'NMID ID1023288765432 · Merchant aktif'
    : (stage2Done
      ? 'NMID ID1023288765432 · Merchant Juara'
      : 'NMID ID1023288765432 · QRIS Aktif (KYC Light)');

  const isPaid = (m.firstPayment || 0) >= 10000;
  const salesAmount = isReferred
    ? (m.firstPayment || 0) + (m.testScan ? 1000 : 0)
    : 486000;
  const txCount = isReferred
    ? (stage2Done ? 5 : (m.firstPayment > 0 ? (m.testScan ? 2 : 1) : (m.testScan ? 1 : 0)))
    : 12;

  const salesLabel = isReferred
    ? (m.firstPayment > 0 ? `Penjualan hari ini · ${txCount} transaksi` : 'Penjualan hari ini · Belum ada transaksi')
    : 'Penjualan hari ini · 12 transaksi';

  const mdrSubtext = isReferred
    ? (isPaid
      ? 'Kupon Tarik Tunai 2x aktif · Siap ditarik ke bank'
      : 'Kupon Tarik Tunai 2x menanti transaksi pertama ≥Rp10k')
    : 'Bebas biaya tarik tunai · saldo bisa langsung ditarik';

  // 4 Quick Actions as requested by user
  const BIZ_ACTIONS = [
    {
      id: 'qris',
      label: 'Buka QRIS',
      icon: 'qr',
      tag: 'PEMBAYARAN DIGITAL',
      title: '1. Buka & Tampilkan QRIS Toko',
      desc: 'Tampilkan QRIS Nasional di layar HP atau unduh poster kasir (PDF A6) untuk dipajang. Pelanggan bisa scan dari semua bank & e-wallet tanpa biaya (0% MDR).',
      action: () => (m.issued || isMerchant ? go('qris') : notify('QRIS toko siap menerima pembayaran digital.')),
    },
    {
      id: 'wallet',
      label: 'Tarik Saldo',
      icon: 'wallet',
      tag: 'PENCAIRAN DANA',
      title: '2. Tarik Hasil Jualan ke Rekening Bank',
      desc: 'Uang penjualan tersimpan aman di DANA Bisnis dan siap ditarik ke rekening bank (BCA, BRI, Mandiri) kapan saja. Gunakan kupon Bebas Biaya Tarik Tunai 2x (Tahap 1)!',
      action: () => notify('Fitur penarikan saldo: gunakan kupon Bebas Biaya Tarik Tunai 2x ke rekening bank.'),
    },
    {
      id: 'send',
      label: 'Transfer',
      icon: 'send',
      tag: 'KULAKAN & SUPPLIER',
      title: '3. Transfer ke Mitra / Supplier Sembako',
      desc: 'Kirim dana belanja stok warung atau transfer ke sesama pengguna DANA & rekening bank supplier langsung dari saldo bisnis tanpa repot ke ATM.',
      action: () => notify('Fitur transfer saldo usaha ke supplier grosir atau rekening lain.'),
    },
    {
      id: 'bolt',
      label: 'Pembayaran',
      sublabel: 'Listrik, Pulsa',
      icon: 'bolt',
      tag: 'TAGIHAN OPERASIONAL',
      title: '4. Pembayaran Listrik PLN, Pulsa & Air',
      desc: 'Bayar kebutuhan operasional warung (token listrik PLN, pulsa kasir, PDAM). Gunakan kupon Bebas Biaya Admin 10x per bulan (Tahap 2)!',
      action: () => notify('Fitur pembayaran: gunakan kupon Bebas Biaya Admin 10x untuk listrik warung & pulsa.'),
    },
  ];

  const handleNextBubble = () => {
    if (bubbleStep < BIZ_ACTIONS.length - 1) {
      setBubbleStep(bubbleStep + 1);
    } else {
      handleFinishBubble();
    }
  };

  const handleFinishBubble = () => {
    setShowBubbleGuide(false);
    if (mark) mark('biz_guide');
    if (completeBizGuide) completeBizGuide();
    notify('🎉 Panduan 4 aksi toko selesai! Fitur siap digunakan.');
  };

  return (
    <Shell className="overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain">
        <div className="bg-[#1B4E9B] pb-6 text-white">
          <StatusBar dark />
          <div className="px-6">
            <div className="mx-auto flex w-56 rounded-full bg-white/15 p-1 text-[12px] font-bold">
              <button onClick={() => go('home')} className="flex-1 rounded-full py-1.5 text-white/70">
                Personal
              </button>
              <button className="flex-1 rounded-full bg-white py-1.5 text-[#1B4E9B]">Bisnis</button>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2">
              <span className="text-xl font-extrabold tracking-wide">DANA</span>
              <span className="flex h-6 w-7 items-center justify-center rounded-full bg-white">
                <span className="h-2.5 w-3 rounded-[2px] bg-[#1B4E9B]" />
              </span>
              <span className="text-xl font-extrabold tracking-wide">BISNIS</span>
            </div>
            <p className="mt-1 text-center text-[12px] font-semibold text-white/85">
              Pembayaran Digital Andalan UMKM
            </p>
          </div>
        </div>

        <div className="-mt-4 space-y-3 px-3 pb-6">
          {/* Card Profil Toko & Penjualan (Highlighted Section) */}
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1B4E9B] text-white shadow-sm">
                  <Icon name="store" className="h-6 w-6" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-slate-900">{storeName}</p>
                    {stage2Done && (
                      <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-black text-amber-800 border border-amber-400">
                        JUARA ⭐
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{storeStatus}</p>
                </div>
              </div>
              {isReferred && (
                <button
                  onClick={() => {
                    setShowBubbleGuide(!showBubbleGuide);
                    if (!showBubbleGuide) setBubbleStep(0);
                  }}
                  className="rounded-full bg-dana-50 px-2.5 py-1 text-[10px] font-bold text-dana-700 active:bg-dana-100 border border-dana-200"
                >
                  {showBubbleGuide ? 'Tutup Guide' : '💬 Panduan Toko'}
                </button>
              )}
            </div>

            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-[11px] text-slate-500">{salesLabel}</p>
              <p className="text-2xl font-extrabold text-slate-900">{rupiah(salesAmount)}</p>
              <p className="text-[10px] font-semibold text-emerald-600">{mdrSubtext}</p>
            </div>

            {/* Bubble Chat Guide - In-Profile Walkthrough for the 4 Actions */}
            {showBubbleGuide && isReferred && (
              <div className="relative mt-3 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 p-3.5 text-slate-900 shadow-lg shadow-amber-500/10 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white text-[10px] shadow-xs">
                      💬
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-950">
                      Panduan Aksi · {storeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[9px] font-extrabold text-amber-950">
                      {bubbleStep + 1} / {BIZ_ACTIONS.length}
                    </span>
                    <button
                      onClick={handleFinishBubble}
                      className="text-amber-800 hover:text-amber-950 text-xs font-bold p-0.5"
                      aria-label="Tutup panduan"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="mt-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-amber-500 px-1.5 py-0.5 text-[8px] font-black text-white uppercase">
                      {BIZ_ACTIONS[bubbleStep].tag}
                    </span>
                    <p className="text-xs font-black text-amber-950">
                      {BIZ_ACTIONS[bubbleStep].title}
                    </p>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-700">
                    {BIZ_ACTIONS[bubbleStep].desc}
                  </p>
                </div>

                {/* Step navigation */}
                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-amber-200/60">
                  <div className="flex gap-1">
                    {BIZ_ACTIONS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setBubbleStep(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === bubbleStep ? 'w-4 bg-amber-500' : 'w-1.5 bg-amber-300'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {bubbleStep > 0 && (
                      <button
                        onClick={() => setBubbleStep(bubbleStep - 1)}
                        className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[10px] font-bold text-amber-900 active:bg-amber-50"
                      >
                        ← Kembali
                      </button>
                    )}
                    {bubbleStep < BIZ_ACTIONS.length - 1 ? (
                      <button
                        onClick={handleNextBubble}
                        className="rounded-lg bg-amber-500 px-3 py-1 text-[10px] font-extrabold text-white shadow-xs active:bg-amber-600"
                      >
                        Lanjut →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishBubble}
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-[10px] font-extrabold text-white shadow-xs active:bg-emerald-700"
                      >
                        Selesai Panduan ✓
                      </button>
                    )}
                  </div>
                </div>

                {/* Downward pointer towards active action button */}
                <div
                  className="pointer-events-none absolute -bottom-2 h-4 w-4 rotate-45 border-r-2 border-b-2 border-amber-400 bg-orange-50 transition-all duration-300"
                  style={{
                    left: `calc(${bubbleStep * 25 + 12.5}% - 8px)`,
                  }}
                />
              </div>
            )}

            {/* 4 Quick Actions Grid */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {BIZ_ACTIONS.map((act, idx) => {
                const isHighlighted = showBubbleGuide && isReferred && bubbleStep === idx;
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      if (showBubbleGuide && isReferred) {
                        setBubbleStep(idx);
                      }
                      act.action();
                    }}
                    className={`flex flex-col items-center gap-1.5 rounded-2xl p-2 transition-all ${
                      isHighlighted
                        ? 'ring-2 ring-amber-400 bg-amber-100/90 shadow-md scale-105 animate-pulse'
                        : 'hover:bg-slate-50 active:scale-95'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                        isHighlighted ? 'bg-amber-400 text-amber-950 font-bold' : 'bg-dana-50 text-dana-600'
                      }`}
                    >
                      <Icon name={act.icon} className="h-4 w-4" />
                    </span>
                    <span className="text-center text-[9px] leading-tight font-semibold text-slate-700">
                      {act.label}
                    </span>
                    {act.sublabel && (
                      <span className="text-center text-[8px] leading-none text-slate-400 -mt-1">
                        {act.sublabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hadiah Tahap 1 & Tahap 2 untuk Pak Joko */}
          {isReferred && (
            <div className="space-y-2.5">
              {/* Card Hadiah Tahap 1 */}
              <div
                className={`rounded-2xl border p-3.5 transition ${
                  isPaid ? 'border-emerald-300 bg-emerald-50/80' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl text-white text-xs font-bold ${
                        isPaid ? 'bg-emerald-600 shadow-xs' : 'bg-slate-400'
                      }`}
                    >
                      {isPaid ? '✓' : '1'}
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-900">Hadiah Tahap 1: Bebas Tarik Tunai 2x</p>
                      <p className="text-[10px] text-slate-500">Nilai: Rp9.000 (2 kupon x Rp4.500) · Bebas potongan</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                      isPaid ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPaid ? 'AKTIF ✓' : 'TERKUNCI 🔒'}
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
                  {isPaid
                    ? '🎉 Pembayaran pertama Rp15.000 masuk! Kupon Gratis Tarik Tunai 2x aktif di tab Reward untuk ditarik ke rekening bank kapan saja.'
                    : 'Terima pembayaran QRIS pertama minimal Rp10.000 untuk mengaktifkan kupon bebas tarik tunai.'}
                </p>
              </div>

              {/* Card Hadiah Tahap 2 */}
              <div
                className={`rounded-2xl border p-3.5 transition ${
                  stage2Done ? 'border-emerald-300 bg-emerald-50/80' : 'border-amber-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl text-white text-xs font-bold ${
                        stage2Done ? 'bg-emerald-600 shadow-xs' : 'bg-amber-500 shadow-xs'
                      }`}
                    >
                      {stage2Done ? '✓' : '2'}
                    </span>
                    <div>
                      <p className="text-xs font-black text-slate-900">Hadiah Tahap 2: Bebas Biaya Admin 10x</p>
                      <p className="text-[10px] text-slate-500">Nilai: Rp25.000 (10 kupon x Rp2.500) · Listrik, Pulsa &amp; TF</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
                      stage2Done ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {stage2Done ? 'AKTIF ✓' : 'PROSES ⏳'}
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-600">
                  {stage2Done
                    ? '🎉 Target 5 transaksi unik tercapai & stiker QRIS terverifikasi! Kupon 10x Bebas Biaya Admin aktif 30 hari.'
                    : 'Kumpulkan 5 transaksi unik dari pembeli berbeda & verifikasi foto QRIS terpajang di kasir warung.'}
                </p>
              </div>

              {/* Buka Tab Reward Button */}
              <button
                onClick={() => go('rewards')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-800 shadow-2xs active:bg-slate-50 transition"
              >
                <span className="flex items-center gap-2">
                  <span>🎁</span> Lihat Rincian Kupon Saya di Tab Reward
                </span>
                <span className="text-dana-600 font-extrabold">Buka →</span>
              </button>
            </div>
          )}

          {/* Banner Program Mitra Bisnis */}
          <button
            onClick={() => go('hub')}
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-dana-600 to-[#1B4E9B] p-4 text-left text-white shadow-sm transition-all duration-300"
          >
            <span className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-white/10" />
            <p className="text-[10px] font-bold text-amber-300">PROGRAM MITRA BISNIS</p>
            <p className="mt-1 text-base leading-tight font-extrabold">
              Ajak rekan usaha sebelah,
              <br />
              raih kupon bebas biaya operasional
            </p>
            <p className="mt-1 text-[10px] text-white/85">
              Tahap 1: {PERSONA_REWARDS.merchant.tahap1.title} (QRIS &amp; tx ≥Rp10k) · Tahap 2:{' '}
              {PERSONA_REWARDS.merchant.tahap2.title} (5 tx &amp; validasi).
            </p>
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-dana-700">
              Buka Program <Icon name="next" className="h-3 w-3" />
            </span>
          </button>

          {/* Keuntungan Mengajak Bisnis Lain */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <p className="text-xs font-bold text-slate-900">Keuntungan Mengajak Bisnis Lain</p>
                <p className="text-[10px] text-slate-500">Benefit eksklusif tokomu saat memperluas jaringan QRIS</p>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-extrabold text-amber-800">
                B2B REWARD
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#1B4E9B] text-white">
                  <Icon name="wallet" className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-900">
                    Kupon Bebas Biaya 2 Tahap / Rekan Usaha
                  </p>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    {PERSONA_REWARDS.merchant.tahap1.benefit} saat rekan terbit QRIS &amp; transaksi pertama ≥Rp10k,
                    lalu {PERSONA_REWARDS.merchant.tahap2.benefit} saat 5 transaksi unik lolos verifikasi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Icon name="gift" className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-900">Ekstra Kupon Bebas Biaya MDR Tokomu</p>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Tiap 1 rekan aktif, tokomu dapat perpanjangan bebas MDR 0% selama 30 hari tambahan, hemat jutaan rupiah.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-dana-600 text-white">
                  <Icon name="shield" className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-900">Prioritas Plafon Modal Usaha &amp; DANA Juara</p>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Menaikkan skor reputasi toko untuk akses limit DANA Cicil Usaha hingga Rp50.000.000 dan prioritas fitur Rekan DANA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kesehatan Merchant */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">Kesehatan Merchant</p>
            {(isReferred
              ? [
                ['Pembayaran QRIS 30 hari', `${txCount} transaksi`],
                ['Pelanggan unik', `${txCount > 0 ? (stage2Done ? 5 : 1) : 0} pembayar`],
                ['Status program mitra', stage2Done ? 'Merchant Juara' : (isPaid ? 'Tahap 1 Selesai' : 'Warung Baru (KYC Light)')],
              ]
              : [
                ['Pembayaran QRIS 30 hari', '312 transaksi'],
                ['Pelanggan unik', '148 pembayar'],
                ['Status program mitra', 'Merchant Juara'],
              ]
            ).map(([k, v]) => (
              <div key={k} className="mt-3 flex justify-between text-xs">
                <span className="text-slate-500">{k}</span>
                <span className="font-bold text-slate-800">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HostNav active="Me" go={go} notify={notify} />
    </Shell>
  );
}
