/**
 * Milestone-gated reward engine (v2.1).
 *
 * A referral moves through stages:
 *   0 = Undangan terkirim (menunggu pendaftaran)        -> no reward (Rp 0)
 *   1 = KYC Light selesai & QRIS terbit                -> no reward (Rp 0, anti-abuse)
 *   2 = Transaksi QRIS pertama >= Rp10.000             -> Rp10.000 Saldo DANA (auto-credited)
 *
 * Sesuai aturan:
 * - KYC Light & QRIS instan TIDAK mendapatkan reward bagi referrer maupun referee (Rp 0).
 * - Reward terbuka saat transaksi pertama minimal Rp 10.000 masuk via QRIS yang terbit.
 * - Reward Rp 10.000 langsung masuk otomatis ke Saldo / Pocket DANA (tanpa klaim manual di Pusat Hadiah).
 */
export const TIERS = [
  {
    stage: 1,
    label: 'Tahap 1: Pendaftaran s/d QRIS terbit & transaksi min. Rp10.000',
    detail: 'Saldo DANA Rp10.000 otomatis masuk ke Pocket DANA',
    amount: 10000,
    type: 'saldo',
    merchant: 'Saldo Modal Usaha Rp15.000 + 0% MDR + Nada DANA suara transaksi',
  },
  {
    stage: 2,
    label: 'Tahap 2: 5 transaksi unik & lolos validasi transaksi (1–14 hari)',
    detail: 'Saldo DANA Rp30.000 otomatis masuk ke Pocket DANA (Total Rp40.000)',
    amount: 30000,
    type: 'saldo',
    merchant: 'Kupon Bebas MDR 30 Hari + Badge Merchant Juara & Prioritas DANA Sekitar',
  },
];

export const MAX_PER_REFERRAL = 40000;

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

