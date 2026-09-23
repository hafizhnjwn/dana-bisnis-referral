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
  { label: 'Sahabat Warung', icon: 'users', tone: 'blue', nav: 'hub' },
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
      { label: 'Sahabat Warung', icon: 'users', tone: 'blue', nav: 'hub' },
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
      tag: 'PELUANG USAHA',
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
      tag: 'FITUR DANA BISNIS',
      title: '1 QRIS Semua Bank & Nada DANA',
      subtitle: 'Terima BCA, BRI, Mandiri, DANA, GoPay, OVO. Uang jualan langsung masuk utuh tanpa repot receh!',
      visual: (
        <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 backdrop-blur-md space-y-1.5 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">💳 Semua Bank &amp; E-Wallet</span>
            <span className="font-bold text-emerald-300 text-[11px]">1 QRIS Nasional ✓</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">💰 Pendaftaran Toko</span>
            <span className="font-bold text-amber-300 text-[11px]">Gratis Rp0 ✓</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-white/15 px-2.5 py-1.5">
            <span className="text-white/80 text-[11px]">🔊 Notifikasi Pembayaran</span>
            <span className="font-bold text-emerald-300 text-[11px]">Nada DANA Otomatis ✓</span>
          </div>
        </div>
      ),
    },
    {
      tag: 'KEUNTUNGAN MERCHANT',
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
      tag: 'LANGKAH TRANSAKSI',
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
              PANDUAN USAHA PAK JOKO
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

export function QrisCashierVerificationModal({ isOpen, onClose, onConfirm, merchant, has5Tx, txCount = 0 }) {
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
            {has5Tx ? (
              <span className="font-extrabold text-emerald-600">5 / 5 Unik ✓</span>
            ) : (
              <span className="font-bold text-amber-600">{txCount || 1} / 5 (Menunggu 5 transaksi) ⏳</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">2. Standee QRIS Meja Kasir:</span>
            <span className="font-extrabold text-emerald-600">Terpasang Rapi ✓</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">3. Audit Foto Kasir:</span>
            <span className="font-extrabold text-emerald-600">Lolos Verifikasi ✓</span>
          </div>
        </div>

        {/* Unlocked rewards summary */}
        {has5Tx ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-900">
            <p className="font-bold">🎁 Reward Terbuka Pasca Konfirmasi:</p>
            <p className="mt-0.5 text-[10px] text-emerald-800 leading-snug">
              • <b>Pak Joko</b>: Kupon 10x Bebas Biaya Admin (Listrik PLN, Pulsa, TF Bank)<br />
              • <b>Pengundang</b>: Saldo DANA Rp30.000 (Rian) / 10x Bebas Admin (Bu Putu)
            </p>
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
            <p className="font-bold">⏳ Status Syarat Tahap 2:</p>
            <p className="mt-0.5 text-[10px] text-amber-800 leading-snug">
              Foto QRIS kasir akan diverifikasi. Tahap 2 &amp; kupon reward akan aktif setelah warung menyelesaikan total <b>5 transaksi unik</b> ({txCount || 1}/5 saat ini).
            </p>
          </div>
        )}

        {/* Confirm Button */}
        <div className="mt-4">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-3 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/30 active:scale-98 transition"
          >
            {has5Tx ? 'Konfirmasi & Klaim Reward Tahap 2 ✓' : 'Konfirmasi Verifikasi Tempel QRIS ✓'}
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
  patch,
}) {
  const isReferred = user?.id === 'referred' || s?.role === 'referred';
  const isMerchant = user?.id === 'merchant' || s?.role === 'merchant';
  const m = s?.merchant || {};

  const hasCompletedGuide = Boolean(progress?.biz_guide || s?.hasSeenBizGuide);

  // Interactive Bubble Chat state (Step 9) - hanya muncul otomatis jika belum pernah diselesaikan
  const [showBubbleGuide, setShowBubbleGuide] = useState(
    Boolean((initialTour || isReferred) && !hasCompletedGuide)
  );
  const [bubbleStep, setBubbleStep] = useState(0);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const storeName = isMerchant
    ? (user?.store || 'Toko Grosir Bu Putu')
    : (m.name || user?.store || 'Warung Sembako Pak Joko');
  const storeCategory = isMerchant ? 'Grosir Sembako' : (m.category || 'Toko Kelontong');

  const myReferral = s?.referrals?.find(
    (r) => r.name === storeName || r.name?.toLowerCase().includes('joko') || r.id === 0
  );
  const has5Tx = Boolean(progress?.stage2_tx || (myReferral?.tx ?? 0) >= 5);
  const hasVerifyPhoto = Boolean(progress?.stage2_verify);
  const stage2Done = (myReferral?.stage ?? 0) >= 2 || Boolean(progress?.stage2 || (has5Tx && hasVerifyPhoto));
  const storeStatus = isMerchant
    ? 'NMID ID1023288765432 · Sahabat DANA'
    : (stage2Done
      ? 'NMID ID1023288765432 · Sahabat DANA'
      : 'NMID ID1023288765432 · QRIS Aktif (KYC Light)');

  const isPaid = (m.firstPayment || 0) >= 10000;
  const txCount = isReferred
    ? (has5Tx ? 5 : (m.firstPayment > 0 ? (m.testScan ? 2 : 1) : (m.testScan ? 1 : 0)))
    : 12;
  const salesAmount = isReferred
    ? (m.firstPayment || 0) + (m.testScan ? 1000 : 0) + (has5Tx ? 60000 : 0)
    : 486000;

  const salesLabel = isReferred
    ? (m.firstPayment > 0 ? `Penjualan hari ini · ${txCount} transaksi` : 'Penjualan hari ini · Belum ada transaksi')
    : 'Penjualan hari ini · 12 transaksi';

  const cashoutSubtext = isReferred
    ? (isPaid
      ? 'Kupon Tarik Tunai 2x aktif · Siap ditarik ke bank'
      : 'Kupon Tarik Tunai 2x menanti transaksi pertama ≥Rp10k')
    : 'Bebas biaya tarik tunai · saldo bisa langsung ditarik';

  // 3 Tahap Progres DANA Bisnis: Transaksi >= Rp 10k, 5 Transaksi, Tempel QRIS
  const step1Done = Boolean(isPaid || m.firstPayment >= 10000 || progress?.stage1 || stage2Done);
  const step2Done = Boolean(has5Tx || stage2Done);
  const step3Done = Boolean(hasVerifyPhoto || stage2Done);

  const jokoRef = s?.referrals?.find(
    (r) => r.name?.toLowerCase().includes('joko') || r.id === 0
  );
  const isStage1Done = Boolean(
    progress?.stage1 ||
    progress?.stage1_tx ||
    (s?.merchant?.firstPayment || 0) >= 10000 ||
    (jokoRef && (jokoRef.claimedStage >= 1 || (jokoRef.stage >= 1 && (jokoRef.tx || 0) >= 1) || jokoRef.stage >= 2)) ||
    stage2Done
  );
  const merchantHasReward = isStage1Done || stage2Done;

  const completedCount = (step1Done ? 1 : 0) + (step2Done ? 1 : 0) + (step3Done ? 1 : 0);
  const bizProgressPercent = Math.round((completedCount / 3) * 100);

  const BIZ_REWARD_STAGES = [
    { id: 'tx10k', label: 'Transaksi ≥ Rp 10k', done: step1Done },
    { id: 'tx5', label: '5 Transaksi', done: step2Done },
    { id: 'tempel', label: 'Tempel QRIS', done: step3Done },
  ];

  // 4 Quick Actions as requested by user (deskripsi singkat & padat)
  const BIZ_ACTIONS = [
    {
      id: 'qris',
      label: 'Buka QRIS',
      icon: 'qr',
      tag: 'PEMBAYARAN DIGITAL',
      title: '1. QRIS Toko',
      desc: 'Tampilkan QRIS di HP atau cetak poster kasir untuk terima semua bank.',
      action: () => (m.issued || isMerchant ? go('qris') : notify('QRIS toko siap menerima pembayaran digital.')),
    },
    {
      id: 'wallet',
      label: 'Tarik Saldo',
      icon: 'wallet',
      tag: 'PENCAIRAN DANA',
      title: '2. Tarik Saldo',
      desc: 'Cairkan saldo jualan ke rekening bank kapan saja tanpa biaya.',
      action: () => notify('Fitur penarikan saldo: gunakan kupon Bebas Biaya Tarik Tunai 2x ke rekening bank.'),
    },
    {
      id: 'send',
      label: 'Transfer',
      icon: 'send',
      tag: 'KULAKAN & SUPPLIER',
      title: '3. Transfer Bank',
      desc: 'Kirim uang kulakan ke supplier atau mitra langsung dari saldo.',
      action: () => go('transfer'),
    },
    {
      id: 'bolt',
      label: 'Pembayaran',
      sublabel: 'Listrik, Pulsa',
      icon: 'bolt',
      tag: 'TAGIHAN OPERASIONAL',
      title: '4. Bayar Tagihan',
      desc: 'Bayar listrik PLN, pulsa, dan PDAM toko hemat kupon bebas admin.',
      action: () => go('transfer'),
    },
  ];

  // Trust signals mitra DANA Bisnis (3-5 items, horizontal scrollable)
  const TRUST_SIGNALS = [
    {
      id: 'siti',
      tag: 'OMSET NAIK',
      badge: '+20% Pendapatan',
      store: 'Toko Grosir Bu Siti',
      quote: 'Aktivasi QRIS Dana Bisnis meningkatkan pendapatan sampai 20%',
      location: 'Surabaya',
      initial: 'S',
    },
    {
      id: 'munir',
      tag: 'KASIR CEPAT',
      badge: 'Bebas Receh',
      store: 'Warung Madura Cak Munir',
      quote: 'Kasir 2x lebih cepat, pembeli bayar dari bank apa pun uang langsung masuk utuh tanpa repot receh.',
      location: 'Jakarta Barat',
      initial: 'M',
    },
    {
      id: 'anwar',
      tag: 'HEMAT BIAYA',
      badge: 'Bebas Admin',
      store: 'Kios Sembako H. Anwar',
      quote: 'Kupon bebas transfer & bebas biaya admin sangat menghemat biaya operasional kulakan beras mingguan toko kami.',
      location: 'Bandung',
      initial: 'A',
    },
    {
      id: 'minah',
      tag: 'TERPERCAYA',
      badge: 'Anti Uang Palsu',
      store: 'Toko Kelontong Bu Minah',
      quote: 'Pelanggan makin nyaman belanja non-tunai, pembukuan rapi otomatis tanpa risiko uang palsu.',
      location: 'Semarang',
      initial: 'M',
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
    if (patch) patch({ hasSeenBizGuide: true });
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
                  </div>
                  <p className="text-[10px] text-slate-400">{storeStatus}</p>
                </div>
              </div>
              {(isReferred || isMerchant) && (
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
              <p className="text-[10px] font-semibold text-emerald-600">{cashoutSubtext}</p>
            </div>



            {/* Bubble Chat Guide - In-Profile Walkthrough for the 4 Actions (Hanya Deskripsi Saja) */}
            {showBubbleGuide && (isReferred || isMerchant) && (
              <div className="relative mt-2 rounded-xl border border-amber-300 bg-amber-50/95 p-2 text-slate-900 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] leading-snug text-slate-800 font-medium">
                    {BIZ_ACTIONS[bubbleStep].desc}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    {bubbleStep < BIZ_ACTIONS.length - 1 ? (
                      <button
                        onClick={handleNextBubble}
                        className="rounded-md bg-amber-500 px-2 py-0.5 text-[8.5px] font-extrabold text-white shadow-2xs active:bg-amber-600"
                      >
                        Lanjut →
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishBubble}
                        className="rounded-md bg-emerald-600 px-2 py-0.5 text-[8.5px] font-extrabold text-white shadow-2xs active:bg-emerald-700"
                      >
                        Selesai ✓
                      </button>
                    )}
                  </div>
                </div>

                {/* Downward pointer towards active action button */}
                <div
                  className="pointer-events-none absolute -bottom-1 h-2 w-2 rotate-45 border-r border-b border-amber-300 bg-amber-50/95 transition-all duration-300"
                  style={{
                    left: `calc(${bubbleStep * 25 + 12.5}% - 4px)`,
                  }}
                />
              </div>
            )}

            {/* 4 Quick Actions Grid */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {BIZ_ACTIONS.map((act, idx) => {
                const isHighlighted = showBubbleGuide && (isReferred || isMerchant) && bubbleStep === idx;
                return (
                  <button
                    key={act.id}
                    onClick={() => {
                      if (showBubbleGuide && (isReferred || isMerchant)) {
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

          {/* Discovery Banner DANA Sahabat Warung untuk Pemilik DANA Bisnis (Bu Putu) */}
          {isMerchant && (
            <div
              onClick={() => {
                if (mark) mark('open_hub');
                go('hub');
                notify('Membuka DANA Sahabat Warung...');
              }}
              className="rounded-2xl border border-dana-200 bg-gradient-to-r from-dana-500 via-[#108EE9] to-[#0D5995] p-3.5 text-white shadow-sm cursor-pointer transition active:scale-98"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white text-lg backdrop-blur-xs shadow-inner">
                    🏪
                  </span>
                  <div>
                    <span className="inline-block rounded-full bg-amber-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-amber-950">
                      DANA Sahabat Warung
                    </span>
                    <p className="text-xs font-black text-white leading-snug mt-0.5">
                      Ajak usaha sekitarmu, nikmati bebas biaya admin!
                    </p>
                    <p className="text-[9.5px] text-white/85 leading-tight mt-0.5">
                      Bantu rekan usaha pakai QRIS &amp; raih Gratis Transfer 2x + Bebas Admin 10x.
                    </p>
                  </div>
                </div>
                <button className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-[#108EE9] shadow-sm transition hover:bg-white/90 active:scale-95">
                  Ajak →
                </button>
              </div>
            </div>
          )}

          {/* Card Gabungan: Progres 3 Tahap & Lihat Rincian Kupon Saya di Tab Reward */}
          {(isReferred || (isMerchant && merchantHasReward)) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
              <div
                onClick={() => go('rewards')}
                className="flex items-center justify-between cursor-pointer active:opacity-80 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-sm border border-amber-200/60">
                    🎁
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      Lihat Rincian Kupon Saya di Tab Reward
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {isMerchant
                        ? (stage2Done
                          ? 'Kupon Bebas Admin 10x & Transfer 2x Aktif ✓'
                          : 'Kupon Gratis Transfer 2x Aktif ✓')
                        : (completedCount === 3
                          ? 'Semua tahap selesai · Kupon aktif penuh ✓'
                          : `${completedCount}/3 Tahap Selesai · Pantau kupon usaha`)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    go('rewards');
                  }}
                  className="rounded-lg bg-dana-50 px-2.5 py-1 text-[11px] font-extrabold text-dana-600 active:bg-dana-100 flex items-center gap-0.5 border border-dana-100"
                >
                  Buka <span>→</span>
                </button>
              </div>

              {/* Progress Bar 3 Tahap & Verifikasi Tempel QRIS: Hilang jika sudah selesai Tahap 2 */}
              {isReferred && !stage2Done && (
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-slate-600 font-bold">Progres Tahap Toko</span>
                    <span className="text-dana-600 font-black">
                      {bizProgressPercent}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-dana-500 to-emerald-500 transition-all duration-500"
                      style={{ width: `${bizProgressPercent}%` }}
                    />
                  </div>

                  <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                    {BIZ_REWARD_STAGES.map((st, idx) => (
                      <div
                        key={st.id}
                        onClick={() => {
                          if (st.id === 'tempel' && !st.done) setShowPhotoModal(true);
                        }}
                        className={`flex flex-col items-center rounded-xl p-1.5 text-center transition ${
                          st.id === 'tempel' && !st.done ? 'cursor-pointer hover:border-emerald-400 active:scale-95' : ''
                        } ${
                          st.done
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : idx === completedCount
                            ? 'bg-amber-50/90 border border-amber-300 text-amber-900 font-semibold'
                            : 'bg-slate-50 border border-slate-100 text-slate-400'
                        }`}
                      >
                        <span className="text-[10px] font-bold mb-0.5">
                          {st.done ? '✓' : `${idx + 1}`}
                        </span>
                        <span className="text-[8.5px] font-bold leading-tight">
                          {st.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button Verifikasi Tempel QRIS: Bisa verifikasi walau belum 5 transaksi */}
                  {step3Done ? (
                    <button
                      onClick={() => setShowPhotoModal(true)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition active:scale-98 cursor-pointer"
                    >
                      <span className="text-emerald-600 font-extrabold">✓</span>
                      Tempel QRIS Terverifikasi · Menunggu 5 Transaksi
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPhotoModal(true)}
                      className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-black transition active:scale-98 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer ring-2 ring-emerald-400/50 shadow-sm shadow-emerald-500/20"
                    >
                      <Icon name="camera" className="h-4 w-4" />
                      📸 Verifikasi Tempel QRIS
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Trust Signals: Bukti Nyata Mitra Usaha DANA Bisnis (Hanya muncul jika belum menjadi Sahabat Dana Aktif: Pak Joko sebelum Tahap 2) */}
          {isReferred && !stage2Done && (
            <div className="rounded-2xl bg-white p-3 shadow-xs border border-slate-100">
              <div className="mb-2">
                <p className="text-xs font-bold text-slate-800 leading-tight">Bukti Nyata Rekan Usaha</p>
                <p className="text-[9.5px] text-slate-400">Cerita sukses aktivasi QRIS DANA Bisnis</p>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                {TRUST_SIGNALS.map((t) => (
                  <div
                    key={t.id}
                    className="w-[230px] shrink-0 rounded-xl border border-dana-100 bg-gradient-to-br from-dana-50/60 to-white p-2.5 flex flex-col justify-between shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="rounded bg-dana-600 px-1.5 py-0.5 text-[7.5px] font-black uppercase tracking-wider text-white">
                          {t.tag}
                        </span>
                        <span className="text-[8.5px] font-bold text-dana-700 bg-white border border-dana-200/80 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
                          ✓ {t.badge}
                        </span>
                      </div>
                      <p className="text-[10px] leading-snug text-slate-800">
                        <span className="font-bold text-slate-900 not-italic">{t.store}:</span>{' '}
                        <span className="italic font-medium text-slate-700">&ldquo;{t.quote}&rdquo;</span>
                      </p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-dana-100 flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-dana-100 font-black text-dana-700 text-[9px] shadow-2xs border border-dana-200/60">
                        {t.initial}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[9.5px] font-bold text-slate-800 truncate leading-tight">{t.store}</p>
                        <p className="text-[8px] text-slate-400 truncate">{t.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {/* Kesehatan Merchant */}
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">Kesehatan Merchant</p>
            {(isReferred
              ? [
                ['Pembayaran QRIS 30 hari', `${txCount} transaksi`],
                ['Pelanggan unik', `${txCount > 0 ? (stage2Done ? 5 : 1) : 0} pembayar`],
                ['Status program mitra', stage2Done ? 'Sahabat DANA' : (isPaid ? 'Tahap 1 Selesai' : 'Warung Baru (KYC Light)')],
              ]
              : [
                ['Pembayaran QRIS 30 hari', '312 transaksi'],
                ['Pelanggan unik', '148 pembayar'],
                ['Status program mitra', 'Sahabat DANA'],
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

      {/* Modal Verifikasi Foto QRIS Meja Kasir (Tahap 2 Manual) */}
      <QrisCashierVerificationModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onConfirm={() => {
          if (completeStage2) completeStage2();
          setShowPhotoModal(false);
        }}
        merchant={m}
        has5Tx={has5Tx}
        txCount={txCount}
      />

      <HostNav active="Me" go={go} notify={notify} />
    </Shell>
  );
}
