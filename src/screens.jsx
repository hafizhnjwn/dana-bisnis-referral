/**
 * Screens of the Affiliate DANA Bisnis Mini Program (v2.0) plus the referred
 * warung's mobile-web flow. Host-app replicas live in hostApp.jsx.
 */
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { LEGACY, STAGES, TIERS, pendingTiers, rupiah } from './rewards.js';
import { BizDash, Grid, Home } from './hostApp.jsx';
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

const MINI_TABS = [
  { id: 'hub', label: 'Beranda', icon: 'store' },
  { id: 'tracker', label: 'Referal', icon: 'users' },
  { id: 'peringkat', label: 'Peringkat', icon: 'trophy' },
  { id: 'inbox', label: 'Inbox', icon: 'bell' },
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

function Hub(p) {
  const { s, go, notify, user, earned, claimable, activeCount } = p;
  const [mode, setMode] = useState('warung');
  const biz = s.role === 'merchant';
  const trackLabel = biz ? 'Mitra Bisnis' : 'Sahabat Warung';
  const inProgress = s.referrals.filter((r) => r.stage > 0 && r.stage < 3).length;

  return (
    <MiniShell title="Affiliate DANA Bisnis" tab="hub" {...p} unread={2}>
      <div className="px-4 pt-3 pb-8">
        <div className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dana-50 text-sm font-bold text-dana-700">
            {user.initial}
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800">{user.name}</p>
            <p className="text-[10px] text-slate-400">{biz ? 'Merchant DANA Bisnis' : 'Pengguna DANA'}</p>
          </div>
          <Pill tone="dana">{trackLabel}</Pill>
        </div>

        <div className="mt-3 flex rounded-full bg-slate-100 p-1 text-[11px] font-bold">
          {[
            ['warung', trackLabel],
            ['kreator', 'Affiliate Kreator'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex-1 rounded-full py-2 ${mode === id ? 'bg-dana-500 text-white' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-center text-[10px] text-slate-400">
          {mode === 'warung'
            ? 'Mode baru untuk referral komunitas offline'
            : 'Mode yang sudah berjalan untuk kreator & promotor'}
        </p>

        {mode === 'warung' ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-dana-500 to-dana-900 p-4 text-white shadow-lg shadow-dana-700/25">
              <p className="text-[11px] text-white/80">Total hadiah diterima</p>
              <p className="text-3xl font-extrabold">{rupiah(earned)}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  [inProgress, 'Dalam proses'],
                  [rupiah(claimable.total), 'Siap klaim'],
                  ['#42', 'Peringkat 30 hari'],
                ].map(([v, k]) => (
                  <span key={k} className="rounded-xl bg-white/15 p-2">
                    <span className="block text-sm font-bold">{v}</span>
                    <span className="text-[9px] text-white/80">{k}</span>
                  </span>
                ))}
              </div>
            </div>

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
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Btn variant="green" onClick={() => notify('WhatsApp terbuka: link undangan sudah membawa kode referral, warung tidak perlu mengetik apa pun.')}>
                  <Icon name="share" className="h-4 w-4" /> Bagikan
                </Btn>
                <Btn variant="subtle" onClick={() => notify('QR undangan siap discan langsung di depan warung.')}>
                  <Icon name="qr" className="h-4 w-4" /> QR Undangan
                </Btn>
              </div>
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
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[10px] leading-relaxed font-semibold text-amber-700">
                Menghapus hambatan terbesar program lama: pemilik warung tidak perlu lagi mengetik kode referral
                secara manual atau memikirkan kategori usaha dari nol.
              </p>
            </button>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Hadiah bertahap untuk dua belah pihak</p>
              <div className="mt-3 space-y-3">
                {TIERS.map((t, i) => (
                  <div key={t.stage} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dana-50 text-[11px] font-bold text-dana-700">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{t.label}</p>
                      <p className="text-[10px] text-slate-500">Warung: {t.merchant}</p>
                    </div>
                    <span className="text-xs font-extrabold text-dana-700">{rupiah(t.amount)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-[10px] leading-relaxed text-slate-500">
                Total s/d {rupiah(50000)} per warung untuk kamu, s/d {rupiah(25000)} untuk warung. Saldo tunai
                terbuka setelah transaksi QRIS asli ≥ Rp10.000.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Icon name="trophy" className="h-4 w-4 text-amber-500" />
                <p className="flex-1 text-xs font-bold text-slate-700">Hadiah Pencapaian</p>
                <Pill tone="amber">{rupiah(LEGACY.achievementBonus)}</Pill>
              </div>
              <p className="mt-2 text-[10px] text-slate-500">
                Bonus {rupiah(LEGACY.achievementBonus)} setiap {LEGACY.achievementPer} usaha aktif memakai QRIS-nya
                (tetap seperti program yang berjalan).
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
                ['FAQ Komisi & Verifikasi', 'Kapan hadiah cair, apa saja yang diperiksa tim risiko'],
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

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-extrabold text-emerald-800">Yang berubah dari program sekarang</p>
              <div className="mt-2 space-y-2 text-[10px] leading-relaxed text-emerald-900/90">
                <p>
                  <strong>Dulu:</strong> {rupiah(LEGACY.commission)} hanya cair setelah {LEGACY.txCriteria} transaksi
                  dan audit {LEGACY.verification}. Warung yang berhenti di 2 transaksi = Rp0 untuk kamu.
                </p>
                <p>
                  <strong>Sekarang:</strong> hadiah mulai terbuka sejak QRIS terbit, transaksi pertama langsung
                  membayar {rupiah(20000)} tunai, dan warung juga menerima hadiah.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Btn variant="ghost" onClick={() => go('tracker')}>
                <Icon name="users" className="h-4 w-4" /> Referal Saya
              </Btn>
              <Btn variant="ghost" onClick={() => go('rewards')}>
                <Icon name="gift" className="h-4 w-4" /> Hadiah Saya
              </Btn>
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Komisi Utama (program berjalan)</p>
              <p className="text-3xl font-extrabold text-slate-900">{rupiah(LEGACY.commission)}</p>
              <p className="text-[10px] text-slate-500">per usaha aktif yang lolos audit</p>
              <div className="mt-3 space-y-1 text-[10px] text-slate-600">
                <p>· Kriteria usaha aktif: minimal {LEGACY.txCriteria} transaksi QRIS.</p>
                <p>· Pengecekan tim risiko: {LEGACY.verification}.</p>
                <p>· Pencairan: {LEGACY.disbursement}.</p>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-dana-700 p-4 text-white">
              <p className="text-sm font-extrabold">Ada Affiliate yang sudah dapat Rp90 juta, lho!</p>
              <p className="mt-1 text-[11px] text-white/85">
                Kreator teratas mendaftarkan 800–900 usaha aktif. Mode ini tetap dipertahankan apa adanya.
              </p>
              <button
                onClick={() => go('peringkat')}
                className="mt-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-violet-700"
              >
                Lihat Papan Peringkat
              </button>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">4 langkah dapat komisi</p>
              {[
                'Bagikan kode referral atau link ke audiens kamu.',
                'Usaha mendaftar DANA Bisnis dan mengisi kode referralmu.',
                `Usaha menyelesaikan minimal ${LEGACY.txCriteria} transaksi QRIS.`,
                'Komisi masuk otomatis ke Saldo DANA setelah lolos audit.',
              ].map((step, i) => (
                <div key={i} className="mt-3 flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-[11px] leading-snug text-slate-700">{step}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-[11px] leading-relaxed text-amber-800">
                <strong>Catatan produk:</strong> mode kreator sengaja tidak diubah. Yang ditambahkan adalah mode{' '}
                <strong>{trackLabel}</strong> untuk pengguna harian yang hanya ingin warung langganannya menerima
                QRIS, tanpa target ratusan merchant.
              </p>
            </div>
          </div>
        )}
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

        <Field step="1" label="Nama usaha / warung" hint="Contoh: Warung Nasi Bu Siti">
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
        <p className="text-center text-[10px] text-slate-400">
          Setelah terkirim, ganti peran ke <strong>Bu Siti</strong> di panel kiri untuk melihat sisi warung.
        </p>
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
  ['progress', 'Dalam Proses'],
  ['active', 'Aktif (Siap Klaim)'],
  ['champion', 'Juara'],
];

function Tracker(p) {
  const { s, go, nudge } = p;
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');
  const list = s.referrals
    .filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
    .filter((r) => {
      if (tab === 'progress') return r.stage < 2;
      if (tab === 'active') return r.stage >= 2 && pendingTiers(r).length > 0;
      if (tab === 'champion') return r.stage === 3;
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
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold ${tab === id ? 'bg-dana-500 text-white' : 'bg-white text-slate-500 shadow-sm'
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
          const st = STAGES[r.stage];
          const style = STAGE_STYLE[st.color];
          const pending = pendingTiers(r);
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
                {['Daftar', 'Transaksi 1', '5x / 14 hari'].map((label, i) => (
                  <span
                    key={label}
                    className={`flex-1 rounded-md py-1 text-center ${r.stage > i ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-slate-500">
                Transaksi QRIS tercatat: <strong>{Math.min(r.tx, 5)}/5</strong>
                {r.tx > 5 && ` (total ${r.tx})`}
              </p>

              {pending.length > 0 && (
                <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700">
                  {rupiah(pending.reduce((a, t) => a + t.amount, 0))} siap diklaim
                </p>
              )}
              {r.stage <= 1 && (
                <button
                  onClick={() => nudge(r)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500 py-2.5 text-[11px] font-bold text-emerald-600 active:bg-emerald-50"
                >
                  <Icon name="share" className="h-3.5 w-3.5" /> Ingatkan Pemilik Toko via WA
                </button>
              )}
              {r.stage === 3 && pending.length === 0 && (
                <p className="mt-3 text-[10px] font-semibold text-violet-600">
                  Merchant Juara · semua hadiah sudah dibayarkan
                </p>
              )}
            </div>
          );
        })}
        <p className="rounded-2xl bg-dana-50 p-3 text-[10px] leading-relaxed text-dana-700">
          Program berjalan hanya menampilkan status <em>Semua</em> dan <em>Belum Aktif</em> tanpa indikator progres.
          Di sini setiap tahap dan hitungan transaksi terlihat, sehingga referrer tahu kapan perlu mendorong.
        </p>
        <Btn onClick={() => go('rewards')}>
          <Icon name="gift" className="h-4 w-4" /> Buka Pusat Hadiah
        </Btn>
      </div>
    </MiniShell>
  );
}

/* ------------------------------------------- reward claim center */

function Rewards(p) {
  const { go, claim, claimable, earned, activeCount, user } = p;
  return (
    <MiniShell title="Hadiah & Komisi Saya" onBack={() => go('tracker')} {...p}>
      <div className="space-y-4 px-4 pt-3 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-dana-500 to-dana-900 p-5 text-white shadow-lg shadow-dana-700/25">
          <p className="text-[11px] text-white/80">Siap diklaim</p>
          <p className="text-4xl font-extrabold">{rupiah(claimable.total)}</p>
          <p className="mt-1 text-[11px] text-white/80">
            {rupiah(claimable.saldo)} Saldo DANA · {rupiah(claimable.voucher)} voucher
          </p>
          <button
            onClick={claim}
            disabled={!claimable.total}
            className="mt-4 w-full rounded-2xl bg-white py-3.5 text-sm font-extrabold text-dana-700 disabled:bg-white/30 disabled:text-white/70"
          >
            Klaim Saldo DANA Sekarang
          </button>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Rincian hadiah terbuka</p>
          {claimable.rows.length === 0 && (
            <p className="mt-3 text-[11px] text-slate-400">
              Semua hadiah sudah diklaim. Hadiah baru muncul saat usaha mencapai milestone berikutnya.
            </p>
          )}
          {claimable.rows.map((row, i) => (
            <div key={i} className="mt-3 flex items-start gap-3 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{row.merchant}</p>
                <p className="text-[10px] text-slate-500">{row.label}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-extrabold text-emerald-600">+{rupiah(row.amount)}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">{row.type}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          {[
            ['Total sudah dibayarkan', rupiah(earned)],
            [`Saldo DANA ${user.name.split(' ')[0]}`, rupiah(user.balance)],
            ['Usaha aktif (menuju bonus Rp1jt)', `${activeCount} / ${LEGACY.achievementPer}`],
          ].map(([k, v]) => (
            <div key={k} className="mt-2 flex justify-between text-xs first:mt-0">
              <span className="text-slate-500">{k}</span>
              <span className="font-bold text-slate-800">{v}</span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-[11px] font-bold text-emerald-800">
            <Icon name="bolt" className="h-4 w-4" /> Kenapa terasa lebih cepat
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-emerald-900/90">
            Program berjalan mencairkan komisi maksimal 48 jam setelah audit {LEGACY.verification}. Di sini
            pemeriksaan risiko berjalan otomatis saat transaksi pertama tercatat, sehingga Tier 2 bisa langsung
            diklaim. Kasus yang ditandai berisiko tetap masuk peninjauan manual.
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 text-[11px] font-bold text-amber-800">
            <Icon name="lock" className="h-4 w-4" /> Ketentuan & perlindungan anti-fraud
          </p>
          <ul className="mt-2 space-y-1 text-[10px] leading-relaxed text-amber-800/90">
            <li>· Pembayar dan merchant tidak boleh berbagi perangkat, subnet IP, atau NIK yang sama.</li>
            <li>· Usia akun pembayar minimal 14 hari; 5 transaksi harus dari 5 akun berbeda.</li>
            <li>· Tier 1 berupa voucher; saldo tunai terbuka dari Tier 2.</li>
            <li>· Hadiah kedaluwarsa 30 hari setelah terbuka jika tidak diklaim.</li>
          </ul>
        </div>
      </div>
    </MiniShell>
  );
}

/* ---------------------------------------- leaderboard & inspiration */

function Peringkat(p) {
  const { notify, activeCount } = p;
  const [sub, setSub] = useState('board');
  const [range, setRange] = useState('30');
  const board = [
    ['MIC***', 912, 40100000],
    ['LIA***', 874, 38400000],
    ['FRI***', 803, 36200000],
    ['AGU***', 512, 23000000],
    ['SIT***', 401, 18000000],
  ];
  const videos = [
    ['@andri.irv', 'Cara ajak warung langganan tanpa maksa'],
    ['@sudutbgrbarat', 'Script WhatsApp yang bikin warung mau daftar'],
    ['@mitra.dana.bisnis', 'Tips agar QRIS warung dipakai di hari pertama'],
  ];

  return (
    <MiniShell title="Peringkat & Inspirasi" tab="peringkat" {...p} unread={2}>
      <div className="px-4 pt-3 pb-8">
        <div className="flex rounded-full bg-slate-100 p-1 text-[11px] font-bold">
          {[
            ['board', 'Papan Peringkat'],
            ['content', 'Inspirasi Konten'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setSub(id)}
              className={`flex-1 rounded-full py-2 ${sub === id ? 'bg-dana-500 text-white' : 'text-slate-500'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {sub === 'board' ? (
          <>
            <div className="mt-4 flex gap-2">
              {['7', '30'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${range === r ? 'bg-dana-50 text-dana-700' : 'bg-white text-slate-500 shadow-sm'
                    }`}
                >
                  {r} hari
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500">Top 20 Affiliate · {range} hari</p>
              {board.map(([name, merchants, income], i) => (
                <div key={name} className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">{name}</p>
                    <p className="text-[10px] text-slate-400">
                      {Math.round(merchants * (range === '7' ? 0.28 : 1))} usaha aktif
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                    {rupiah(Math.round(income * (range === '7' ? 0.28 : 1)))}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border-2 border-dana-500 bg-dana-50 p-4">
              <p className="text-[11px] font-bold text-dana-700">Peringkat kamu: #42</p>
              <p className="mt-1 text-[10px] leading-relaxed text-dana-700/80">
                {activeCount} usaha aktif. Papan peringkat kreator dipertahankan, tapi mode Sahabat Warung tidak
                menuntut ratusan merchant — cukup warung di sekitarmu.
              </p>
            </div>
          </>
        ) : (
          <div className="mt-4 space-y-3">
            {videos.map(([handle, title]) => (
              <button
                key={handle}
                onClick={() => notify(`Video ${handle} diputar (simulasi).`)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm"
              >
                <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon name="play" />
                </span>
                <span className="flex-1">
                  <span className="block text-xs font-bold text-slate-800">{title}</span>
                  <span className="block text-[10px] text-slate-400">{handle}</span>
                </span>
              </button>
            ))}
            <p className="rounded-2xl bg-white p-3 text-[10px] leading-relaxed text-slate-500 shadow-sm">
              Tab ini milik program kreator yang sudah ada dan tidak diubah. Untuk pengguna Sahabat Warung, panduan
              yang relevan dipindahkan ke kartu Panduan Affiliate di Beranda.
            </p>
          </div>
        )}
      </div>
    </MiniShell>
  );
}

/* ------------------------------------------------------ inbox */

function Inbox(p) {
  const { s, go, claimable, inviter } = p;
  const m = s.merchant;
  const items = [
    m.firstPayment >= 10000 && {
      tone: 'emerald',
      icon: 'bolt',
      title: `${m.name} mencatat transaksi pertama`,
      body: `Pembayaran ${rupiah(m.firstPayment)} terverifikasi. Hadiah Rp20.000 siap diklaim.`,
      time: 'Baru saja',
    },
    m.issued && {
      tone: 'dana',
      icon: 'store',
      title: `${m.name} berhasil terbit QRIS`,
      body: 'Tier 1 terbuka: voucher Rp5.000 untuk kamu, Rp10.000 untuk warung.',
      time: '2 menit lalu',
    },
    {
      tone: 'violet',
      icon: 'trophy',
      title: 'Toko Kelontong Jaya jadi Merchant Juara',
      body: '5 transaksi unik dalam 14 hari tercapai. Bonus Rp25.000 terbuka.',
      time: 'Kemarin',
    },
    {
      tone: 'slate',
      icon: 'wallet',
      title: 'Komisi Rp45.000 telah dicairkan',
      body: `Pembayaran periode sebelumnya untuk ${inviter}, masuk dalam 48 jam setelah audit.`,
      time: '3 hari lalu',
    },
    {
      tone: 'amber',
      icon: 'lock',
      title: 'Info keamanan program',
      body: 'Nominasi dibatasi 3 per hari per perangkat. Pengajuan yang ditandai berisiko akan ditinjau manual.',
      time: '1 minggu lalu',
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
    <MiniShell title="Inbox" tab="inbox" {...p}>
      <div className="space-y-3 px-4 pt-3 pb-8">
        {claimable.total > 0 && (
          <button
            onClick={() => go('rewards')}
            className="w-full rounded-2xl bg-dana-500 p-3 text-left text-white shadow-lg shadow-dana-500/25"
          >
            <p className="text-xs font-extrabold">{rupiah(claimable.total)} siap diklaim</p>
            <p className="text-[10px] text-white/85">Ketuk untuk membuka Pusat Hadiah.</p>
          </button>
        )}
        {items.map((it, i) => (
          <div key={i} className="flex gap-3 rounded-2xl bg-white p-4 shadow-sm">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tones[it.tone]}`}>
              <Icon name={it.icon} className="h-4 w-4" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-800">{it.title}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-500">{it.body}</p>
              <p className="mt-1 text-[9px] text-slate-400">{it.time}</p>
            </div>
          </div>
        ))}
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
  const props = [
    ['wallet', 'QRIS bebas potongan (0%)', 'Semua hasil jualan masuk utuh, tanpa biaya bulanan.'],
    ['bolt', 'Saldo bisa langsung ditarik', 'Cairkan ke rekening kapan saja tanpa biaya admin.'],
    ['sound', 'Suara di tiap transaksi', 'Nada DANA menyebut nominal setiap pembayaran masuk.'],
    ['camera', 'Percantik foto produk', 'Rapikan foto menu dan poster jualan otomatis.'],
    ['users', 'Bisa jadi Rekan DANA', 'Tambah penghasilan dari layanan isi saldo tetangga.'],
  ];
  return (
    <Shell className="bg-white">
      <StatusBar />
      <BrowserBar />
      <div className="bg-gradient-to-b from-dana-500 to-dana-700 px-5 pt-6 pb-8 text-white">
        <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold">UNDANGAN PRIBADI</span>
        <p className="mt-3 text-xl leading-tight font-extrabold">
          {inviter} mengundang {s.merchant.name} bergabung ke DANA Bisnis
        </p>
        <p className="mt-2 text-[11px] leading-relaxed text-white/85">
          Pelanggan setia Anda sudah menyiapkan pendaftarannya. Kode referral {REFERRAL_CODE} sudah terpasang, tinggal
          konfirmasi dan QRIS langsung terbit.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/15 p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
            {inviter[0]}
          </span>
          <p className="text-[11px] leading-snug text-white/90">
            “Bu, biar saya bisa bayar pakai QRIS kalau makan di sini.”
          </p>
        </div>
      </div>

      <div className="space-y-3 px-5 py-5">
        <div className="rounded-2xl bg-emerald-50 p-3 text-center">
          <p className="text-xs font-extrabold text-emerald-800">Biaya pendaftaran Rp0</p>
          <p className="text-[10px] text-emerald-700">Plus bonus sambutan s/d Rp25.000 saat QRIS mulai dipakai.</p>
        </div>

        {props.map(([icon, title, desc]) => (
          <div key={title} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-dana-50 text-dana-600">
              <Icon name={icon} />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">{title}</p>
              <p className="text-[10px] leading-snug text-slate-500">{desc}</p>
            </div>
          </div>
        ))}

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-[10px] leading-relaxed text-slate-500">
            <strong>Sekarang tidak perlu di awal:</strong> foto e-KTP, selfie biometrik, NPWP, atau mengetik kode
            referral. Cukup 3 data usaha. Verifikasi DANA Premium diminta nanti, sebelum pencairan pertama ke
            rekening.
          </p>
        </div>

        <Btn variant="green" onClick={() => go('register')}>
          Daftar Gratis dalam 2 Menit
        </Btn>
        <p className="text-center text-[9px] leading-relaxed text-slate-400">
          DANA Bisnis berizin dan diawasi Bank Indonesia & OJK. QRIS mengikuti standar ASPI.
        </p>
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
  const steps = [
    { done: m.issued, title: 'QRIS berhasil diterbitkan', desc: 'Akun Anda siap menerima pembayaran.' },
    {
      done: m.testScan,
      title: 'Uji coba scan Rp1.000',
      desc: 'Minta teman scan Rp1.000 dan dengarkan Nada DANA menyebut nominalnya.',
      action: { label: 'Minta Scan Uji', onClick: testScan },
    },
    {
      done: m.firstPayment >= 10000,
      title: 'Terima pembayaran pertama ≥ Rp10.000',
      desc: 'Bonus modal usaha Rp15.000 masuk otomatis.',
      action: { label: 'Simulasi Pelanggan Bayar', onClick: () => receivePayment(12000) },
    },
  ];
  const merchantRewards = [
    [m.issued, 'Voucher pulsa/tagihan Rp10.000'],
    [m.firstPayment >= 10000, 'Saldo modal usaha Rp15.000'],
    [false, 'Potongan 0% 30 hari + badge DANA Juara (5 transaksi / 14 hari)'],
  ];

  return (
    <Shell>
      <StatusBar />
      <TopBar title="QRIS Saya" onBack={() => go('landing')} right={<Pill tone="emerald">AKTIF</Pill>} />
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

        {m.firstPayment > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold text-emerald-800">
              <Icon name="sound" className="h-4 w-4" /> Pembayaran pertama {rupiah(m.firstPayment)} diterima
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-emerald-700">
              Bonus modal usaha {rupiah(m.modalBonus)} masuk ke Saldo DANA Bisnis. {inviter.split(' ')[0]} juga
              menerima Rp20.000 tanpa harus menunggu 5 transaksi.
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
          <p className="text-xs font-bold text-slate-500">Bonus sambutan untuk usaha Anda</p>
          {merchantRewards.map(([done, label]) => (
            <p key={label} className="mt-2 flex items-start gap-2 text-[11px] leading-snug">
              <span className={done ? 'text-emerald-600' : 'text-slate-300'}>
                <Icon name={done ? 'check' : 'lock'} className="mt-0.5 h-3.5 w-3.5" />
              </span>
              <span className={done ? 'font-bold text-slate-800' : 'text-slate-500'}>{label}</span>
            </p>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-slate-500">Saldo DANA Bisnis</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {rupiah(m.firstPayment + m.modalBonus + (m.testScan ? 1000 : 0))}
          </p>
          <p className="mt-1 text-[10px] text-slate-400">
            Potongan 0%, jadi nominal masuk utuh. Pencairan ke rekening tanpa biaya admin.
          </p>
        </div>

        <p className="rounded-2xl bg-dana-50 p-3 text-[10px] leading-relaxed text-dana-700">
          Ganti peran ke <strong>{inviter.split(' ')[0]}</strong> di panel kiri untuk melihat status referal berubah
          dan hadiah Rp20.000 terbuka.
        </p>
      </div>
    </Shell>
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
  peringkat: Peringkat,
  inbox: Inbox,
  landing: Landing,
  register: Register,
  qris: Qris,
};
