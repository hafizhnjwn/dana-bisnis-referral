/**
 * Milestone-gated reward engine (v2.1).
 *
 * A referral moves through stages:
 *   0 = Undangan terkirim (menunggu pendaftaran)        -> no reward (Rp 0)
 *   1 = KYC Light selesai & QRIS terbit                -> no reward (Rp 0, anti-abuse)
 *   2 = Transaksi QRIS pertama >= Rp10.000             -> Rp5.000 Saldo DANA (auto-credited)
 *
 * Sesuai aturan:
 * - KYC Light & QRIS instan TIDAK mendapatkan reward bagi referrer maupun referee (Rp 0).
 * - Reward terbuka saat transaksi pertama minimal Rp 10.000 masuk via QRIS yang terbit.
 * - Reward Tahap 1 (Rp 5.000) langsung masuk otomatis ke Saldo / Pocket DANA, tanpa klaim manual.
 */
export const TIERS = [
  {
    stage: 1,
    label: 'Tahap 1: Pendaftaran s/d QRIS terbit & transaksi min. Rp10.000',
    detail: 'Rian: Saldo Rp5.000 · Bu Putu: Gratis transfer bank 2x · Pak Joko: Gratis tarik tunai 2x',
    amount: 5000,
    type: 'saldo',
    merchant: 'Gratis Tarik Tunai 2x (exp. 1 bln)',
  },
  {
    stage: 2,
    label: 'Tahap 2: 5 transaksi unik & lolos validasi transaksi (1–14 hari)',
    detail: 'Rian: Saldo Rp30.000 (Total Rp35.000) · Bu Putu: Gratis admin 10x · Pak Joko: Gratis admin 10x',
    amount: 30000,
    type: 'saldo',
    merchant: 'Gratis Admin 10x (exp. 1 bln)',
  },
];

export const PERSONA_REWARDS = {
  consumer: {
    persona: 'Rian',
    roleLabel: 'Konsumen DANA (Pengundang)',
    track: 'Sahabat Warung',
    tahap1: {
      title: 'Saldo DANA Rp5.000',
      type: 'saldo',
      amount: 5000,
      benefit: 'Saldo DANA Rp5.000 langsung masuk ke Pocket DANA',
      terms: 'Cair otomatis saat transaksi QRIS pertama warung binaan minimal Rp10.000.',
      expiry: 'Permanen di Saldo DANA',
    },
    tahap2: {
      title: 'Saldo DANA Rp30.000',
      type: 'saldo',
      amount: 30000,
      benefit: 'Saldo DANA Rp30.000 langsung masuk ke Pocket DANA (Total Rp35.000)',
      terms: 'Cair otomatis setelah 5 transaksi unik dari pembeli berbeda & lolos audit validasi.',
      expiry: 'Permanen di Saldo DANA',
    },
  },
  merchant: {
    persona: 'Bu Putu',
    roleLabel: 'Mitra Bisnis DANA (Pengundang)',
    track: 'Mitra Bisnis',
    tahap1: {
      title: 'Gratis Transfer Antar Bank 2x',
      type: 'voucher',
      quota: 2,
      benefit: '2x Bebas Biaya Transfer ke Seluruh Bank',
      terms: 'Berlaku untuk transfer ke bank mana pun tanpa biaya admin Rp2.500/transaksi.',
      expiry: 'Expired dalam 1 bulan (30 hari sejak diperoleh)',
    },
    tahap2: {
      title: 'Gratis Biaya Admin 10x',
      type: 'voucher',
      quota: 10,
      benefit: '10x Bebas Biaya Admin Transaksi',
      terms: 'Termasuk bayar listrik PLN, isi pulsa & data, transfer antar bank, top up e-money, dll.',
      expiry: 'Expired dalam 1 bulan (30 hari sejak diperoleh)',
    },
  },
  referred: {
    persona: 'Pak Joko',
    roleLabel: 'Warung Diundang (Merchant Binaan)',
    track: 'Warung Sembako Pak Joko',
    tahap1: {
      title: 'Gratis Tarik Tunai 2x',
      type: 'voucher',
      quota: 2,
      benefit: '2x Bebas Biaya Tarik Tunai Saldo Penjualan',
      terms: 'Bebas biaya tarik tunai di ATM BCA/BRI atau gerai Alfamart & Indomaret.',
      expiry: 'Expired dalam 1 bulan (30 hari sejak diperoleh)',
      extra: 'Notifikasi Audio Nada DANA Aktif',
    },
    tahap2: {
      title: 'Gratis Biaya Admin 10x',
      type: 'voucher',
      quota: 10,
      benefit: '10x Bebas Biaya Admin Transaksi',
      terms: 'Termasuk bayar listrik warung, isi pulsa & data, transfer antar bank, dll.',
      expiry: 'Expired dalam 1 bulan (30 hari sejak diperoleh)',
      extra: 'Bebas biaya admin operasional warung',
    },
  },
};

// Diturunkan dari TIERS supaya tidak pernah lagi beda dengan angka yang dibayarkan.
export const MAX_PER_REFERRAL = TIERS.reduce((sum, t) => sum + t.amount, 0);

/** Angka program produksi yang sedang berjalan, dipakai untuk pembanding di UI. */
export const LEGACY = {
  commission: 45000,
  txCriteria: 5,
  verification: '1–14 hari kerja',
  disbursement: 'maks. 48 jam setelah lolos audit',
  achievementPer: 50,
  achievementBonus: 1000000,
};

export const STAGES = [
  { label: 'Undangan terkirim, menunggu pendaftaran', short: 'Terkirim', color: 'slate', progress: 20 },
  { label: 'Tahap 1: Pendaftaran, QRIS terbit & Transaksi ≥Rp10k', short: 'Tahap 1 Selesai', color: 'amber', progress: 60 },
  { label: 'Tahap 2: 5 transaksi unik & validasi lolos (1–14 hari)', short: 'Tahap 2 Selesai', color: 'emerald', progress: 100 },
];

/** Tiers already unlocked but not yet credited for one referral. */
export const pendingTiers = (referral) =>
  TIERS.filter((t) => t.amount > 0 && t.stage <= referral.stage && t.stage > (referral.claimedStage ?? 0));

/** Tiers already credited for one referral. */
export const paidTiers = (referral) =>
  TIERS.filter((t) => t.amount > 0 && t.stage <= (referral.claimedStage ?? 0));

/** { saldo, voucher, total } that a list of referrals has unlocked. */
export function claimBreakdown(referrals) {
  const rows = referrals.flatMap((r) =>
    pendingTiers(r).map((t) => ({ ...t, merchant: r.name }))
  );
  return {
    rows,
    saldo: rows.filter((t) => t.type === 'saldo').reduce((s, t) => s + t.amount, 0),
    voucher: 0,
    total: rows.reduce((s, t) => s + t.amount, 0),
  };
}

/** Lifetime value already paid out directly into DANA balance. */
export const paidTotal = (referrals) =>
  referrals.reduce((sum, r) => sum + paidTiers(r).reduce((s, t) => s + t.amount, 0), 0);

/** Marks every unlocked tier as credited. Returns a new array. */
export const claimAll = (referrals) =>
  referrals.map((r) => ({ ...r, claimedStage: Math.max(r.claimedStage ?? 0, r.stage) }));

/** "Usaha aktif" counter (merchants completing at least Stage 1: first transaction >= Rp10k). */
export const activeMerchants = (referrals) => referrals.filter((r) => r.stage >= 1).length;

export const rupiah = (n) => `Rp${new Intl.NumberFormat('id-ID').format(n)}`;

