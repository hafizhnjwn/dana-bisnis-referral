/**
 * Screens of the Affiliate DANA Bisnis Mini Program (v2.0) plus the referred
 * warung's mobile-web flow. Host-app replicas live in hostApp.jsx.
 */
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LEGACY, MAX_PER_REFERRAL, PERSONA_REWARDS, STAGES, TIERS, pendingTiers, rupiah } from './rewards.js';
import { BizDash, Grid, Home, MerchantAidaGuide, QrisCashierVerificationModal } from './hostApp.jsx';
import { Btn, Field, Icon, Pill, Shell, StatusBar, TopBar } from './ui.jsx';

const CATEGORIES = ['F&B / Warung Makan', 'Toko Kelontong', 'Jasa / Bengkel', 'Fashion / Retail'];
const REFERRAL_CODE = 'HAF58W';
// Written out in full because Tailwind only sees literal class names.
const STAGE_STYLE = {
  slate: { icon: 'bg-slate-100 text-slate-500', bar: 'bg-slate-400' },
  amber: { icon: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
  emerald: { icon: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
  violet: { icon: 'bg-violet-50 text-violet-600', bar: 'bg-violet-500' },
};
// Fake EMVCo/QRIS payload — only needs to look and scan like a real static QRIS.
const qrisPayload = (name) =>
  `00020101021126610014ID.CO.DANA.WWW011893600911002233445502152003491000012340303UMI51440014ID.CO.QRIS.WWW0215ID10232887654320303UMI5204581253033605802ID5919${name
    .toUpperCase()
    .slice(0, 19)}6007JAKARTA61051294062070703A0163044C2A`;

export const MINI_TABS = [
  { id: 'hub', label: 'Beranda', icon: 'store' },
  { id: 'tracker', label: 'Referal', icon: 'users' },
  { id: 'rewards', label: 'Reward', icon: 'gift' },
  { id: 'inbox', label: 'Inbox', icon: 'bell' },
];

export const WHATSAPP_NOTIFICATIONS = [
  {
    id: 'wa-invite-joko',
    recipient: 'Pak Joko',
    roleTarget: 'referred',
    sender: 'Rian Prasetya / Bu Putu',
    phone: '0812-4409-xxxx',
    time: 'Baru saja',
    tag: 'Undangan Warung',
    title: 'Undangan Bergabung DANA Bisnis',
    preview: 'Halo Pak Joko! Saya sudah daftarkan Warung Sembako Pak Joko ke DANA Bisnis. QRIS langsung aktif Rp0...',
    message: `Halo Pak Joko! 🏪

Saya sudah bantu daftarkan *Warung Sembako Pak Joko* agar bisa terima pembayaran digital QRIS dari semua bank & e-wallet tanpa repot kembalian.

Data sudah disiapkan, tinggal 1 langkah konfirmasi (tanpa perlu e-KTP di awal):
👉 https://dana.id/bisnis/gabung?ref=HAF58W

Pajang QRIS di meja kasir, jualan makin laris & praktis!`,
    actionText: 'Buka Undangan Pendaftaran',
    targetScreen: 'landing',
  },
  {
    id: 'wa-h1-joko',
    recipient: 'Pak Joko',
    roleTarget: 'referred',
    sender: 'DANA Bisnis Official',
    phone: '0812-4409-xxxx',
    time: '08:30 WIB (Jam Operasional Toko)',
    tag: 'Jam Operasional H+1',
    title: 'Download Poster QRIS Kasir Tokomu',
    preview: 'Halo Pak Joko! Selamat, toko Warung Sembako Pak Joko resmi terdaftar. Yuk unduh & cetak poster QRIS kasir...',
    message: `Halo Pak Joko! 🏪 Selamat, toko *Warung Sembako Pak Joko* kini resmi terdaftar di DANA Bisnis!

Jam operasional toko sudah dimulai nih. Yuk download & cetak poster QRIS kasir tokomu sekarang agar siap terima pembayaran non-tunai dari semua bank & e-wallet (BCA, Mandiri, BRI, DANA, GoPay, OVO):

📥 *Download Poster QRIS Toko (PDF A6 Siap Cetak):*
https://dana.id/bisnis/qris/download?id=ID1023288765432

Pajang di meja kasir warung, transaksi langsung masuk utuh tanpa repot receh!`,
    actionText: 'Buka & Unduh QRIS Toko',
    targetScreen: 'qris',
  },
  {
    id: 'wa-payment-joko',
    recipient: 'Pak Joko',
    roleTarget: 'referred',
    sender: 'DANA Bisnis Official',
    phone: '0812-4409-xxxx',
    time: '10:15 WIB (Jam Operasional Toko)',
    tag: 'Pembayaran Diterima',
    title: 'Pembayaran QRIS DANA Berhasil Diterima',
    preview: '🎉 Pembayaran QRIS DANA Berhasil Diterima! Nominal: Rp15.000. Kupon Tarik Tunai 2x aktif...',
    message: `🎉 *Pembayaran QRIS DANA Berhasil Diterima!*

Halo Pak Joko, ada pembayaran masuk ke *Warung Sembako Pak Joko*:
💰 *Nominal:* Rp 15.000
👤 *Dari:* Pelanggan DANA (0812••••9940)
🕒 *Waktu:* 10:15 WIB
🎁 *Reward Baru:* Kupon Gratis Tarik Tunai 2x otomatis aktif di tab Reward!

Saldo penjualan langsung masuk ke DANA Bisnis dan siap ditarik kapan saja.`,
    actionText: 'Lihat Saldo DANA Bisnis',
    targetScreen: 'bizprofile',
  },
  {
    id: 'wa-routine-joko',
    recipient: 'Pak Joko',
    roleTarget: 'referred',
    sender: 'DANA Bisnis Official',
    phone: '0812-4409-xxxx',
    time: '11:00 WIB (Jam Operasional Toko)',
    tag: 'Performa Rutin',
    title: 'Penerimaan Rutin Pembayaran QRIS DANA',
    preview: '🌟 Luar Biasa, Pak Joko! Warung Anda Makin Aktif Menerima QRIS DANA. Ringkasan transaksi mingguan...',
    message: `🌟 *Luar Biasa, Pak Joko! Warung Anda Makin Aktif Menerima QRIS DANA!*

Terima kasih telah rutin menerima pembayaran non-tunai di *Warung Sembako Pak Joko*.

📊 *Ringkasan Transaksi Mingguan:*
• Total Transaksi: 8 transaksi minggu ini
• Kupon Aktif: ${PERSONA_REWARDS.referred.tahap1.title} + ${PERSONA_REWARDS.referred.tahap2.title}
• Status Toko: Menuju *Merchant Juara DANA*

💡 *Tips Usaha:* Pastikan poster QRIS selalu terlihat jelas di meja kasir agar pembeli semakin nyaman belanja tanpa ribet cari uang receh kembalian!`,
    actionText: 'Cek Performa Warung',
    targetScreen: 'bizprofile',
  },
  {
    id: 'wa-h3-ratna',
    recipient: 'Bu Putu',
    roleTarget: 'merchant',
    sender: 'DANA Bisnis Official',
    phone: '0812-9901-xxxx',
    time: '09:00 WIB (Jam Operasional Toko H+3)',
    tag: 'Jam Operasional H+3',
    title: 'Pak Joko Belum Menerima Pembayaran QRIS',
    preview: 'Halo Bu Putu! Warung rekanan Pak Joko sudah terdaftar 3 hari lalu tapi belum menerima pembayaran QRIS...',
    message: `Halo Bu Putu! 👋

Warung rekanan yang Anda bantu daftarkan, *Warung Sembako Pak Joko*, sudah terdaftar sejak 3 hari lalu tapi *belum menerima transaksi QRIS pertamanya*.

Yuk bantu dan ingatkan Pak Joko untuk mulai menerima transaksi QRIS pertamanya (min. Rp10.000)!

🎁 Begitu Pak Joko menerima transaksi pertamanya:
• Anda langsung mendapatkan *${PERSONA_REWARDS.merchant.tahap1.title}*!
• Pak Joko mendapatkan *${PERSONA_REWARDS.referred.tahap1.title}*!

Dampingi Pak Joko sekarang agar reward Tahap 1 Anda aktif!`,
    actionText: 'Dampingi Pak Joko via WhatsApp',
    targetScreen: 'tracker',
  },
  {
    id: 'wa-h7-inactive',
    recipient: 'Bu Putu & Pak Joko',
    roleTarget: 'merchant',
    sender: 'DANA Bisnis Official',
    phone: '0812-9901-xxxx',
    time: '14:00 WIB (Hari ke-7)',
    tag: 'Inaktivitas 7 Hari',
    title: 'Pak Joko Tidak Ada Aktivitas QRIS dalam 7 Hari',
    preview: '⚠️ Pemberitahuan: Sudah 7 hari tidak ada aktivitas transaksi QRIS di Warung Sembako Pak Joko...',
    message: `⚠️ *Pemberitahuan Aktivitas QRIS Warung Binaan*

Halo Bu Putu, sudah *7 hari tidak ada aktivitas transaksi QRIS* di *Warung Sembako Pak Joko*.

Jangan biarkan peluang terlewat! Dampingi Pak Joko agar usahanya tetap aktif bertransaksi digital dan Anda bisa menyelesaikan target *Tahap 2 (Gratis Biaya Admin 10x)*:

👉 Hubungi Pak Joko untuk memastikan kasir QRIS tetap dipajang di meja warung!`,
    actionText: 'Lihat Status Warung Binaan',
    targetScreen: 'tracker',
  },
];

/**
 * Mini Program container chrome: the Ant/Alipay-style title bar with "..." and
 * close buttons, plus the 4 bottom tabs used by the production affiliate program.
 */
function MiniShell({ title, tab, go, notify, s, onBack, children, unread = 0 }) {
  const exit = () => go(s?.role === 'merchant' ? 'bizdash' : 'home');
  return (
    <Shell className="bg-slate-50 overflow-hidden">
      <div className="shrink-0 bg-white">
        <StatusBar />
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 pb-2">
          {onBack ? (
            <button onClick={onBack} aria-label="Kembali" className="rounded-full p-1 active:bg-slate-100">
              <Icon name="back" className="h-5 w-5 text-slate-700" />
            </button>
          ) : (
            <span className="w-1" />
          )}
          <p className="flex-1 truncate text-sm font-bold text-slate-900">{title}</p>
          <div className="flex items-center gap-1 rounded-full border border-slate-200 px-1.5 py-1">
            <button onClick={() => notify('Menu Mini Program: Bagikan · Laporkan · Tentang Program.')} aria-label="Opsi" className="p-0.5">
              <Icon name="more" className="h-4 w-4 text-slate-600" />
            </button>
            <span className="h-3 w-px bg-slate-200" />
            <button onClick={exit} aria-label="Tutup Mini Program" className="p-0.5">
              <Icon name="close" className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain">{children}</div>
      {tab && (
        <div className="shrink-0 z-30 flex border-t border-slate-200 bg-white/95 px-2 pt-2 pb-5 backdrop-blur shadow-lg">
          {MINI_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => go(t.id)}
              className={`relative flex flex-1 flex-col items-center gap-1 text-[10px] font-bold ${tab === t.id ? 'text-dana-600' : 'text-slate-400'
                }`}
            >
              <Icon name={t.icon} className="h-5 w-5" />
              {t.label}
              {t.id === 'inbox' && unread > 0 && (
                <span className="absolute top-0 right-4 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </Shell>
  );
}

/* -------------------------------- Mini Program Beranda (hub) */

export function AffiliateCarouselGuide({ isOpen, onClose, onAction, role = 'consumer', initialStep = 0 }) {
  const isBiz = role === 'merchant' || role === 'referred';
  const [step, setStep] = useState(initialStep);
  if (!isOpen) return null;

  const slide1 = {
    tag: 'DANA SAHABAT WARUNG',
    title: isBiz
      ? 'Bantu Usaha Sekitarmu Lebih Maju, Nikmati Gratis Biaya Admin hingga 10 Transaksi!'
      : 'Bantu Warung Favoritmu Naik Kelas, Dapetin Saldo Rp 35 Ribu!',
    subtitle: isBiz
      ? 'Sangat mengecewakan saat pelanggan ingin belanja namun harus batal karena tidak ada pembayaran non-tunai. Mari ajak rekan usaha di lingkunganmu beralih ke QRIS DANA agar pelayanan jadi lebih lengkap, memudahkan pelanggan, dan meningkatkan penjualan'
      : 'Capek drama cari uang pas atau nunggu kembalian yang nggak ada? Saatnya bantu warung langgananmu beralih ke QRIS DANA biar transaksi makin sat-set!',
    visual: (
      <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="rounded-xl border border-rose-400/30 bg-rose-500/15 p-2.5">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg border-2 border-rose-400 bg-rose-500/30 text-rose-100 shadow-sm">
              <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="mt-1.5 font-bold text-rose-200">Uang Tunai</p>
            <p className="mt-0.5 text-[9.5px] leading-tight text-white/80">
              {isBiz
                ? 'Repot menyiapkan uang kembalian & risiko uang palsu'
                : 'Drama kembalian & ribet cari uang pas'}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 p-2.5">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-500/30 text-emerald-100 shadow-sm">
              <svg className="h-4 w-4 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="mt-1.5 font-bold text-emerald-200">QRIS Dana Bisnis</p>
            <p className="mt-0.5 text-[9.5px] leading-tight text-white/80">
              {isBiz
                ? 'Terima pembayaran mudah, tinggal scan, praktis.'
                : 'Bayar apa aja tinggal scan, simpel & modern'}
            </p>
          </div>
        </div>
        <div className="mt-3 rounded-xl border border-white/15 bg-white/10 p-2 text-center">
          <p className="text-[10px] text-white/90 font-medium leading-snug">
            {isBiz
              ? '💡 Kini banyak pelanggan lebih suka membayar non-tunai. Mari bersama-sama memajukan usaha di lingkungan kita!'
              : '💡 7 dari 10 orang sudah cashless. Yuk, jadi alasan warung langgananmu jadi lebih modern!'}
          </p>
        </div>
      </div>
    ),
  };

  // 2. Pendaftaran Kilat Lewat HP
  const slide3 = {
    tag: 'PENDAFTARAN KILAT',
    title: isBiz
      ? 'Cukup bantu daftarin usaha sekitarmu, lewat hp tanpa ribet'
      : 'Cukup bantu daftarin warung favoritmu, lewat hp tanpa babibuu',
      visual: (
        <div className="relative mx-auto my-2 flex h-56 w-full max-w-[280px] items-center justify-center">
          {/* Radial glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl animate-pulse" />

          {/* Connection Arc */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 280 220" fill="none">
            <path
              d="M 55 110 Q 140 40 225 110"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* Left: Inviter */}
          <div className="relative z-10 flex flex-col items-center animate-float-slow">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-dana-400 to-sky-300 shadow-xl shadow-dana-500/40 border-2 border-white/70">
              <span className="text-3xl">🙋‍♂️</span>
            </div>
            <span className="mt-1.5 rounded-full bg-white/25 px-2.5 py-0.5 text-[8.5px] font-bold text-white shadow-xs">
              Kamu
            </span>
          </div>

          {/* Center: Smartphone with fast onboarding */}
          <div className="relative z-20 mx-2.5 flex flex-col items-center">
            <div className="relative h-44 w-28 rounded-3xl border-4 border-white/80 bg-gradient-to-b from-[#108EE9] via-[#0D5995] to-[#0A3D66] p-2 shadow-2xl shadow-dana-900/60 flex flex-col items-center justify-between">
              <div className="h-1 w-8 rounded-full bg-white/40" />

              <div className="my-auto flex flex-col items-center w-full px-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400 shadow-md shadow-emerald-500/40 animate-bounce">
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="mt-1.5 text-[9px] font-black text-emerald-200 tracking-wide">
                  &lt; 5 Detik Instan
                </p>
                <div className="mt-1.5 w-full space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-white/40" />
                  <div className="h-1.5 w-4/5 rounded-full bg-white/40" />
                  <div className="h-1.5 w-3/5 rounded-full bg-emerald-400/80" />
                </div>
              </div>

              <div className="h-1 w-10 rounded-full bg-white/50" />
            </div>

            <div className="mt-2.5 rounded-full border border-emerald-300/40 bg-white/20 px-3.5 py-1 text-center shadow-lg backdrop-blur-md">
              <p className="text-[10.5px] font-extrabold text-emerald-200">
                ⚡ Cukup Lewat HP · Tanpa Ribet
              </p>
            </div>
          </div>

          {/* Right: Partner / Warung Owner */}
          <div className="relative z-10 flex flex-col items-center animate-float-slow delay-200">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 shadow-xl shadow-amber-500/40 border-2 border-white/70">
              <span className="text-3xl">🏪</span>
            </div>
            <span className="mt-1.5 rounded-full bg-white/25 px-2.5 py-0.5 text-[8.5px] font-bold text-white shadow-xs">
              {isBiz ? 'Usaha Sekitarmu' : 'Warung Favoritmu'}
            </span>
          </div>
        </div>
      ),
  };

  // 4. Ka Adit Testimoni
  const slide4 = {
    tag: 'BUKTI NYATA PROGRAM',
    title: isBiz
      ? 'Ka Adit telah membantu 5 usaha menjadi Sahabat Dana, dan telah menghemat operasional hingga 100K!'
      : 'Ka Adit telah membantu 5 warung menjadi Sahabat Dana, dan udah dapetin saldo Dana >100K!',
      visual: (
        <div className="relative mx-auto my-2 flex h-60 w-full max-w-[290px] items-center justify-center">
          {/* Radial glow */}
          <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-2xl animate-pulse" />

          {/* Left: Customer Scanning Phone */}
          <div className="relative z-20 flex flex-col items-center -mr-1 animate-float-slow">
            <div className="relative h-44 w-24 rounded-2xl border-3 border-white/90 bg-gradient-to-b from-[#108EE9] to-[#0A3D66] p-1.5 shadow-2xl flex flex-col items-center justify-between">
              {/* Speaker */}
              <div className="h-0.5 w-6 rounded-full bg-white/40" />

              {/* Viewfinder with scan laser pointing at QRIS */}
              <div className="relative my-auto flex h-32 w-20 flex-col items-center justify-between rounded-xl border border-white/30 bg-black/50 p-1.5 overflow-hidden">
                <div className="flex w-full justify-between text-[7px] text-white/80 font-mono">
                  <span>[+]</span>
                  <span className="text-emerald-300 font-bold">SCAN</span>
                  <span>[+]</span>
                </div>

                {/* Animated laser scan beam */}
                <div className="absolute inset-x-0 top-1/3 h-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_10px_#34d399] animate-laser" />

                {/* Target reticle with mini QR preview */}
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-lg border border-dashed border-emerald-400/60 animate-pulse" />
                  <QRCodeSVG
                    value={qrisPayload('Scan Preview')}
                    size={38}
                    level="L"
                    className="opacity-40 invert"
                  />
                </div>

                <span className="text-[7px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-500/40">
                  Scan QRIS...
                </span>
              </div>

              {/* Home bar */}
              <div className="h-0.5 w-8 rounded-full bg-white/50" />
            </div>
            <span className="mt-1 text-[8.5px] font-bold text-white/90">HP Pembeli</span>
          </div>

          {/* Center: Success Arrow */}
          <div className="relative z-10 flex flex-col items-center px-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-emerald-950 font-black shadow-lg shadow-emerald-500/50 animate-bounce">
              ✓
            </div>
            <span className="text-[8px] font-black text-emerald-300 mt-1 whitespace-nowrap">
              Uang Masuk
            </span>
          </div>

          {/* Right: Authentic Indonesian QRIS Cashier Stand */}
          <div className="relative z-20 flex flex-col items-center -ml-1 animate-float-slow delay-150">
            {/* The Acrylic QRIS Stand */}
            <div className="relative w-36 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-dana-950/50 flex flex-col items-center">
              {/* QRIS Blue Header */}
              <div className="w-full rounded-t-xl bg-gradient-to-r from-[#0B5DA7] via-[#0D7AD0] to-[#108EE9] px-2 py-1.5 flex items-center justify-center text-white shadow-xs">
                <span className="text-[13px] font-black tracking-wider uppercase leading-none font-sans">
                  QRIS
                </span>
              </div>

              {/* Merchant Store Header */}
              <div className="mt-1.5 text-center w-full px-1">
                <p className="text-[9px] font-black uppercase text-slate-900 leading-tight truncate">
                  WARUNG TOKO BERKAH
                </p>
              </div>

              {/* Authentic Real QR Code */}
              <div className="relative my-1.5 rounded-lg border-2 border-slate-900/10 bg-white p-1 shadow-inner">
                <QRCodeSVG
                  value={qrisPayload('Warung Toko Berkah Bu Roro')}
                  size={80}
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Supported Banks / E-Wallet Strip */}
              <div className="w-full text-center border-t border-slate-100 pt-1 pb-0.5">
                <p className="text-[6.5px] font-black text-slate-700 tracking-tight leading-none uppercase">
                  Satu QRIS Semua Bank &amp; E-Wallet
                </p>
                <div className="mt-1 flex items-center justify-center gap-1.5 text-[6.5px] font-bold text-dana-700">
                  <span>BCA</span>
                  <span>•</span>
                  <span>BRI</span>
                  <span>•</span>
                  <span>DANA</span>
                  <span>•</span>
                  <span>GoPay</span>
                </div>
              </div>
            </div>

            <span className="mt-1 text-[8.5px] font-bold text-white/90">
              Stand QRIS Kasir Toko
            </span>
          </div>

          {/* Voice Alert pill */}
          <div className="absolute -bottom-2 z-30 rounded-full border border-white/20 bg-white/20 px-3 py-1 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span className="text-xs animate-ping">🔊</span>
            <span className="text-[10px] font-bold text-white">
              Nada DANA: &ldquo;Pembayaran Berhasil!&rdquo;
            </span>
          </div>
        </div>
      ),
  };

  // 5. CTA Daftarkan
  const slide5 = {
    tag: 'HANYA 1 MENIT',
    title: isBiz
      ? 'Daftarkan usaha sekitarmu, hanya 1 menit!'
      : 'Daftarkan warung favoritmu, hanya 1 menit!',
      visual: (
        <div className="relative mx-auto my-2 flex h-56 w-full max-w-[280px] items-center justify-center">
          {/* Radial glow */}
          <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-2xl animate-pulse" />

          {/* Speed particles */}
          <div className="absolute top-3 left-6 animate-bounce">
            <span className="text-xl">⏱️</span>
          </div>
          <div className="absolute top-6 right-7 animate-bounce delay-150">
            <span className="text-xl">⚡</span>
          </div>
          <div className="absolute bottom-5 left-7 animate-float-slow">
            <span className="text-lg">✨</span>
          </div>
          <div className="absolute bottom-4 right-8 animate-bounce delay-300">
            <span className="text-lg">🔥</span>
          </div>

          {/* Central Rocket */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 to-amber-300/10 animate-ping opacity-40" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-300/70 bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 shadow-2xl shadow-amber-500/50 animate-bounce">
                <span className="text-5xl -rotate-12">🚀</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5 rounded-full border border-amber-300/50 bg-white/20 px-4 py-1 backdrop-blur-md shadow-lg animate-pulse">
              <span className="text-sm">⏱️</span>
              <span className="text-xs font-black tracking-wider text-amber-200 uppercase">
                Hanya 1 Menit!
              </span>
            </div>

            <p className="mt-2 text-center text-[10.5px] font-semibold text-white/90">
              {isBiz
                ? 'Ketik nomor usaha sekitarmu & QRIS langsung aktif sekarang'
                : 'Ketik nomor warung favoritmu & QRIS langsung aktif sekarang'}
            </p>
          </div>
        </div>
      ),
  };

  const slides = [slide1, slide3, slide4, slide5];

  const curr = slides[step] || slides[0];

  return (
    <div className="relative h-full w-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0D5995] via-[#108EE9] to-[#083556] text-white animate-in fade-in duration-200">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute top-1/3 -left-24 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />

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

      <div className="relative z-20 pt-8 px-4 shrink-0">
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

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#108EE9]">
              D
            </span>
            <span className="text-[10px] font-extrabold tracking-wider text-white/90">
              DANA SAHABAT WARUNG ({step + 1}/{slides.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-xs transition hover:bg-white/25 active:scale-95 cursor-pointer z-30"
          >
            LEWATI <Icon name="close" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 px-5 py-2 flex flex-col justify-center overflow-y-auto no-scrollbar z-20 pointer-events-none">
        <div>
          <div className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[9px] font-black tracking-widest uppercase text-amber-200">
            {curr.tag}
          </div>
          <h2 className="mt-2 text-xl font-black leading-tight text-white">{curr.title}</h2>
          {curr.subtitle && (
            <p className="mt-1 text-xs text-white/85 leading-snug">{curr.subtitle}</p>
          )}

          <div className="mt-3">{curr.visual}</div>
        </div>
      </div>

      <div className="relative z-20 shrink-0 px-5 pb-8">
        {step === slides.length - 1 ? (
          <button
            onClick={() => {
              onClose();
              if (onAction) onAction();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-3.5 text-center text-sm font-black text-amber-950 shadow-xl shadow-amber-500/30 transition active:scale-98 cursor-pointer"
          >
            Daftarkan Warung Favoritmu Sekarang <Icon name="next" className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white/20 py-2.5 text-center text-xs font-bold text-white transition active:bg-white/30 cursor-pointer"
          >
            Lanjut (Langkah {step + 1}/{slides.length}) →
          </button>
        )}
      </div>
    </div>
  );
}

export { MerchantAidaGuide };


function Hub(p) {
  const { s, patch, go, notify, earned, activeCount } = p;
  const [manualGuide, setManualGuide] = useState(false);
  // Panduan hanya boleh muncul sekali: tandai lokal + simpan ke state aplikasi,
  // supaya tombol CTA-nya tidak langsung membuka ulang panduan yang sama.
  const [guideDone, setGuideDone] = useState(false);
  // Panduan muncul untuk kedua track pengundang (Rian & Bu Putu), bukan hanya konsumen.
  const showGuide = (!s.hasSeenAffiliateGuide && !guideDone) || manualGuide;
  const handleCloseGuide = () => {
    setManualGuide(false);
    setGuideDone(true);
    if (!s.hasSeenAffiliateGuide && patch) {
      patch({ hasSeenAffiliateGuide: true });
    }
  };
  const hasDanaBisnis = s.role === 'merchant' || s.role === 'referred';
  const biz = hasDanaBisnis;
  const inProgress = s.referrals.filter((r) => r.stage === 1).length;

  if (showGuide) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-900">
        <AffiliateCarouselGuide
          isOpen={true}
          onClose={handleCloseGuide}
          onAction={handleCloseGuide}
          role={s.role}
        />
      </div>
    );
  }

  return (
    <MiniShell title="DANA Sahabat Warung" tab="hub" {...p} unread={2}>

      <div className="px-4 pt-3 pb-8">
        {/* Guide banner */}
        <button
          onClick={() => setManualGuide(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-dana-200 bg-dana-50/80 px-3.5 py-2.5 text-left transition active:bg-dana-100"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-dana-500 text-white text-xs">
              💡
            </span>
            <div>
              <p className="text-xs font-bold text-dana-900">
                {hasDanaBisnis ? 'Panduan Mitra Bisnis' : 'Panduan DANA Sahabat Warung'}
              </p>
              <p className="text-[10px] text-dana-700">
                {hasDanaBisnis
                  ? 'Kupon 2 tahap: Bebas Biaya Transfer 2x & Bebas Admin 10x'
                  : `Skema 2 tahap reward s/d ${rupiah(MAX_PER_REFERRAL)} per warung`}
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-dana-700 shadow-2xs">
            Buka
          </span>
        </button>

        <div className="mt-4 space-y-4">
          {/* Summary card */}
          <div
            className={`rounded-3xl p-4 text-white shadow-lg ${
              hasDanaBisnis
                ? 'bg-gradient-to-br from-[#1B4E9B] to-slate-900 shadow-slate-900/25'
                : 'bg-gradient-to-br from-dana-500 to-dana-900 shadow-dana-700/25'
            }`}
          >
            <p className="text-[11px] text-white/80">
              {hasDanaBisnis ? 'Total Kupon Reward Diperoleh' : 'Total Saldo Reward Masuk ke Akun Anda'}
            </p>
            <p className="text-3xl font-extrabold">
              {hasDanaBisnis ? `${(activeCount * 2) + (inProgress ? 2 : 0)} Kupon` : rupiah(earned)}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                [inProgress, 'Menunggu Transaksi'],
                [activeCount, 'Warung Aktif'],
                ['#42', 'Peringkat 30 hari'],
              ].map(([v, k]) => (
                <span key={k} className="rounded-xl bg-white/15 p-2">
                  <span className="block text-sm font-bold">{v}</span>
                  <span className="text-[9px] text-white/80">{k}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Cleaned Referral Code Box: Removed WA and QR buttons */}
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">Kode referral kamu</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-dashed border-dana-200 bg-dana-50 py-3 text-center text-lg font-extrabold tracking-widest text-dana-700">
                {REFERRAL_CODE}
              </div>
              <button
                onClick={() => notify(`Kode ${REFERRAL_CODE} disalin ke clipboard.`)}
                aria-label="Salin kode"
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:bg-slate-200"
              >
                <Icon name="copy" />
              </button>
            </div>
            <p className="mt-2.5 text-[10px] leading-relaxed text-slate-500">
              Salin kode di atas untuk dibagikan langsung, atau gunakan tombol <strong>Bantu Daftarkan</strong> di bawah agar pendaftaran terisi otomatis tanpa perlu mengetik kode.
            </p>
          </div>

          <button
            onClick={() => go('nominate')}
            className="w-full rounded-3xl border-2 border-dana-500 bg-white p-4 text-left shadow-lg shadow-dana-500/10 active:bg-dana-50"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dana-500 text-white">
                <Icon name="store" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-slate-900">
                  {biz ? 'Bantu Daftarkan Rekan Usaha' : 'Bantu Daftarkan Warung Langganan'}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                  Isi 3 data singkat, DANA kirim undangan pra-isi ke WhatsApp pemilik usaha.
                </p>
              </div>
              <Icon name="next" className="h-4 w-4 text-dana-500" />
            </div>
          </button>

          {/* Updated Tiers */}
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">Skema reward referral</p>
            <div className="mt-3 space-y-3">
              {TIERS.map((t, i) => {
                const tierDetail = hasDanaBisnis
                  ? (s.role === 'referred'
                    ? (i === 0 ? 'Gratis tarik tunai 2x' : 'Gratis biaya admin 10x')
                    : (i === 0 ? 'Gratis transfer bank 2x' : 'Gratis biaya admin 10x'))
                  : (i === 0 ? 'Saldo DANA Rp5.000' : 'Saldo DANA Rp30.000 (Total Rp35.000)');

                return (
                  <div key={t.stage} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dana-50 text-[11px] font-bold text-dana-700">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{t.label}</p>
                      <p className="text-[10px] text-slate-500">{tierDetail}</p>
                    </div>
                    <span className="text-xs font-extrabold text-dana-700">
                      {hasDanaBisnis
                        ? (i === 0 ? 'Kupon 2x' : (i === 1 ? 'Kupon 10x' : 'Selesai'))
                        : (t.amount > 0 ? rupiah(t.amount) : 'Rp 0')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Icon name="trophy" className="h-4 w-4 text-amber-500" />
              <p className="flex-1 text-xs font-bold text-slate-700">Hadiah Pencapaian</p>
              <Pill tone="amber">{rupiah(LEGACY.achievementBonus)}</Pill>
            </div>
            <p className="mt-2 text-[10px] text-slate-500">
              Bonus {rupiah(LEGACY.achievementBonus)} setiap {LEGACY.achievementPer} usaha aktif memakai QRIS-nya.
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500"
                style={{ width: `${Math.min(100, (activeCount / LEGACY.achievementPer) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-[10px] font-bold text-slate-600">
              {activeCount} / {LEGACY.achievementPer} usaha aktif
            </p>
          </div>
        </div>
      </div>
    </MiniShell>
  );
}

/* --------------------------------- assisted nomination form */

function Nominate(p) {
  const { s, nominate, go } = p;
  const [name, setName] = useState('Warung Sembako Pak Joko');
  const [category, setCategory] = useState('Toko Kelontong');
  const [phone, setPhone] = useState('081244098822');
  const phoneOk = /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/[\s-]/g, ''));
  const ready = name.trim().length >= 3 && category && phoneOk;

  return (
    <MiniShell title="Bantu Daftarkan Warung" onBack={() => go('hub')} {...p}>
      <div className="space-y-3 px-4 pt-3 pb-8">
        <div>
          <span className="text-[11px] font-bold text-slate-700">Formulir Undangan Toko</span>
        </div>

        <Field step="1" label="Nama usaha / warung" hint="Contoh: Warung Sembako Pak Joko">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis nama warung langganan"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-dana-500 focus:ring-1 focus:ring-dana-500"
          />
        </Field>

        <Field step="2" label="Kategori usaha">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-3 py-2 text-[11px] font-bold ${category === c ? 'border-dana-500 bg-dana-500 text-white' : 'border-slate-200 bg-white text-slate-600'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Field step="3" label="Nomor WhatsApp pemilik usaha" hint="Format Indonesia, misal 081234567890">
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
            placeholder="08xx xxxx xxxx"
            className={`w-full rounded-xl border bg-white px-3 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none ${phone && !phoneOk ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-dana-500 focus:ring-1 focus:ring-dana-500'
              }`}
          />
          {phone && !phoneOk && <p className="mt-2 text-[10px] font-semibold text-red-500">Nomor WhatsApp belum valid.</p>}
        </Field>

        <p className="flex items-start gap-2 px-1 text-[10px] leading-relaxed text-slate-500">
          <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          Nomor hanya dipakai untuk mengirim 1 undangan. Maksimal 3 nominasi per perangkat per hari, dicek bersama
          sidik perangkat dan kartu SIM untuk mencegah penyalahgunaan.
        </p>

        <Btn disabled={!ready} onClick={() => nominate({ name: name.trim(), category, phone })}>
          Kirim Undangan Resmi DANA Bisnis
        </Btn>
        {s.referrals[0]?.stage === 0 && (
          <p className="text-center text-[10px] font-semibold text-emerald-600">
            Nominasi terakhir: {s.referrals[0].name} — menunggu konfirmasi pemilik.
          </p>
        )}
      </div>
    </MiniShell>
  );
}

/* --------------------------------------------- referral tracker */

const TABS = [
  ['all', 'Semua'],
  ['registered', 'Terdaftar'],
  ['active', 'Aktif'],
];

function Tracker(p) {
  const { s, nudge } = p;
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const list = (s.referrals || [])
    .filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
    .filter((r) => {
      if (tab === 'registered') return r.stage === 1;
      if (tab === 'active') return r.stage >= 2;
      return true;
    });

  return (
    <MiniShell title="Daftar Referal" tab="tracker" {...p} unread={2}>
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-sm">
          <Icon name="search" className="h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama usaha"
            className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${tab === id ? 'bg-dana-500 text-white shadow-sm' : 'bg-white text-slate-500 shadow-xs'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pb-8">
        {list.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-xs">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              👥
            </span>
            <p className="mt-2 text-xs font-bold text-slate-700">Program Referal Kosong</p>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              {s.role === 'referred'
                ? 'Akun Pak Joko terdaftar sebagai merchant binaan. Reward kupon usaha Anda dapat diakses dan digunakan di tab Reward.'
                : 'Belum ada usaha di kategori ini.'}
            </p>
            {s.role === 'referred' && (
              <button
                onClick={() => p.go('rewards')}
                className="mt-3 inline-flex items-center gap-1 rounded-xl bg-dana-500 px-4 py-2 text-xs font-bold text-white shadow-xs active:bg-dana-600 transition"
              >
                Buka Tab Reward
              </button>
            )}
          </div>
        )}
        {list.map((r) => {
          const isRegisteredNoTx = r.stage === 1 && (r.tx === 0 || !r.tx);
          const isStage1Done = r.stage === 1 && r.tx >= 1 && (r.tx < 5);
          const isStage2TxOnly = (r.tx || 0) >= 5 && r.stage < 2;
          const isStage2Done = r.stage >= 2;

          const st = isStage2Done
            ? { label: 'Tahap 2 Selesai · Tempel QRIS Terverifikasi', short: 'Aktif', color: 'emerald', progress: 100 }
            : isStage2TxOnly
              ? { label: '5 Transaksi Tercapai · Menunggu Tempel QRIS', short: '5 Transaksi', color: 'amber', progress: 80 }
              : isStage1Done
                ? { label: 'Tahap 1 Selesai · Menuju 5 Transaksi Unik', short: 'Tahap 1 Selesai', color: 'amber', progress: 60 }
                : isRegisteredNoTx
                  ? { label: 'Terdaftar (QRIS Aktif) · Menunggu Transaksi Pertama', short: 'Terdaftar', color: 'amber', progress: 40 }
                  : { label: 'Undangan terkirim, menunggu pendaftaran', short: 'Terkirim', color: 'slate', progress: 20 };

          const style = STAGE_STYLE[st.color] || STAGE_STYLE.slate;
          return (
            <div key={r.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}>
                  <Icon name="store" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{r.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {r.category} · {r.day}
                  </p>
                </div>
                <Pill tone={st.color}>{st.short}</Pill>
              </div>

              <p className="mt-3 text-[11px] font-semibold text-slate-600">{st.label}</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${st.progress}%` }} />
              </div>
              <div className="mt-2 flex gap-1 text-[8px] font-bold">
                {[
                  ['Undangan', true],
                  ['Terdaftar', r.stage >= 1],
                  ['Transaksi ≥Rp10k', r.stage >= 1 && (r.tx || 0) >= 1],
                  ['5 Transaksi', r.stage >= 2 || (r.tx || 0) >= 5],
                  ['Tempel QRIS', r.stage >= 2],
                ].map(([label, done]) => (
                  <span
                    key={label}
                    className={`flex-1 rounded-md py-1 text-center truncate ${
                      done ? 'bg-emerald-50 text-emerald-700 font-extrabold' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {r.stage === 0 && (
                <button
                  onClick={() => nudge(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 py-2 text-[11px] font-bold text-emerald-600 active:bg-emerald-50"
                >
                  <Icon name="share" className="h-3.5 w-3.5" /> Ingatkan via WhatsApp
                </button>
              )}
              {isRegisteredNoTx && (
                <button
                  onClick={() => nudge(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 py-2 text-[11px] font-bold text-emerald-600 active:bg-emerald-50"
                >
                  <Icon name="share" className="h-3.5 w-3.5" /> Dampingi Transaksi Pertama via WhatsApp
                </button>
              )}
              {isStage1Done && (
                <button
                  onClick={() => nudge(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 py-2 text-[11px] font-bold text-emerald-600 active:bg-emerald-50"
                >
                  <Icon name="share" className="h-3.5 w-3.5" /> Dampingi Transaksi via WhatsApp
                </button>
              )}
              {isStage2TxOnly && (
                <button
                  onClick={() => nudge(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 py-2 text-[11px] font-bold text-emerald-600 active:bg-emerald-50"
                >
                  <Icon name="share" className="h-3.5 w-3.5" /> Dampingi Tempel QRIS via WhatsApp
                </button>
              )}
            </div>
          );
        })}
      </div>
    </MiniShell>
  );
}

/* ------------------------------------------- Management Reward */

function Rewards(p) {
  const { s, patch, user, go, notify, earned, activeCount } = p;
  const currentRole = user?.id || s?.role || 'consumer';

  const quotas = s.rewardQuotas || {
    merchant: { transfer: 2, admin: 10 },
    referred: { withdraw: 2, admin: 10 },
  };

  const handleUseVoucher = (roleKey, voucherKey, label) => {
    const current = quotas[roleKey]?.[voucherKey] ?? 0;
    if (current <= 0) {
      notify(`Kuota kupon ${label} sudah habis.`);
      return;
    }
    patch((prev) => ({
      rewardQuotas: {
        ...prev.rewardQuotas,
        [roleKey]: {
          ...prev.rewardQuotas?.[roleKey],
          [voucherKey]: current - 1,
        },
      },
    }));
    notify(`🎉 1x Kupon ${label} berhasil digunakan! Sisa kupon: ${current - 1}x.`);
  };

  const handleResetQuotas = () => {
    patch({
      rewardQuotas: {
        merchant: { transfer: 2, admin: 10 },
        referred: { withdraw: 2, admin: 10 },
      },
    });
    notify('Kupon reward berhasil direset ke kuota awal.');
  };

  // Expired 30 hari ke depan (misal: 22 Okt 2026)
  const expiryDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  })();

  const isStage2Done = !!(
    p.progress?.stage2 ||
    (p.progress?.stage2_tx && p.progress?.stage2_verify) ||
    s?.isStage2Done ||
    (s?.referrals?.find((r) => r.name?.toLowerCase().includes('joko') || r.id === 0)?.stage ?? 0) >= 2 ||
    (s?.merchant?.stage ?? 0) >= 2
  );

  const jokoRef = s?.referrals?.find((r) => r.name?.toLowerCase().includes('joko') || r.id === 0);
  const isStage1Done = Boolean(
    p.progress?.stage1 ||
    p.progress?.stage1_tx ||
    (s?.merchant?.firstPayment || 0) >= 10000 ||
    (jokoRef && (jokoRef.claimedStage >= 1 || (jokoRef.stage >= 1 && (jokoRef.tx || 0) >= 1) || jokoRef.stage >= 2)) ||
    isStage2Done
  );

  return (
    <MiniShell title="Management Reward" tab="rewards" {...p}>
      <div className="space-y-4 px-4 pt-3 pb-8">
        {/* ROLE 1: RIAN (KONSUMEN) */}
        {currentRole === 'consumer' && (
          <div className="space-y-3">
            <div className="rounded-3xl bg-gradient-to-br from-dana-500 to-dana-900 p-4 text-white shadow-lg shadow-dana-700/25">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Reward Rian · Sahabat Warung</p>
              <p className="mt-1 text-xs text-white/80">Total Saldo Reward Masuk ke Akun Anda</p>
              <p className="text-3xl font-extrabold">{rupiah(earned)}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-200">
                <span>✓</span>
                <span>Reward cair otomatis langsung ke Saldo DANA tanpa perlu klaim manual.</span>
              </div>
            </div>

            {/* Tahap 1 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <p className="text-xs font-bold text-slate-800 truncate">
                  Reward Tahap 1 : Warung Sembako Pak Joko
                </p>
                <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>✓</span> Telah masuk ke saldo
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Saldo DANA Rp 5.000</p>
                  <p className="text-[10px] text-slate-400 font-medium">Transaksi pertama QRIS ≥ Rp10.000</p>
                </div>
                <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-black text-emerald-700">
                  +Rp5.000
                </span>
              </div>
            </div>

            {/* Tahap 2 Card - Hanya muncul setelah lolos 5 transaksi unik */}
            {isStage2Done && (
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Reward Tahap 2 : Warung Sembako Pak Joko
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>✓</span> Telah masuk ke saldo
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Saldo DANA Rp 30.000</p>
                    <p className="text-[10px] text-slate-400 font-medium">5 transaksi unik tervalidasi</p>
                  </div>
                  <span className="rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-black text-emerald-700">
                    +Rp30.000
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROLE 2: BU PUTU (MITRA BISNIS) */}
        {currentRole === 'merchant' && (
          <div className="space-y-3">
            <div className="rounded-3xl bg-gradient-to-br from-[#1B4E9B] to-slate-900 p-4 text-white shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Reward Bu Putu · Mitra Bisnis</p>
              <p className="mt-1 text-sm font-black text-white">Toko Grosir Bu Putu</p>
              <p className="mt-1 text-[11px] text-white/80">
                Kelola kupon gratis transfer &amp; bebas biaya admin hasil mereferensikan warung rekanan.
              </p>
              <div className="mt-3 flex gap-2 text-center text-xs">
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-amber-300">
                    {isStage1Done ? `${quotas.merchant?.transfer ?? 2}x` : '0x'}
                  </span>
                  <span className="text-[9px] text-white/80">Sisa Gratis Transfer</span>
                </div>
                {isStage2Done && (
                  <div className="flex-1 rounded-xl bg-white/15 p-2">
                    <span className="block text-base font-black text-emerald-300">
                      {quotas.merchant?.admin ?? 10}x
                    </span>
                    <span className="text-[9px] text-white/80">Sisa Bebas Admin</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tahap 1 Card - Hanya muncul setelah Pak Joko selesai Tahap 1 */}
            {isStage1Done && (
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Reward Tahap 1 : Warung Sembako Pak Joko
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Expired {expiryDate}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Gratis Transfer 2x</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Sisa kuota: {quotas.merchant?.transfer ?? 2}/2
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseVoucher('merchant', 'transfer', 'Gratis Transfer Antar Bank')}
                    disabled={(quotas.merchant?.transfer ?? 2) <= 0}
                    className="rounded-xl bg-dana-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-dana-600 active:scale-95 transition disabled:opacity-40"
                  >
                    {(quotas.merchant?.transfer ?? 2) > 0 ? 'Gunakan Kupon' : 'Kupon Habis'}
                  </button>
                </div>
              </div>
            )}

            {/* Tahap 2 Card - Hanya muncul setelah Pak Joko menyelesaikan Tahap 2 */}
            {isStage2Done && (
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Reward Tahap 2 : Warung Sembako Pak Joko
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Expired {expiryDate}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Gratis Admin 10x</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Sisa kuota: {quotas.merchant?.admin ?? 10}/10
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseVoucher('merchant', 'admin', 'Gratis Admin 10x')}
                    disabled={(quotas.merchant?.admin ?? 10) <= 0}
                    className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40"
                  >
                    {(quotas.merchant?.admin ?? 10) > 0 ? 'Gunakan Kupon' : 'Kupon Habis'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROLE 3: PAK JOKO (WARUNG TERDAFTAR / MERCHANT BARU) */}
        {currentRole === 'referred' && (
          <div className="space-y-3">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-slate-900 p-4 text-white shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Reward Pak Joko · Merchant Binaan</p>
              <p className="mt-1 text-sm font-black text-white">Warung Sembako Pak Joko</p>
              <p className="mt-1 text-[11px] text-white/80">
                Benefit eksklusif merchant baru: Bebas biaya tarik tunai dan gratis biaya admin transaksi.
              </p>
              <div className="mt-3 flex gap-2 text-center text-xs">
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-amber-300">
                    {quotas.referred?.withdraw ?? 2}x
                  </span>
                  <span className="text-[9px] text-white/80">Gratis Tarik Tunai</span>
                </div>
                {isStage2Done && (
                  <div className="flex-1 rounded-xl bg-white/15 p-2">
                    <span className="block text-base font-black text-emerald-300">
                      {quotas.referred?.admin ?? 10}x
                    </span>
                    <span className="text-[9px] text-white/80">Gratis Bebas Admin</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tahap 1 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <p className="text-xs font-bold text-slate-800 truncate">
                  Reward Tahap 1 : Merchant Baru
                </p>
                <span className="shrink-0 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  Expired {expiryDate}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">Gratis Tarik Tunai 2x</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Sisa kupon: {quotas.referred?.withdraw ?? 2}/2
                  </p>
                </div>
                <button
                  onClick={() => handleUseVoucher('referred', 'withdraw', 'Gratis Tarik Tunai')}
                  disabled={(quotas.referred?.withdraw ?? 2) <= 0}
                  className="rounded-xl bg-dana-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-dana-600 active:scale-95 transition disabled:opacity-40"
                >
                  {(quotas.referred?.withdraw ?? 2) > 0 ? 'Gunakan Kupon' : 'Kupon Habis'}
                </button>
              </div>
            </div>

            {/* Tahap 2 Card - Hanya muncul setelah menyelesaikan 5 transaksi unik */}
            {isStage2Done && (
              <div className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    Reward Tahap 2 : Merchant Baru
                  </p>
                  <span className="shrink-0 text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    Expired {expiryDate}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Gratis Admin 10x</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Sisa kupon: {quotas.referred?.admin ?? 10}/10
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseVoucher('referred', 'admin', 'Gratis Admin 10x')}
                    disabled={(quotas.referred?.admin ?? 10) <= 0}
                    className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition disabled:opacity-40"
                  >
                    {(quotas.referred?.admin ?? 10) > 0 ? 'Gunakan Kupon' : 'Kupon Habis'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleResetQuotas}
          className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 py-2 transition"
        >
          Reset Kuota Kupon Simulasi
        </button>
      </div>
    </MiniShell>
  );
}

/* --------------------------------- Entrypoint 1: Habis Transaksi Paket Internet (Kena Admin) */

/* --------------------------------- Entrypoint 1: Kasir Bayar Paket Data (Kena Admin) */

export function ReceiptData({ go, notify }) {
  return (
    <Shell className="bg-slate-100 flex flex-col justify-between">
      <div>
        <StatusBar />
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button onClick={() => go('home')} aria-label="Kembali" className="rounded-full p-1 -ml-1 text-slate-700 active:bg-slate-100">
            <Icon name="back" className="h-5 w-5" />
          </button>
          <p className="text-sm font-extrabold text-slate-900">Konfirmasi Pembayaran</p>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <Icon name="shield" className="h-3 w-3 text-emerald-600" /> 100% Aman
          </span>
        </div>

        <div className="space-y-3 p-4">
          {/* Card Produk */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-xl font-bold">
                📶
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Telkomsel Data</span>
                <p className="truncate text-xs font-black text-slate-900">MAXstream 14 GB / 30 Hari</p>
                <p className="text-[11px] text-slate-500">0812-8821-9940</p>
              </div>
            </div>
          </div>

          {/* Card Rincian Pembayaran */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Rincian Pembayaran</p>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Harga Paket</span>
                <span className="font-semibold text-slate-900">Rp55.000</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-slate-600">
                <span className="flex items-center gap-1.5 font-bold text-amber-800">
                  Biaya Admin
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-800">
                    +Rp1.500
                  </span>
                </span>
                <span className="font-bold text-amber-800">Rp1.500</span>
              </div>

              {/* Button kecil-kecilan sebelum penyelesaian transaksi */}
              <button
                onClick={() => go('hub')}
                className="mt-1 flex w-full items-center justify-between rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1.5 text-left text-xs text-amber-950 shadow-2xs hover:bg-amber-100 active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-400 text-white text-[10px] shadow-2xs">
                    💡
                  </span>
                  <p className="text-[11px] leading-tight font-bold text-amber-950">
                    Ingin gratis biaya admin?
                  </p>
                </div>
                <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-black text-amber-900 shadow-2xs border border-amber-200">
                  Coba →
                </span>
              </button>

              <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-extrabold text-slate-900">
                <span>Total Tagihan</span>
                <span className="text-dana-700 text-base">Rp56.500</span>
              </div>
            </div>
          </div>

          {/* Card Metode Pembayaran */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Metode Pembayaran</p>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dana-50 text-dana-600">
                  <Icon name="wallet" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Saldo DANA</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Tersedia Rp152.300 (Cukup)</p>
                </div>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dana-500 text-white text-xs font-bold">
                ✓
              </span>
            </div>
          </div>

          {/* Info Jaminan Perlindungan */}
          <div className="flex items-center gap-2 rounded-xl bg-dana-50/60 border border-dana-200/60 p-2.5 text-[10px] text-dana-800">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-dana-600" />
            <p className="leading-tight">
              Dilindungi <strong>DANA Protection</strong>: garansi 100% uang kembali jika transaksi gagal.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar Kasir Bayar */}
      <div className="border-t border-slate-200 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-slate-500">Total Pembayaran</span>
          <span className="text-base font-black text-slate-900">Rp56.500</span>
        </div>
        <button
          onClick={() => {
            if (notify) notify('🎉 Pembayaran paket data Rp56.500 berhasil diselesaikan!');
            go('home');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-dana-500 py-3.5 text-center text-sm font-extrabold text-white shadow-md shadow-dana-500/25 active:bg-dana-600 transition"
        >
          BAYAR RP56.500
        </button>
        <button
          onClick={() => go('home')}
          className="mt-2 w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600"
        >
          Batalkan Transaksi
        </button>
      </div>
    </Shell>
  );
}

/* --------------------------------- Entrypoint 2: Kasir Bayar Top Up E-Money (Kena Admin) */

export function ReceiptEmoney({ go, notify }) {
  return (
    <Shell className="bg-slate-100 flex flex-col justify-between">
      <div>
        <StatusBar />
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <button onClick={() => go('home')} aria-label="Kembali" className="rounded-full p-1 -ml-1 text-slate-700 active:bg-slate-100">
            <Icon name="back" className="h-5 w-5" />
          </button>
          <p className="text-sm font-extrabold text-slate-900">Konfirmasi Pembayaran</p>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <Icon name="shield" className="h-3 w-3 text-emerald-600" /> 100% Aman
          </span>
        </div>

        <div className="space-y-3 p-4">
          {/* Card Produk */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 text-xl font-bold">
                💳
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">E-Money Mandiri</span>
                <p className="truncate text-xs font-black text-slate-900">Top Up Saldo Rp100.000</p>
                <p className="text-[11px] text-slate-500">6032-9102-3847-1190</p>
              </div>
            </div>
          </div>

          {/* Card Rincian Pembayaran */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Rincian Pembayaran</p>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Nominal Top Up</span>
                <span className="font-semibold text-slate-900">Rp100.000</span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-slate-600">
                <span className="flex items-center gap-1.5 font-bold text-amber-800">
                  Biaya Admin
                  <span className="rounded bg-amber-100 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-800">
                    +Rp1.500
                  </span>
                </span>
                <span className="font-bold text-amber-800">Rp1.500</span>
              </div>

              {/* Button kecil-kecilan sebelum penyelesaian transaksi */}
              <button
                onClick={() => go('hub')}
                className="mt-1 flex w-full items-center justify-between rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-1.5 text-left text-xs text-amber-950 shadow-2xs hover:bg-amber-100 active:scale-[0.99] transition"
              >
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-amber-400 text-white text-[10px] shadow-2xs">
                    💡
                  </span>
                  <p className="text-[11px] leading-tight font-bold text-amber-950">
                    Ingin gratis biaya admin?
                  </p>
                </div>
                <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-black text-amber-900 shadow-2xs border border-amber-200">
                  Coba →
                </span>
              </button>

              <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-extrabold text-slate-900">
                <span>Total Tagihan</span>
                <span className="text-dana-700 text-base">Rp101.500</span>
              </div>
            </div>
          </div>

          {/* Card Metode Pembayaran */}
          <div className="rounded-2xl bg-white p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">Metode Pembayaran</p>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dana-50 text-dana-600">
                  <Icon name="wallet" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold text-slate-900">Saldo DANA</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Tersedia Rp152.300 (Cukup)</p>
                </div>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dana-500 text-white text-xs font-bold">
                ✓
              </span>
            </div>
          </div>

          {/* Info Jaminan Perlindungan */}
          <div className="flex items-center gap-2 rounded-xl bg-dana-50/60 border border-dana-200/60 p-2.5 text-[10px] text-dana-800">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-dana-600" />
            <p className="leading-tight">
              Dilindungi <strong>DANA Protection</strong>: garansi 100% uang kembali jika transaksi gagal.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar Kasir Bayar */}
      <div className="border-t border-slate-200 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-slate-500">Total Pembayaran</span>
          <span className="text-base font-black text-slate-900">Rp101.500</span>
        </div>
        <button
          onClick={() => {
            if (notify) notify('🎉 Top up e-money Rp101.500 berhasil diselesaikan!');
            go('home');
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-dana-500 py-3.5 text-center text-sm font-extrabold text-white shadow-md shadow-dana-500/25 active:bg-dana-600 transition"
        >
          BAYAR RP101.500
        </button>
        <button
          onClick={() => go('home')}
          className="mt-2 w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600"
        >
          Batalkan Transaksi
        </button>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------ inbox */

function Inbox(p) {
  const { s, inviter, openWhatsApp } = p;
  const [tab, setTab] = useState('app'); // 'app' | 'wa'
  const m = s.merchant;

  // Isi notifikasi mengikuti track pengundang: Rian dapat saldo, Bu Putu dapat kupon.
  const rw = PERSONA_REWARDS[s.role] ?? PERSONA_REWARDS.consumer;
  const rewardLine = (tahap) =>
    rw[tahap].type === 'saldo'
      ? `Reward ${rw[tahap].title} otomatis masuk ke Saldo Pocket DANA.`
      : `Reward ${rw[tahap].title} otomatis aktif di tab Reward.`;

  const appItems = [
    m.firstPayment >= 10000 && {
      tone: 'emerald',
      icon: 'bolt',
      title: `Tahap 1 Selesai : ${m.name}`,
      body: rewardLine('tahap1'),
      time: 'Baru saja',
    },
    m.issued && {
      tone: 'dana',
      icon: 'store',
      title: `Warung Terdaftar : ${m.name}`,
      body: 'Pendaftaran selesai & QRIS terbit. Siap menerima transaksi.',
      time: '2 menit lalu',
    },
    {
      tone: 'emerald',
      icon: 'trophy',
      title: 'Tahap 2 Selesai : Toko Kelontong Jaya',
      body: rewardLine('tahap2'),
      time: 'Kemarin',
    },
    {
      tone: 'emerald',
      icon: 'bolt',
      title: 'Tahap 1 Selesai : Kopi Pak Rudi',
      body: rewardLine('tahap1'),
      time: '3 hari lalu',
    },
    {
      tone: 'dana',
      icon: 'store',
      title: 'Warung Terdaftar : Kopi Pak Rudi',
      body: 'Pendaftaran DANA Bisnis selesai & QRIS toko aktif.',
      time: '5 hari lalu',
    },
  ].filter(Boolean);

  const tones = {
    emerald: 'bg-emerald-50 text-emerald-600',
    dana: 'bg-dana-50 text-dana-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    slate: 'bg-slate-100 text-slate-500',
  };

  return (
    <MiniShell title="Inbox Notifikasi" tab="inbox" {...p}>
      <div className="px-4 pt-3 pb-8 space-y-3">
        {/* Switcher: DANA vs WhatsApp */}
        <div className="flex rounded-xl bg-slate-200 p-1 text-[11px] font-bold">
          <button
            onClick={() => setTab('app')}
            className={`flex-1 rounded-lg py-1.5 transition ${tab === 'app' ? 'bg-dana-500 text-white shadow-xs' : 'text-slate-600'
              }`}
          >
            Notifikasi DANA ({appItems.length})
          </button>
          <button
            onClick={() => setTab('wa')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${tab === 'wa' ? 'bg-[#25D366] text-white shadow-xs' : 'text-slate-600'
              }`}
          >
            <Icon name="whatsapp" className="h-3.5 w-3.5" />
            WhatsApp ({WHATSAPP_NOTIFICATIONS.length})
          </button>
        </div>

        {tab === 'app' ? (
          <div className="space-y-3">
            {appItems.map((it, i) => (
              <div key={i} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tones[it.tone]}`}>
                  <Icon name={it.icon} className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800">{it.title}</p>
                    {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-dana-500" />}
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{it.body}</p>
                  <p className="mt-1 text-[9px] text-slate-400">{it.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-[10px] text-emerald-800">
              💬 <strong>Notifikasi WhatsApp Resmi:</strong> Dikirim otomatis di jam operasional toko untuk mendampingi warung dan pengundang.
            </div>
            {WHATSAPP_NOTIFICATIONS.map((wa) => (
              <div key={wa.id} className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[10px] font-black text-[#075E54]">
                    <Icon name="whatsapp" className="h-3.5 w-3.5 text-[#25D366]" />
                    {wa.sender} <span className="text-emerald-600 font-bold">✓</span>
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-800">
                    {wa.tag}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-slate-700">Kepada: {wa.recipient}</span>
                  <span>{wa.time}</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{wa.title}</p>
                <p className="text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                  {wa.preview}
                </p>
                <button
                  onClick={() => openWhatsApp && openWhatsApp(wa)}
                  className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/15 py-2 text-xs font-bold text-[#075E54] active:bg-[#25D366]/25 transition"
                >
                  <Icon name="whatsapp" className="h-3.5 w-3.5" /> Lihat Chat WhatsApp Lengkap →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MiniShell>
  );
}

/* --------------------------- HP 2 idle: belum ada undangan masuk */

function WaitingInvite({ inviter }) {
  return (
    <Shell className="bg-slate-900">
      <StatusBar dark />
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#25D366]/15 text-[#25D366]">
          <Icon name="whatsapp" className="h-8 w-8" />
        </span>
        <p className="mt-4 text-sm font-extrabold text-white">Belum ada undangan masuk</p>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
          Pak Joko belum memakai DANA Bisnis. Undangan dari {inviter} akan tiba di sini sebagai notifikasi
          WhatsApp, lalu ketuk notifikasinya untuk membuka link pendaftaran.
        </p>
        <div className="mt-5 flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5 text-[10px] font-bold text-slate-300">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" /> Menunggu pesan WhatsApp
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------- referred merchant landing (mobile web) */

function BrowserBar() {
  return (
    <div className="flex items-center gap-2 bg-slate-200 px-4 py-2">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
        ✓
      </span>
      <span className="flex-1 truncate rounded-lg bg-white px-2 py-1 text-[10px] text-slate-500">
        dana.id/bisnis/gabung?ref={REFERRAL_CODE}
      </span>
    </div>
  );
}

function Landing({ s, go, inviter }) {
  const benefits = [
    {
      icon: 'qr',
      title: 'Terima Semua Bank & E-Wallet',
      desc: 'Satu QRIS untuk BCA, BRI, Mandiri, DANA, GoPay, dan lainnya.',
    },
    {
      icon: 'wallet',
      title: 'Uang Masuk Langsung Utuh',
      desc: 'Hasil jualan masuk 100% utuh tanpa repot kembalian receh.',
    },
    {
      icon: 'sound',
      title: 'HP Bersuara Otomatis',
      desc: 'Nada DANA otomatis menyebut nominal saat uang masuk.',
    },
  ];

  return (
    <Shell className="bg-slate-50">
      <StatusBar />
      <BrowserBar />
      <div className="bg-gradient-to-b from-dana-600 to-dana-700 px-5 pt-6 pb-6 text-white">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
          UNDANGAN DARI PELANGGAN ANDA
        </span>
        <h1 className="mt-2.5 text-lg leading-snug font-extrabold">
          {inviter} mengajak {s.merchant.name} bergabung ke DANA Bisnis
        </h1>
        <p className="mt-1 text-[11px] leading-relaxed text-white/85">
          Data pendaftaran sudah dibantu siapkan. Tinggal 1 langkah konfirmasi!
        </p>
      </div>

      <div className="space-y-3 px-4 pt-4 pb-6">
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[11px] font-bold text-emerald-800">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
            ✓
          </span>
          <span>Gratis Rp0 · Siap pakai tanpa upload e-KTP di awal</span>
        </div>

        <div className="space-y-2">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-xs">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dana-50 text-dana-600">
                <Icon name={b.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">{b.title}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={() => go('register')}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-center text-sm font-extrabold text-white shadow-md shadow-emerald-600/25 transition active:scale-98"
          >
            Aktifkan QRIS Sekarang
          </button>
          <p className="mt-2 text-center text-[10px] text-slate-400">
            Hanya 3 data singkat · Aktif dalam 30 detik
          </p>
          <p className="mt-2 text-center text-[9px] text-slate-400">
            🔒 Berizin & Diawasi Bank Indonesia · Standar QRIS ASPI
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* ----------------------------------------- 3-field KYC light form */

function Register({ s, go, issueQris, notify, inviter }) {
  const [name, setName] = useState(s.merchant.name);
  const [category, setCategory] = useState(s.merchant.category);
  const [location, setLocation] = useState(s.merchant.location);
  const [consent, setConsent] = useState(false);
  const ready = name.trim() && category && location && consent;

  return (
    <Shell className="bg-white">
      <StatusBar />
      <BrowserBar />
      <TopBar title="Daftar DANA Bisnis" onBack={() => go('landing')} />
      <div className="space-y-4 px-5 pb-8">
        <div className="space-y-1 rounded-xl bg-emerald-50 px-3 py-2.5">
          <p className="flex items-center gap-2 text-[10px] font-bold text-emerald-700">
            <Icon name="check" className="h-3.5 w-3.5" /> Nama usaha & kategori sudah diisi oleh {inviter}
          </p>
          <p className="flex items-center gap-2 text-[10px] font-bold text-emerald-700">
            <Icon name="check" className="h-3.5 w-3.5" /> Kode referral {REFERRAL_CODE} terpasang otomatis
          </p>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-slate-700">1. Nama pemilik & usaha</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-dana-500 focus:ring-1 focus:ring-dana-500"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-slate-700">2. Kategori usaha</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-900 outline-none focus:border-dana-500 focus:ring-1 focus:ring-dana-500"
          >
            <option value="" className="text-slate-900 bg-white">Pilih kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} className="text-slate-900 bg-white">{c}</option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-xs font-bold text-slate-700">3. Lokasi usaha</span>
          <button
            onClick={() => {
              setLocation('Jl. Tebet Barat Dalam VIII No.12, Jakarta Selatan');
              notify('Lokasi toko terdeteksi via GPS.');
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-xl border border-dana-500 px-3 py-3 text-left text-xs font-bold text-dana-700 active:bg-dana-50"
          >
            <Icon name="pin" className="h-4 w-4" />
            {location || 'Gunakan Lokasi Toko Saat Ini'}
          </button>
        </div>

        <label className="flex items-start gap-2 text-[11px] leading-snug text-slate-600">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-dana-500" />
          Saya setuju dengan Ketentuan DANA Bisnis dan menyatakan usaha ini milik saya.
        </label>

        <Btn variant="green" disabled={!ready} onClick={() => issueQris({ name: name.trim(), category, location })}>
          Terbitkan QRIS Saya Sekarang
        </Btn>
        <p className="text-center text-[10px] leading-relaxed text-slate-400">
          QRIS terbit &lt; 5 detik. Tidak ada masa tunggu verifikasi 1–14 hari untuk mulai menerima pembayaran.
        </p>
      </div>
    </Shell>
  );
}

/* -------------------------- instant QRIS + first-day checklist */

function Qris(props) {
  const { s, go, notify, inviter, mark } = props;
  const m = s.merchant;
  const isPaid = m.firstPayment >= 10000;

  // Warung ini di daftar referal pengundang: dipakai untuk status Tahap 2.
  const myReferral = s.referrals?.find((r) => r.name === m.name || r.id === 0);
  const stage2Done =
    (myReferral?.stage ?? 0) >= 2 ||
    Boolean(props.progress?.stage2 || (props.progress?.stage2_tx && props.progress?.stage2_verify));

  const steps = [
    { done: m.issued, title: 'QRIS toko aktif (KYC Light)', desc: 'Akun siap menerima pembayaran digital dari seluruh bank & e-wallet.' },
    {
      done: m.testScan || isPaid,
      title: 'Uji coba scan QRIS toko',
      desc: 'Scan QRIS untuk mencoba pembayaran dan mendengarkan Nada DANA.',
    },
    {
      done: isPaid,
      title: 'Terima pembayaran pertama min. Rp10.000',
      desc: 'Terima pembayaran QRIS pertama dan aktifkan kupon Gratis Tarik Tunai 2x (Tahap 1).',
    },
    {
      done: stage2Done,
      title: '5 transaksi unik & foto verifikasi kasir (Tahap 2)',
      desc: 'Setelah lolos audit validitas transaksi (1–14 hari), kupon Gratis Biaya Admin 10x aktif (Tahap 2).',
    },
  ];

  return (
    <Shell>
      <StatusBar />
      <TopBar title="QRIS Toko Saya" onBack={() => go('landing')} right={<Pill tone="emerald">AKTIF</Pill>} />
      <div className="space-y-4 px-4 pb-8">
        <div className="rounded-3xl bg-white p-5 text-center shadow-lg shadow-slate-300/40">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest text-dana-700">QRIS</span>
            <span className="text-[9px] font-bold text-slate-400">GPN · ASPI</span>
          </div>
          <p className="mt-1 text-sm font-extrabold text-slate-900 uppercase">{m.name}</p>
          <p className="text-[9px] text-slate-400">NMID ID1023288765432 · {m.category}</p>
          <div className="mx-auto mt-3 w-fit rounded-2xl border-4 border-dana-500 bg-white p-3">
            <QRCodeSVG value={qrisPayload(m.name)} size={168} level="M" />
          </div>
          <p className="mt-2 text-[9px] text-slate-400">Satu QR untuk semua e-wallet & mobile banking</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Btn variant="subtle" onClick={() => notify('Poster meja siap cetak (PDF A6) diunduh.')}>
              <Icon name="download" className="h-4 w-4" /> Poster PDF
            </Btn>
            <Btn variant="subtle" onClick={() => notify('Gambar QR dibagikan via WhatsApp.')}>
              <Icon name="share" className="h-4 w-4" /> Bagikan QR
            </Btn>
          </div>
        </div>

        {/* Primary CTA to open complete business profile with step-by-step guidance */}
        <Btn
          variant="green"
          onClick={() => {
            if (mark) mark('open_bizprofile');
            go('bizprofile');
          }}
        >
          Buka Profil DANA Bisnis &amp; Panduan Toko
        </Btn>

        {m.firstPayment > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
              <Icon name="sound" className="h-4 w-4" /> Pembayaran pertama {rupiah(m.firstPayment)} diterima
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
              Pembayaran berhasil diterima! Kupon Gratis Tarik Tunai 2x telah aktif di tab Reward tokomu.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Checklist Hari Pertama</p>
          <div className="mt-3 space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    st.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {st.done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${st.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {st.title}
                  </p>
                  <p className="text-[10px] leading-snug text-slate-500">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Saldo DANA Bisnis</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {rupiah(m.firstPayment + (m.testScan ? 1000 : 0))}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Nominal jualan masuk langsung utuh tanpa repot receh.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* -------------------------- Profile Bisnis & Step-by-Step Guidance (Referred Merchant) */

function BizProfile(props) {
  const hasCompletedGuide = Boolean(props.progress?.biz_guide || props.s?.hasSeenBizGuide);
  return <BizDash {...props} initialTour={!hasCompletedGuide} />;
}

/* -------------------------- Full WhatsApp Chat View Modal */

export function WhatsAppChatModal({ chat, onClose, go }) {
  if (!chat) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#ECE5DD] text-slate-900 animate-in fade-in duration-150">
      {/* WhatsApp Header */}
      <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2.5 text-white shadow-md">
        <button onClick={onClose} aria-label="Kembali" className="p-1 active:bg-white/10 rounded-full">
          <Icon name="back" className="h-5 w-5 text-white" />
        </button>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#075E54] font-black text-sm">
          D
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <p className="truncate text-xs font-bold text-white leading-none">{chat.sender}</p>
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[8px] font-black text-[#075E54]">
              ✓
            </span>
          </div>
          <p className="text-[10px] text-emerald-200">Akun Bisnis Resmi · {chat.time}</p>
        </div>
        <button onClick={onClose} aria-label="Tutup" className="text-white/80 hover:text-white p-1">
          <Icon name="close" className="h-5 w-5" />
        </button>
      </div>

      {/* WhatsApp Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="mx-auto w-fit rounded-lg bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-600 shadow-2xs">
          HARI INI
        </div>

        <div className="mx-auto max-w-[280px] rounded-lg bg-[#FCF4CB] px-3 py-1.5 text-center text-[10px] text-slate-700 shadow-2xs">
          🔒 Pesan resmi terverifikasi dari DANA Bisnis untuk {chat.recipient}.
        </div>

        {/* Chat Bubble */}
        <div className="mr-6 rounded-2xl rounded-tl-xs bg-white p-3.5 shadow-sm text-slate-900 border border-slate-200/60">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
            <span className="text-[10px] font-black text-[#075E54] flex items-center gap-1">
              DANA Bisnis Official
              <span className="text-emerald-600 font-bold">✓</span>
            </span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-800">
              {chat.tag}
            </span>
          </div>

          <div className="text-xs leading-relaxed whitespace-pre-line text-slate-800 font-normal">
            {chat.message}
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-[9px] text-slate-400 font-medium">{chat.time}</span>
            <span className="text-[10px] font-bold text-sky-600">✓✓</span>
          </div>

          {chat.actionText && (
            <button
              onClick={() => {
                onClose();
                if (chat.targetScreen && go) go(chat.targetScreen);
              }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-sm active:bg-[#1EBE5D] transition"
            >
              {chat.actionText} →
            </button>
          )}
        </div>
      </div>

      {/* WhatsApp Input Bar */}
      <div className="flex items-center gap-2 bg-[#F0F2F5] px-3 py-2 border-t border-slate-200">
        <div className="flex-1 rounded-full bg-white px-3 py-2 text-xs text-slate-400 border border-slate-200">
          Pesan resmi DANA Bisnis
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075E54] text-white active:scale-95"
        >
          <Icon name="check" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------- Transfer Bank Screen (Bu Putu Step 1: Kena Biaya Admin) */

function TransferBank(props) {
  const { go, notify, mark, user } = props;
  const storeName = user?.store || 'Toko Grosir Bu Putu';
  const balance = user?.balance ?? 96500;

  return (
    <Shell>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        <div className="bg-[#1B4E9B] pb-4 text-white">
          <StatusBar dark />
          <TopBar
            title="Kirim Uang ke Bank"
            onBack={() => go('bizdash')}
            right={<Pill tone="rose">BIAYA ADMIN</Pill>}
            dark
          />
        </div>

        <div className="-mt-2 space-y-3 px-4">
          {/* Card Tujuan Transfer (Bank BCA) */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Rekening Bank Tujuan
              </span>
              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                Terverifikasi ✓
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 text-sm font-black border border-blue-200">
                BCA
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-slate-900 truncate">
                  CV Berkah Pangan
                </p>
                <p className="text-[11px] font-semibold text-slate-600">
                  BCA · 8820 1928 4401
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  Supplier Bahan Martabak (Terigu &amp; Telur)
                </p>
              </div>
            </div>
          </div>

          {/* Card Sumber Dana */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
              Sumber Dana Bisnis
            </p>
            <div className="mt-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-dana-50 text-dana-600">
                  <Icon name="store" className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-black text-slate-900">Saldo DANA Bisnis</p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {storeName} · Saldo {rupiah(balance)}
                  </p>
                </div>
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-dana-500 text-white text-xs font-bold">
                ✓
              </span>
            </div>
          </div>

          {/* Card Rincian Pembayaran & Biaya Admin */}
          <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100">
            <p className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
              Rincian Transfer
            </p>
            <div className="mt-2.5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Nominal Transfer</span>
                <span className="font-semibold text-slate-900">Rp150.000</span>
              </div>

              {/* Terkena Biaya Admin Highlighted */}
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2 text-slate-600">
                <span className="flex items-center gap-1.5 font-bold text-rose-700">
                  <span>⚠️</span> Biaya Admin Transfer Bank
                </span>
                <span className="font-black text-rose-700">Rp2.500</span>
              </div>

              {/* Hook Promosi Bebas Admin yang diminta user: Coba → tanpa tanda kurung dan panah benar */}
              <div className="mt-2 rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 p-2.5 text-xs text-amber-950 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-white text-xs shadow-2xs">
                      💡
                    </span>
                    <div>
                      <p className="text-[11px] leading-tight font-black text-amber-950">
                        Ingin tidak terkena admin?
                      </p>
                      <p className="text-[9px] text-amber-800 leading-tight">
                        Ajak warung sebelah pakai QRIS &amp; raih kupon gratis transfer!
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (mark) mark('open_hub');
                      go('hub');
                      notify('Membuka DANA Sahabat Warung...');
                    }}
                    className="shrink-0 rounded-lg bg-dana-500 hover:bg-dana-600 active:scale-95 px-3 py-1 text-xs font-extrabold text-white shadow-xs transition cursor-pointer"
                  >
                    Coba →
                  </button>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-extrabold text-slate-900">
                <span>Total Bayar</span>
                <span className="text-dana-700 text-base">Rp152.500</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Btn
              variant="primary"
              onClick={() => {
                notify('Transfer disimulasikan: saldo terpotong Rp152.500 termasuk admin Rp2.500.');
                go('bizdash');
              }}
            >
              Konfirmasi &amp; Bayar Rp152.500
            </Btn>
            <Btn variant="ghost" onClick={() => go('bizdash')}>
              Kembali ke DANA Bisnis
            </Btn>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default {
  waiting: WaitingInvite,
  home: Home,
  grid: Grid,
  bizdash: BizDash,
  hub: Hub,
  nominate: Nominate,
  tracker: Tracker,
  rewards: Rewards,
  reward: Rewards,
  peringkat: Rewards,
  inbox: Inbox,
  landing: Landing,
  register: Register,
  qris: Qris,
  bizprofile: BizProfile,
  receipt_data: ReceiptData,
  receipt_emoney: ReceiptEmoney,
  transfer: TransferBank,
};


