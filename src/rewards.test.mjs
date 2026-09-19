// Self-check for the milestone reward engine: node src/rewards.test.mjs
import assert from 'node:assert/strict';
import { claimAll, claimBreakdown, MAX_PER_REFERRAL, paidTotal, pendingTiers, TIERS, activeMerchants } from './rewards.js';

const at = (stage, claimedStage = 0) => ({ name: 'Warung Uji', stage, claimedStage });

// Stage 0 (invited, waiting for registration) pays nothing.
assert.equal(claimBreakdown([at(0)]).total, 0);

// Stage 1 (Registration + QRIS issued + 1st payment >= Rp10k) unlocks Rp10.000 Saldo DANA.
const stage1 = claimBreakdown([at(1)]);
assert.deepEqual([stage1.saldo, stage1.voucher, stage1.total], [10000, 0, 10000]);

// Stage 2 (5 unique transactions + 1-14 days audit) unlocks additional Rp30.000 (total Rp40.000).
const stage2 = claimBreakdown([at(2)]);
assert.deepEqual([stage2.saldo, stage2.voucher, stage2.total], [40000, 0, 40000]);

// Claiming / crediting marks it paid and adds to paidTotal.
const claimed = claimAll([at(2)]);
assert.equal(claimBreakdown(claimed).total, 0);
assert.equal(paidTotal(claimed), 40000);
assert.equal(MAX_PER_REFERRAL, 40000);

// Already-paid tiers are never paid twice.
assert.deepEqual(pendingTiers(at(2, 2)), []);

console.log('reward engine ok');

// "Usaha aktif" counts merchants at stage >= 1 (completed at least Stage 1 with real transaction).
assert.equal(activeMerchants([at(0), at(1), at(2), at(2, 2)]), 3);

// Every tier states what the referred warung gets too.
assert.ok(TIERS.every((t) => typeof t.merchant === 'string' && t.merchant.length > 0));

console.log('dual-sided reward data ok');


