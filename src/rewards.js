/**
 * Milestone-gated reward engine (planning.md v2.0 §4.1).
 *
 * A referral moves through stages:
 *   0 = Undangan terkirim (belum daftar)      -> no reward
 *   1 = KYC Light selesai & QRIS terbit       -> Tier 1
 *   2 = Transaksi QRIS pertama >= Rp10.000    -> Tier 2
 *   3 = 5 transaksi unik dalam 14 hari        -> Tier 3
 *
 * `claimedStage` records the highest tier already paid out, so a referral that
 * was claimed at Tier 1 can still claim Tier 2 and Tier 3 later.
 */
export const TIERS = [
  {
    stage: 1,
    label: 'KYC Light selesai & QRIS terbit',
    detail: 'Voucher tagihan (min. belanja Rp25k), belum bisa dicairkan',
    amount: 5000,
    type: 'voucher',
    merchant: 'Rp10.000 voucher pulsa/tagihan',
  },
  {
    stage: 2,
    label: 'Transaksi QRIS pertama ≥ Rp10.000',
    detail: 'Saldo DANA, cair seketika',
    amount: 20000,
    type: 'saldo',
    merchant: 'Rp15.000 saldo modal usaha',
  },
  {
    stage: 3,
    label: '5 transaksi unik dalam 14 hari',
    detail: 'Bonus retensi, minimal tersebar di 3 hari berbeda',
    amount: 25000,
    type: 'saldo',
    merchant: 'Perpanjangan MDR 0% 30 hari + badge DANA Juara',
  },
];

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
  { label: 'Undangan terkirim, menunggu pendaftaran', short: 'Terkirim', color: 'slate', progress: 15 },
  { label: 'Pendaftaran berhasil, QRIS sudah terbit', short: 'Dalam Proses', color: 'amber', progress: 45 },
  { label: 'QRIS aktif, transaksi pertama masuk', short: 'Aktif', color: 'emerald', progress: 80 },
  { label: 'Merchant Juara: 5 transaksi dalam 14 hari', short: 'Juara', color: 'violet', progress: 100 },
];

/** Tiers already unlocked but not yet paid out for one referral. */
export const pendingTiers = (referral) =>
  TIERS.filter((t) => t.stage <= referral.stage && t.stage > (referral.claimedStage ?? 0));

/** Tiers already paid out for one referral. */
export const paidTiers = (referral) => TIERS.filter((t) => t.stage <= (referral.claimedStage ?? 0));

/** { saldo, voucher, total } that a list of referrals can claim right now. */
export function claimBreakdown(referrals) {
  const rows = referrals.flatMap((r) => pendingTiers(r).map((t) => ({ ...t, merchant: r.name })));
  return {
    rows,
    saldo: rows.filter((t) => t.type === 'saldo').reduce((s, t) => s + t.amount, 0),
    voucher: rows.filter((t) => t.type === 'voucher').reduce((s, t) => s + t.amount, 0),
    total: rows.reduce((s, t) => s + t.amount, 0),
  };
}

/** Lifetime value already paid out (the referrer's "total earned" card). */
export const paidTotal = (referrals) =>
  referrals.reduce((sum, r) => sum + paidTiers(r).reduce((s, t) => s + t.amount, 0), 0);

/** Marks every unlocked tier as paid. Returns a new array (no mutation). */
export const claimAll = (referrals) => referrals.map((r) => ({ ...r, claimedStage: r.stage }));

/** "Usaha aktif" counter that feeds the Rp1.000.000 / 50 merchants achievement bonus. */
export const activeMerchants = (referrals) => referrals.filter((r) => r.stage >= 3).length;

export const rupiah = (n) => `Rp${new Intl.NumberFormat('id-ID').format(n)}`;
