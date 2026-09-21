/**
 * Screens of the Affiliate DANA Bisnis Mini Program (v2.0) plus the referred
 * warung's mobile-web flow. Host-app replicas live in hostApp.jsx.
 */
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LEGACY, STAGES, TIERS, pendingTiers, rupiah } from './rewards.js';
import { BizDash, Grid, Home, MerchantAidaGuide } from './hostApp.jsx';
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
    id: 'wa-h1-joko',
    recipient: 'Pak Joko',
    roleTarget: 'referred',
    sender: 'DANA Bisnis Official',
    phone: '0812-4409-xxxx',
    time: '08:30 WIB (Jam Operasional Toko)',
    tag: 'Jam Operasional H+1',
    title: 'Download Poster QRIS Kasir Tokomu',
    preview: 'Halo Pak Joko! Selamat, toko Warung Nasi Pak Joko resmi terdaftar. Yuk unduh & cetak poster QRIS kasir...',
    message: `Halo Pak Joko! 🏪 Selamat, toko *Warung Nasi Pak Joko* kini resmi terdaftar di DANA Bisnis!

Jam operasional toko sudah dimulai nih. Yuk download & cetak poster QRIS kasir tokomu sekarang agar siap terima pembayaran non-tunai dari semua bank & e-wallet (BCA, Mandiri, BRI, DANA, GoPay, OVO):

📥 *Download Poster QRIS Toko (PDF A6 Siap Cetak):*
https://dana.id/bisnis/qris/download?id=ID1023288765432

Pajang di meja kasir warung, transaksi 100% masuk utuh tanpa potongan (0% MDR)!`,
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
    preview: '🎉 Pembayaran QRIS DANA Berhasil Diterima! Nominal: Rp12.000 (MDR 0%). Bonus Modal Usaha Rp15.000 masuk...',
    message: `🎉 *Pembayaran QRIS DANA Berhasil Diterima!*

Halo Pak Joko, ada pembayaran masuk ke *Warung Nasi Pak Joko*:
💰 *Nominal:* Rp 12.000
👤 *Dari:* Pelanggan DANA (0812••••9940)
🕒 *Waktu:* 10:15 WIB
✅ *MDR:* 0% (Gratis tanpa potongan)
🎁 *Bonus Spesial:* Bonus Modal Usaha Rp 15.000 otomatis ditambahkan ke saldo tokomu!

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

Terima kasih telah rutin menerima pembayaran non-tunai di *Warung Nasi Pak Joko*.

📊 *Ringkasan Transaksi Mingguan:*
• Total Transaksi: 8 transaksi minggu ini
• Bebas Biaya Tarik Tunai: 7x Aktif
• Status Toko: Menuju *Merchant Juara DANA*

💡 *Tips Usaha:* Pastikan poster QRIS selalu terlihat jelas di meja kasir agar pembeli semakin nyaman belanja tanpa ribet cari uang receh kembalian!`,
    actionText: 'Cek Performa Warung',
    targetScreen: 'bizprofile',
  },
  {
    id: 'wa-h3-ratna',
    recipient: 'Bu Ratna',
    roleTarget: 'merchant',
    sender: 'DANA Bisnis Official',
    phone: '0812-9901-xxxx',
    time: '09:00 WIB (Jam Operasional Toko H+3)',
    tag: 'Jam Operasional H+3',
    title: 'Pak Joko Belum Menerima Pembayaran QRIS',
    preview: 'Halo Bu Ratna! Warung rekanan Pak Joko sudah terdaftar 3 hari lalu tapi belum menerima pembayaran QRIS...',
    message: `Halo Bu Ratna! 👋

Warung rekanan yang Anda bantu daftarkan, *Warung Nasi Pak Joko*, sudah terdaftar sejak 3 hari lalu tapi *belum menerima transaksi QRIS pertamanya*.

Yuk bantu dan ingatkan Pak Joko untuk mulai menerima transaksi QRIS pertamanya (min. Rp10.000)!

🎁 Begitu Pak Joko menerima transaksi pertamanya:
• Anda langsung mendapatkan *Gratis Transfer Antar Bank 10x*!
• Pak Joko mendapatkan *Gratis Tarik Tunai 7x* + *Bonus Modal Usaha Rp15.000*!

Dampingi Pak Joko sekarang agar reward Tahap 1 Anda aktif!`,
    actionText: 'Dampingi Pak Joko via WhatsApp',
    targetScreen: 'tracker',
  },
  {
    id: 'wa-h7-inactive',
    recipient: 'Bu Ratna & Pak Joko',
    roleTarget: 'merchant',
    sender: 'DANA Bisnis Official',
    phone: '0812-9901-xxxx',
    time: '14:00 WIB (Hari ke-7)',
    tag: 'Inaktivitas 7 Hari',
    title: 'Pak Joko Tidak Ada Aktivitas QRIS dalam 7 Hari',
    preview: '⚠️ Pemberitahuan: Sudah 7 hari tidak ada aktivitas transaksi QRIS di Warung Nasi Pak Joko...',
    message: `⚠️ *Pemberitahuan Aktivitas QRIS Warung Binaan*

Halo Bu Ratna, sudah *7 hari tidak ada aktivitas transaksi QRIS* di *Warung Nasi Pak Joko*.

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
  const exit = () => go(s.role === 'merchant' ? 'bizdash' : 'home');
  return (
    <Shell className="bg-slate-50">
      <StatusBar />
      <div className="flex items-center gap-2 border-b border-slate-100 bg-white px-3 pb-2">
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
      <div className="flex-1">{children}</div>
      {tab && (
        <div className="sticky bottom-0 flex border-t border-slate-100 bg-white/95 px-2 pt-2 pb-5 backdrop-blur">
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

function AffiliateCarouselGuide({ isOpen, onClose, onAction }) {
  const [step, setStep] = useState(0);
  if (!isOpen) return null;

  const slides = [
    {
      tag: '[A] ATTENTION · PERHATIAN',
      title: 'Warung Langganan Masih Repot Uang Tunai?',
      subtitle: 'Sering kekurangan kembalian atau pembeli batal jajan karena tidak bawa uang pas. Saatnya bantu mereka beralih ke QRIS DANA!',
      visual: (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/15 p-2.5">
              <span className="text-xl">❌</span>
              <p className="mt-1 font-bold text-rose-200">Uang Tunai</p>
              <p className="mt-0.5 text-[9px] text-white/70">Ribet cari kembalian &amp; resiko uang palsu</p>
            </div>
            <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/20 p-2.5">
              <span className="text-xl">✅</span>
              <p className="mt-1 font-bold text-emerald-200">QRIS DANA Bisnis</p>
              <p className="mt-0.5 text-[9px] text-white/70">Terima semua bank/e-wallet &amp; 0% MDR</p>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-white/80 font-medium">
            💡 7 dari 10 pelanggan lebih suka bayar non-tunai. Jadilah pahlawan warung sekitarmu!
          </p>
        </div>
      ),
    },
    {
      tag: '[I] INTEREST · KETERTARIKAN',
      title: 'Daftar Kilat 30 Detik Tanpa e-KTP di Awal',
      subtitle: 'Cukup 3 data singkat, QRIS langsung terbit seketika (< 5 detik) secara gratis Rp0.',
      visual: (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-xl bg-white/15 px-3 py-1.5 text-xs">
              <span className="text-white/80">🏪 Nama Warung</span>
              <span className="flex items-center gap-1 font-bold text-white">
                Warung Nasi Pak Joko <span className="font-black text-emerald-300 animate-pop-check">✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/15 px-3 py-1.5 text-xs">
              <span className="text-white/80">🏷️ Kategori</span>
              <span className="flex items-center gap-1 font-bold text-white">
                F&amp;B / Warung Makan <span className="font-black text-emerald-300 animate-pop-check">✓</span>
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/15 px-3 py-1.5 text-xs">
              <span className="text-white/80">📱 No. WhatsApp</span>
              <span className="flex items-center gap-1 font-bold text-white">
                0812-xxxx-4409 <span className="font-black text-emerald-300 animate-pop-check">✓</span>
              </span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/20 py-1.5 text-xs font-black text-emerald-200 animate-float-slow">
            <Icon name="bolt" className="h-4 w-4 text-amber-300 animate-pulse" />
            <span>QRIS Terbit Instan &lt; 5 Detik</span>
          </div>

          <div className="mt-2 flex items-center justify-around text-[10px] font-semibold text-white/80">
            <span>🛡️ Tanpa e-KTP di Awal</span>
            <span>•</span>
            <span>Rp0 Biaya</span>
            <span>•</span>
            <span>Kode Terpasang Otomatis</span>
          </div>
        </div>
      ),
    },
    {
      tag: '[D] DESIRE · NILAI & REWARD',
      title: 'Raih Reward Saldo Bertahap s/d Rp40.000',
      subtitle: 'Tahap 1: Rp10.000 di transaksi pertama ≥Rp10k · Tahap 2: Rp30.000 saat 5 transaksi unik lolos verifikasi.',
      visual: (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-amber-300/40 bg-white/15 p-2.5">
              <p className="text-[10px] font-bold text-amber-200">TAHAP 1</p>
              <p className="mt-0.5 text-lg font-black text-white">+Rp10.000</p>
              <p className="text-[9px] text-white/80">Transaksi min. Rp10k</p>
            </div>
            <div className="rounded-xl border border-emerald-300/40 bg-white/15 p-2.5">
              <p className="text-[10px] font-bold text-emerald-200">TAHAP 2</p>
              <p className="mt-0.5 text-lg font-black text-white">+Rp30.000</p>
              <p className="text-[9px] text-white/80">5 transaksi unik pembeli</p>
            </div>
          </div>
          <div className="mt-2.5 rounded-xl border border-amber-300/40 bg-amber-400/20 p-2 text-center">
            <p className="text-[11px] font-black text-amber-200">
              Total Rp40.000 Saldo DANA per Warung Binaan
            </p>
            <p className="text-[9px] text-white/80">⭐ Ditambah Bonus Rp1.000.000 tiap 50 warung aktif!</p>
          </div>
        </div>
      ),
    },
    {
      tag: '[A] ACTION · LANGKAH NYATA',
      title: 'Ajak Warung Langgananmu Hari Ini!',
      subtitle: 'Tiga langkah mudah: tanya nomor WA warung, masukkan di Bantu Daftarkan, dan dampingi transaksi pertamanya!',
      visual: (
        <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-md space-y-2">
          {[
            ['1', 'Tanya nama & No. WhatsApp pemilik warung saat jajan.'],
            ['2', 'Ketik di fitur "Bantu Daftarkan" (kode referral otomatis terisi).'],
            ['3', 'Dampingi transaksi pertama ≥Rp10k pakai DANA untuk cairkan reward!'],
          ].map(([num, text]) => (
            <div key={num} className="flex items-center gap-2.5 rounded-xl bg-white/15 p-2 text-xs">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-amber-950">
                {num}
              </span>
              <p className="text-[11px] font-semibold text-white/90 leading-tight">{text}</p>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const curr = slides[step];

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
                className={`h-full transition-all duration-300 ${
                  step === i ? 'w-full bg-white shadow-sm' : step > i ? 'w-full bg-white/90' : 'w-0'
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
              PANDUAN REFERER (AIDA MODEL)
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-xs transition hover:bg-white/25 active:scale-95"
          >
            LEWATI <Icon name="close" className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="pointer-events-none relative flex-1 px-5 py-2 flex flex-col justify-center">
        <div>
          <div className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[9px] font-black tracking-widest uppercase text-amber-200">
            {curr.tag}
          </div>
          <h2 className="mt-2 text-xl font-black leading-tight text-white">{curr.title}</h2>
          <p className="mt-1 text-xs text-white/85 leading-snug">{curr.subtitle}</p>

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
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 py-3.5 text-center text-sm font-black text-amber-950 shadow-xl shadow-amber-500/30 transition active:scale-98"
          >
            Bantu Daftarkan Warung Sekarang! <Icon name="next" className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-white/20 py-2.5 text-center text-xs font-bold text-white transition active:bg-white/30"
          >
            Lanjut ke Langkah Berikutnya →
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
  const showGuide = (!s.hasSeenAffiliateGuide && s.role === 'consumer') || manualGuide;
  const handleCloseGuide = () => {
    setManualGuide(false);
    if (!s.hasSeenAffiliateGuide && patch) {
      patch({ hasSeenAffiliateGuide: true });
    }
  };
  const biz = s.role === 'merchant';
  const inProgress = s.referrals.filter((r) => r.stage === 1).length;

  if (showGuide) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-slate-900">
        <AffiliateCarouselGuide isOpen={true} onClose={handleCloseGuide} />
      </div>
    );
  }

  return (
    <MiniShell title="Affiliate DANA Bisnis" tab="hub" {...p} unread={2}>

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
              <p className="text-xs font-bold text-dana-900">Panduan Lengkap Affiliate DANA</p>
              <p className="text-[10px] text-dana-700">Skema 2 tahap reward s/d Rp40.000 per warung</p>
            </div>
          </div>
          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-dana-700 shadow-2xs">
            Buka
          </span>
        </button>

        <div className="mt-4 space-y-4">
          {/* Summary card */}
          <div className="rounded-3xl bg-gradient-to-br from-dana-500 to-dana-900 p-4 text-white shadow-lg shadow-dana-700/25">
            <p className="text-[11px] text-white/80">Total Saldo Reward Masuk ke Akun Anda</p>
            <p className="text-3xl font-extrabold">{rupiah(earned)}</p>
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
              {TIERS.map((t, i) => (
                <div key={t.stage} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dana-50 text-[11px] font-bold text-dana-700">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">{t.label}</p>
                    <p className="text-[10px] text-slate-500">{t.detail}</p>
                    <p className="mt-0.5 text-[9px] font-medium text-emerald-600">Benefit Warung: {t.merchant}</p>
                  </div>
                  <span className="text-xs font-extrabold text-dana-700">
                    {t.amount > 0 ? rupiah(t.amount) : 'Rp 0'}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-500">
              * Reward Tahap 1 &amp; 2 otomatis masuk langsung ke Saldo Pocket DANA Anda saat syarat transaksi terpenuhi.
            </p>
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

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-500">Panduan Affiliate</p>
            {[
              ['Kelebihan QRIS DANA Bisnis', 'Potongan 0%, saldo langsung ditarik, Nada DANA, AI foto produk, Rekan DANA'],
              ['Cara Daftar DANA Bisnis', 'Jalur cepat: 3 data lewat link undangan, e-KTP menyusul saat pencairan'],
              ['FAQ Komisi & Saldo', 'Reward 2 tahap otomatis masuk saldo Pocket DANA tanpa perlu klaim manual'],
            ].map(([title, desc]) => (
              <button
                key={title}
                onClick={() => notify(`${title}: ${desc}`)}
                className="mt-3 flex w-full items-center gap-3 border-t border-slate-100 pt-3 text-left first:border-0 first:pt-0"
              >
                <span className="flex-1">
                  <span className="block text-xs font-bold text-slate-800">{title}</span>
                  <span className="block text-[10px] leading-snug text-slate-500">{desc}</span>
                </span>
                <Icon name="next" className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </MiniShell>
  );
}

/* --------------------------------- assisted nomination form */

function Nominate(p) {
  const { s, nominate, go } = p;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [phone, setPhone] = useState('');
  const phoneOk = /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(phone.replace(/[\s-]/g, ''));
  const ready = name.trim().length >= 3 && category && phoneOk;

  return (
    <MiniShell title="Bantu Daftarkan Warung" onBack={() => go('hub')} {...p}>
      <div className="space-y-3 px-4 pt-3 pb-8">
        <p className="rounded-2xl bg-dana-50 p-3 text-[11px] leading-relaxed text-dana-700">
          Cukup 30 detik. DANA yang menghubungi pemilik usaha dengan undangan resmi berisi namamu, dan kode{' '}
          <strong>{REFERRAL_CODE}</strong> sudah tertanam di link — tidak perlu diketik manual.
        </p>

        <Field step="1" label="Nama usaha / warung" hint="Contoh: Warung Nasi Pak Joko">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tulis nama warung langganan"
            className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-dana-500"
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
            className={`w-full rounded-xl border px-3 py-3 text-sm outline-none ${phone && !phoneOk ? 'border-red-400' : 'border-slate-200 focus:border-dana-500'
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
  const list = s.referrals
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
            className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400"
          />
        </div>
      </div>
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 pb-3">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition ${
              tab === id ? 'bg-dana-500 text-white shadow-sm' : 'bg-white text-slate-500 shadow-xs'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 px-4 pb-8">
        {list.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-center text-xs text-slate-400">Tidak ada usaha di kategori ini.</p>
        )}
        {list.map((r) => {
          const isRegisteredNoTx = r.stage === 1 && (r.tx === 0 || !r.tx);
          const isStage1Done = r.stage === 1 && r.tx >= 1;
          const isStage2Done = r.stage >= 2;

          const st = isStage2Done
            ? { label: 'Tahap 2 Selesai · Merchant Aktif', short: 'Aktif', color: 'emerald', progress: 100 }
            : isStage1Done
            ? { label: 'Tahap 1 Selesai · Menuju 5 Transaksi Unik', short: 'Tahap 1 Selesai', color: 'amber', progress: 75 }
            : isRegisteredNoTx
            ? { label: 'Terdaftar (QRIS Aktif) · Menunggu Transaksi Pertama', short: 'Terdaftar', color: 'amber', progress: 50 }
            : { label: 'Undangan terkirim, menunggu pendaftaran', short: 'Terkirim', color: 'slate', progress: 25 };

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
              <div className="mt-2 flex gap-1.5 text-[9px] font-bold">
                {[
                  ['Undangan', true],
                  ['Terdaftar', r.stage >= 1],
                  ['Transaksi ≥Rp10k', r.stage >= 1 && r.tx >= 1],
                  ['Aktif (5 tx)', r.stage >= 2],
                ].map(([label, done]) => (
                  <span
                    key={label}
                    className={`flex-1 rounded-md py-1 text-center ${
                      done ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
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
  const [selectedRole, setSelectedRole] = useState(s.role || 'consumer');

  const quotas = s.rewardQuotas || {
    merchant: { transfer: 10, admin: 10 },
    referred: { withdraw: 7, admin: 10 },
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
        merchant: { transfer: 10, admin: 10 },
        referred: { withdraw: 7, admin: 10 },
      },
    });
    notify('Kupon reward berhasil direset ke kuota awal.');
  };

  return (
    <MiniShell title="Management Reward" tab="rewards" {...p}>
      <div className="space-y-4 px-4 pt-3 pb-8">
        {/* Role Selector Tabs */}
        <div className="flex rounded-xl bg-slate-200 p-1 text-[11px] font-bold">
          {[
            ['consumer', 'Rian (Konsumen)'],
            ['merchant', 'Bu Ratna (Mitra)'],
            ['referred', 'Pak Joko (Warung)'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSelectedRole(id)}
              className={`flex-1 rounded-lg py-1.5 transition ${
                selectedRole === id ? 'bg-dana-500 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ROLE 1: RIAN (KONSUMEN) */}
        {selectedRole === 'consumer' && (
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
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-dana-50 px-2 py-0.5 text-[9px] font-extrabold text-dana-700">
                    TAHAP 1
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Saldo DANA Rp10.000</h4>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Cair otomatis di transaksi pertama warung binaan ≥ Rp10.000
                  </p>
                </div>
                <span className="text-sm font-black text-emerald-600">+Rp10.000</span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Syarat &amp; Ketentuan:</p>
                <p>• Warung binaan (Pak Joko) terbit QRIS &amp; menerima pembayaran pertama min. Rp10k.</p>
                <p>• Uang Rp10.000 seketika masuk ke Pocket Saldo DANA pengundang.</p>
              </div>
            </div>

            {/* Tahap 2 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                    TAHAP 2
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Saldo DANA Rp30.000</h4>
                  <p className="mt-0.5 text-[10px] text-slate-500">
                    Total reward: Rp40.000 per warung aktif binaan
                  </p>
                </div>
                <span className="text-sm font-black text-emerald-600">+Rp30.000</span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Syarat &amp; Ketentuan:</p>
                <p>• 5 transaksi unik dari pembeli berbeda dalam 1–14 hari.</p>
                <p>• Lolos audit validitas transaksi DANA untuk mencegah fraud.</p>
              </div>
            </div>

            {/* Hadiah Pencapaian */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Icon name="trophy" className="h-4 w-4 text-amber-600" />
                <p className="flex-1 text-xs font-bold text-amber-950">Hadiah Pencapaian Rp1.000.000</p>
                <Pill tone="amber">Rp1 Juta</Pill>
              </div>
              <p className="mt-1 text-[10px] text-amber-800">
                Ekstra bonus Rp1.000.000 setiap kelipatan 50 warung aktif binaan!
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${Math.min(100, (activeCount / 50) * 100)}%` }}
                />
              </div>
              <p className="mt-1 text-[9px] font-bold text-amber-900">
                {activeCount} / 50 warung aktif memakai QRIS
              </p>
            </div>
          </div>
        )}

        {/* ROLE 2: BU RATNA (MITRA BISNIS) */}
        {selectedRole === 'merchant' && (
          <div className="space-y-3">
            <div className="rounded-3xl bg-gradient-to-br from-[#1B4E9B] to-slate-900 p-4 text-white shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Reward Bu Ratna · Mitra Bisnis</p>
              <p className="mt-1 text-sm font-black text-white">Martabak Bu Ratna</p>
              <p className="mt-1 text-[11px] text-white/80">
                Kelola kupon gratis transfer &amp; bebas biaya admin hasil mereferensikan warung rekanan.
              </p>
              <div className="mt-3 flex gap-2 text-center text-xs">
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-amber-300">{quotas.merchant?.transfer ?? 10}x</span>
                  <span className="text-[9px] text-white/80">Sisa Gratis Transfer</span>
                </div>
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-emerald-300">{quotas.merchant?.admin ?? 10}x</span>
                  <span className="text-[9px] text-white/80">Sisa Bebas Admin</span>
                </div>
              </div>
            </div>

            {/* Tahap 1 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-dana-50 px-2 py-0.5 text-[9px] font-extrabold text-dana-700">
                    TAHAP 1
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Gratis Transfer Antar Bank 10x</h4>
                  <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
                    ⏰ Expired dalam 1 bulan (30 hari sejak diperoleh)
                  </p>
                </div>
                <span className="rounded-lg bg-dana-50 px-2.5 py-1 text-xs font-black text-dana-700">
                  {quotas.merchant?.transfer ?? 10}/10
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Cakupan &amp; Syarat:</p>
                <p>• Bebas biaya transfer antar bank Rp2.500 ke rekening mana saja di Indonesia.</p>
                <p>• Aktif saat warung binaan (Pak Joko) selesai daftar QRIS &amp; transaksi pertama ≥Rp10k.</p>
              </div>
              <button
                onClick={() => handleUseVoucher('merchant', 'transfer', 'Gratis Transfer Antar Bank')}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-dana-500 py-2.5 text-xs font-bold text-white active:bg-dana-600 shadow-xs"
              >
                Gunakan Kupon (Kirim Saldo / Transfer)
              </button>
            </div>

            {/* Tahap 2 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                    TAHAP 2
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Gratis Admin 10x</h4>
                  <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
                    ⏰ Expired dalam 1 bulan (30 hari sejak diperoleh)
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                  {quotas.merchant?.admin ?? 10}/10
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Cakupan Layanan Bebas Biaya Admin:</p>
                <p className="text-emerald-700 font-semibold">
                  • Termasuk bayar listrik PLN, isi pulsa &amp; data, transfer antar bank, top up e-money, dll.
                </p>
                <p>• Aktif setelah 5 transaksi unik warung binaan lolos validasi DANA.</p>
              </div>
              <button
                onClick={() => handleUseVoucher('merchant', 'admin', 'Gratis Admin 10x')}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white active:bg-emerald-700 shadow-xs"
              >
                Gunakan Kupon (Bebas Biaya Admin)
              </button>
            </div>
          </div>
        )}

        {/* ROLE 3: PAK JOKO (WARUNG TERDAFTAR) */}
        {selectedRole === 'referred' && (
          <div className="space-y-3">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-slate-900 p-4 text-white shadow-lg">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Reward Pak Joko · Merchant Binaan</p>
              <p className="mt-1 text-sm font-black text-white">Warung Nasi Pak Joko</p>
              <p className="mt-1 text-[11px] text-white/80">
                Benefit eksklusif merchant baru: Tarik tunai gratis, bebas admin, 0% MDR, dan modal usaha.
              </p>
              <div className="mt-3 flex gap-2 text-center text-xs">
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-amber-300">{quotas.referred?.withdraw ?? 7}x</span>
                  <span className="text-[9px] text-white/80">Gratis Tarik Tunai</span>
                </div>
                <div className="flex-1 rounded-xl bg-white/15 p-2">
                  <span className="block text-base font-black text-emerald-300">{quotas.referred?.admin ?? 10}x</span>
                  <span className="text-[9px] text-white/80">Gratis Bebas Admin</span>
                </div>
              </div>
            </div>

            {/* Tahap 1 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-dana-50 px-2 py-0.5 text-[9px] font-extrabold text-dana-700">
                    TAHAP 1
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Gratis Tarik Tunai 7x</h4>
                  <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
                    ⏰ Expired dalam 1 bulan (30 hari sejak diperoleh)
                  </p>
                </div>
                <span className="rounded-lg bg-dana-50 px-2.5 py-1 text-xs font-black text-dana-700">
                  {quotas.referred?.withdraw ?? 7}/7
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Cakupan &amp; Syarat:</p>
                <p>• Bebas biaya tarik tunai saldo penjualan di ATM BCA/BRI atau gerai Alfamart/Indomaret.</p>
                <p>• Aktif setelah QRIS terbit &amp; transaksi pertama min. Rp10.000 diterima.</p>
                <p className="text-emerald-700 font-bold">• Ekstra: Bonus Modal Usaha Rp15.000 + 0% MDR!</p>
              </div>
              <button
                onClick={() => handleUseVoucher('referred', 'withdraw', 'Gratis Tarik Tunai')}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-dana-500 py-2.5 text-xs font-bold text-white active:bg-dana-600 shadow-xs"
              >
                Gunakan Kupon (Tarik Tunai Kasir/ATM)
              </button>
            </div>

            {/* Tahap 2 Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700">
                    TAHAP 2
                  </span>
                  <h4 className="mt-1.5 text-sm font-black text-slate-900">Gratis Admin 10x</h4>
                  <p className="mt-0.5 text-[10px] font-semibold text-rose-600">
                    ⏰ Expired dalam 1 bulan (30 hari sejak diperoleh)
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                  {quotas.referred?.admin ?? 10}/10
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-[10px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Cakupan &amp; Syarat:</p>
                <p className="text-emerald-700 font-semibold">
                  • Bebas biaya admin transaksi bayar tagihan listrik warung, isi pulsa &amp; data, transfer bank, dll.
                </p>
                <p>• Aktif setelah 5 transaksi unik dari pembeli berbeda tercapai.</p>
              </div>
              <button
                onClick={() => handleUseVoucher('referred', 'admin', 'Gratis Admin 10x')}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white active:bg-emerald-700 shadow-xs"
              >
                Gunakan Kupon (Bebas Biaya Admin)
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleResetQuotas}
          className="w-full text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 py-2"
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

  const appItems = [
    m.firstPayment >= 10000 && {
      tone: 'emerald',
      icon: 'bolt',
      title: `Tahap 1 Selesai : ${m.name}`,
      body: `Reward Rp10.000 otomatis masuk ke Saldo Pocket DANA.`,
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
      body: 'Reward Rp30.000 otomatis masuk ke Saldo Pocket DANA.',
      time: 'Kemarin',
    },
    {
      tone: 'emerald',
      icon: 'bolt',
      title: 'Tahap 1 Selesai : Kopi Pak Rudi',
      body: 'Reward Rp10.000 otomatis masuk ke Saldo Pocket DANA.',
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
            className={`flex-1 rounded-lg py-1.5 transition ${
              tab === 'app' ? 'bg-dana-500 text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Notifikasi DANA ({appItems.length})
          </button>
          <button
            onClick={() => setTab('wa')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 transition ${
              tab === 'wa' ? 'bg-[#25D366] text-white shadow-xs' : 'text-slate-600'
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
      title: 'Bebas Potongan (0% MDR)',
      desc: 'Hasil jualan masuk 100% utuh tanpa biaya potongan admin.',
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
            className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-dana-500"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-slate-700">2. Kategori usaha</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-dana-500"
          >
            <option value="">Pilih kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
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

function Qris({ s, go, notify, testScan, receivePayment, inviter }) {
  const m = s.merchant;
  const isPaid = m.firstPayment >= 10000;

  const steps = [
    { done: m.issued, title: 'QRIS toko aktif (KYC Light)', desc: 'Akun siap menerima pembayaran digital dari seluruh bank & e-wallet.' },
    {
      done: m.testScan,
      title: 'Uji coba scan QRIS toko',
      desc: 'Scan QRIS untuk mencoba pembayaran dan mendengarkan Nada DANA.',
    },
    {
      done: isPaid,
      title: 'Terima pembayaran pertama min. Rp10.000',
      desc: 'Uang penjualan masuk 100% utuh (0% MDR) dan aktifkan bonus modal usaha Rp15.000.',
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
        <Btn variant="green" onClick={() => go('bizprofile')}>
          Buka Profil DANA Bisnis &amp; Panduan Toko
        </Btn>

        {m.firstPayment > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
              <Icon name="sound" className="h-4 w-4" /> Pembayaran pertama {rupiah(m.firstPayment)} diterima
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
              Pembayaran berhasil diterima! Uang penjualan masuk 100% utuh tanpa potongan MDR + Saldo Modal Usaha Rp15.000 telah ditambahkan ke saldo tokomu.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Checklist Hari Pertama</p>
          <div className="mt-3 space-y-3">
            {steps.map((st, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${st.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                >
                  {st.done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <div className="flex-1">
                  <p className={`text-xs font-bold ${st.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                    {st.title}
                  </p>
                  <p className="text-[10px] leading-snug text-slate-500">{st.desc}</p>
                  {!st.done && st.action && (
                    <button
                      onClick={st.action.onClick}
                      className="mt-2 rounded-full bg-dana-50 px-3 py-1.5 text-[10px] font-bold text-dana-700 active:bg-dana-100"
                    >
                      {st.action.label}
                    </button>
                  )}
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
            Potongan 0% MDR, nominal masuk utuh tanpa biaya admin.
          </p>
        </div>
      </div>
    </Shell>
  );
}

/* -------------------------- Profile Bisnis & Step-by-Step Guidance (Referred Merchant) */

function BizProfile(props) {
  return <BizDash {...props} initialTour={true} />;
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

export default {
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
};

