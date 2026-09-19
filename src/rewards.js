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
    label: 'Pendaftaran selesai & QRIS terbit (KYC Light)',
    detail: 'QRIS terbit instan & siap pakai (Tanpa reward uang untuk cegah akun fiktif)',
    amount: 0,
    type: 'none',
    merchant: 'QRIS aktif instan, MDR 0%, tanpa syarat e-KTP di awal',
  },
  {
    stage: 2,
    label: 'Transaksi QRIS pertama ≥ Rp10.000',
    detail: 'Saldo DANA Rp10.000 otomatis masuk ke Pocket DANA',
    amount: 10000,
    type: 'saldo',
    merchant: 'Omzet masuk utuh 0% MDR + Nada DANA + pembukuan otomatis',
  },
];

export const MAX_PER_REFERRAL = 10000;

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
  { label: 'Pendaftaran selesai & QRIS terbit (KYC Light)', short: 'QRIS Siap', color: 'amber', progress: 55 },
  { label: 'Transaksi pertama ≥Rp10k berhasil (Reward cair)', short: 'Aktif', color: 'emerald', progress: 100 },
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

/** "Usaha aktif" counter (merchants with at least 1 real transaction >= Rp10k). */
export const activeMerchants = (referrals) => referrals.filter((r) => r.stage >= 2).length;

export const rupiah = (n) => `Rp${new Intl.NumberFormat('id-ID').format(n)}`;

