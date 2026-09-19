// Self-check for the milestone reward engine: node src/rewards.test.mjs
import assert from 'node:assert/strict';
import { claimAll, claimBreakdown, MAX_PER_REFERRAL, paidTotal, pendingTiers, TIERS, activeMerchants } from './rewards.js';

const at = (stage, claimedStage = 0) => ({ name: 'Warung Uji', stage, claimedStage });

// Stage 0 (invited, never registered) pays nothing.
assert.equal(claimBreakdown([at(0)]).total, 0);

// Stage 1 (KYC Light & instant QRIS) pays Rp 0 — no reward before 1st real payment!
const stage1 = claimBreakdown([at(1)]);
assert.deepEqual([stage1.saldo, stage1.voucher, stage1.total], [0, 0, 0]);

// First genuine payment >= Rp10.000 unlocks Rp10.000 cash reward directly.
const stage2 = claimBreakdown([at(2)]);
assert.deepEqual([stage2.saldo, stage2.voucher, stage2.total], [10000, 0, 10000]);

// Claiming / crediting marks it paid and adds to paidTotal.
const claimed = claimAll([at(2)]);
assert.equal(claimBreakdown(claimed).total, 0);
assert.equal(paidTotal(claimed), 10000);
assert.equal(MAX_PER_REFERRAL, 10000);

// Already-paid tiers are never paid twice.
assert.deepEqual(pendingTiers(at(2, 2)), []);

console.log('reward engine ok');

// "Usaha aktif" counts merchants at stage >= 2 (completed at least 1 real transaction).
assert.equal(activeMerchants([at(1), at(2), at(2, 2)]), 2);

// Every tier states what the referred warung gets too.
assert.ok(TIERS.every((t) => typeof t.merchant === 'string' && t.merchant.length > 0));

console.log('dual-sided reward data ok');

