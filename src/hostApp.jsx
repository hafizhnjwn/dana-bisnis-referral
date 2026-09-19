/**
 * Replicas of the DANA host-app screens that are already settled in production
 * (audited from context/IMG_8049, IMG_8050, IMG_8055, IMG_8058). Layout, labels,
 * and ordering follow the real app; only the promo slots carry this program's
 * campaign material.
 */
import { useState } from 'react';
import { rupiah } from './rewards.js';
import { HostNav, Icon, ServiceTile, Shell, StatusBar } from './ui.jsx';

/* ------------------------------------------------------------ Home */

const HOME_SHORTCUTS = [
  { label: 'Skin Mission', icon: 'gift', tone: 'red' },
  { label: 'DANA CICIL', icon: 'wallet', tone: 'dana', badge: 'NEW' },
  { label: 'Apple Zone', icon: 'cart', tone: 'dark' },
  { label: 'Pulsa & Data', icon: 'bolt', tone: 'rose' },
  { label: 'DANA Deals', icon: 'ticket', tone: 'orange' },
  { label: 'Travel', icon: 'plane', tone: 'violet' },
  { label: 'Affiliate DANA Bisnis', icon: 'users', tone: 'blue', nav: 'hub' },
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
      <p className="text-2xl leading-tight font-extrabold text-amber-300">Dapat Saldo s/d Rp45.000</p>
      <span className="mt-2 inline-block rounded-full border-2 border-amber-200 bg-amber-400 px-4 py-1.5 text-xs font-extrabold text-amber-900">
        AJAK SEKARANG
      </span>
      <p className="mt-2 text-[9px] text-white/70">
        Tahap 1: Rp20.000 (QRIS &amp; tx ≥Rp10k) · Tahap 2: Rp25.000 (5 tx &amp; validasi). S&amp;K berlaku.
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
        Raih Saldo DANA hingga Rp45.000 per warung (Rp20.000 cair otomatis di transaksi pertama).
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
    <Shell>
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
            onClick={() => notify('Di luar cakupan prototipe.')}
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
              onClick={() => notify('Di luar cakupan prototipe.')}
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
                onClick={() => (sc.nav ? go(sc.nav) : notify('Di luar cakupan prototipe.'))}
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
          onClick={() => notify('Di luar cakupan prototipe.')}
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
              onClick={() => notify('Di luar cakupan prototipe.')}
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
              onClick={() => notify('Di luar cakupan prototipe.')}
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
              desc: 'Bantu daftarkan, dapat Saldo Rp10.000',
              nav: 'hub',
            },
            {
              icon: 'camera',
              tone: 'bg-violet-50 text-violet-600',
              title: 'Edit Foto Jualan',
              desc: 'Rapikan foto menu pakai AI',
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
              onClick={() => (row.nav ? go(row.nav) : notify('Di luar cakupan prototipe.'))}
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
      { label: 'Affiliate DANA Bisnis', icon: 'users', tone: 'blue', nav: 'hub' },
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
          <button onClick={() => notify('Pencarian layanan: di luar cakupan prototipe.')} aria-label="Cari" className="p-1">
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
                  onClick={() => (it.nav ? go(it.nav) : notify('Di luar cakupan prototipe.'))}
                />
              ))}
            </div>
          </div>
        ))}
        <p className="px-1 pb-4 text-[10px] leading-relaxed text-slate-500">
          Tata letak, kategori, dan nama layanan mengikuti layar <em>All Services</em> di aplikasi produksi.
          <strong> Affiliate DANA Bisnis</strong> di Lifestyle &amp; Deals dan <strong>DANA Bisnis</strong> di Finance
          adalah dua entry point yang sudah ada, jadi program ini tidak menambah ikon baru.
        </p>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------- Me / DANA Bisnis */

export function BizDash({ s, user, go, notify }) {
  return (
    <Shell>
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

      <div className="-mt-4 space-y-3 px-3 pb-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4E9B] text-white">
              <Icon name="store" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{user.store}</p>
              <p className="text-[10px] text-slate-400">NMID ID1023288765432 · Merchant aktif</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] text-slate-500">Penjualan hari ini · 12 transaksi</p>
            <p className="text-2xl font-extrabold text-slate-900">{rupiah(486000)}</p>
            <p className="text-[10px] font-semibold text-emerald-600">
              Potongan 0% · saldo bisa langsung ditarik
            </p>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[
              ['qr', 'QRIS Saya'],
              ['wallet', 'Tarik Saldo'],
              ['camera', 'Edit Foto'],
              ['users', 'Rekan DANA'],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() => notify('Di luar cakupan prototipe.')}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dana-50 text-dana-600">
                  <Icon name={icon} className="h-4 w-4" />
                </span>
                <span className="text-center text-[9px] leading-tight font-semibold text-slate-600">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => go('hub')}
          className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-dana-600 to-[#1B4E9B] p-4 text-left text-white shadow-sm"
        >
          <span className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-white/10" />
          <p className="text-[10px] font-bold text-amber-300">PROGRAM MITRA BISNIS</p>
          <p className="mt-1 text-base leading-tight font-extrabold">
            Ajak rekan usaha sebelah,
            <br />
            raih saldo hingga Rp45.000 per rekan
          </p>
          <p className="mt-1 text-[10px] text-white/85">
            Tahap 1: Rp20.000 (QRIS &amp; tx ≥Rp10k) · Tahap 2: Rp25.000 (5 tx &amp; validasi).
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-dana-700">
            Buka Program <Icon name="next" className="h-3 w-3" />
          </span>
        </button>

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
                <p className="text-[11px] font-bold text-slate-900">Komisi Saldo DANA s/d Rp45.000 / Rekan</p>
                <p className="text-[10px] leading-relaxed text-slate-500">
                  Rp20.000 cair saat QRIS terbit &amp; transaksi pertama ≥Rp10k + Rp25.000 saat 5 transaksi unik lolos verifikasi.
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

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Kesehatan Merchant</p>
          {[
            ['Pembayaran QRIS 30 hari', '312 transaksi'],
            ['Pelanggan unik', '148 pembayar'],
            ['Status program mitra', 'Merchant Juara'],
          ].map(([k, v]) => (
            <div key={k} className="mt-3 flex justify-between text-xs">
              <span className="text-slate-500">{k}</span>
              <span className="font-bold text-slate-800">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <HostNav active="Me" go={go} notify={notify} />
    </Shell>
  );
}
