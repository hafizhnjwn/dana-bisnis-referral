// Self-check for the milestone reward engine: node src/rewards.test.mjs
import assert from 'node:assert/strict';
import { claimAll, claimBreakdown, MAX_PER_REFERRAL, paidTotal, pendingTiers } from './rewards.js';

const at = (stage, claimedStage = 0) => ({ name: 'Warung Uji', stage, claimedStage });

// Stage 0 (invited, never registered) pays nothing — the anti-ghost-signup rule.
assert.equal(claimBreakdown([at(0)]).total, 0);

// Tier 1 is voucher-only: no cash-out before the first real QRIS payment.
const tier1 = claimBreakdown([at(1)]);
assert.deepEqual([tier1.saldo, tier1.voucher, tier1.total], [0, 5000, 5000]);

// First genuine payment unlocks the Rp20.000 cash reward on top of Tier 1.
const tier2 = claimBreakdown([at(2)]);
assert.deepEqual([tier2.saldo, tier2.voucher, tier2.total], [20000, 5000, 25000]);

// Claiming is idempotent, and later milestones stay claimable afterwards.
const claimed = claimAll([at(2)]);
assert.equal(claimBreakdown(claimed).total, 0);
assert.equal(paidTotal(claimed), 25000);
const promoted = claimed.map((r) => ({ ...r, stage: 3 }));
assert.equal(claimBreakdown(promoted).total, 25000);
assert.equal(paidTotal(claimAll(promoted)), MAX_PER_REFERRAL);
assert.equal(MAX_PER_REFERRAL, 50000);

// Already-paid tiers are never paid twice, even at max stage.
assert.deepEqual(pendingTiers(at(3, 3)), []);

console.log('reward engine ok');

// "Usaha aktif" (Tier 3) is what feeds the Rp1.000.000 / 50 merchants achievement bonus.
const { activeMerchants } = await import('./rewards.js');
assert.equal(activeMerchants([at(1), at(2), at(3), at(3, 3)]), 2);

// Every tier states what the referred warung gets too (dual-sided incentive).
const { TIERS } = await import('./rewards.js');
assert.ok(TIERS.every((t) => typeof t.merchant === 'string' && t.merchant.length > 0));

console.log('dual-sided reward data ok');
