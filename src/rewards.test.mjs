// Self-check for the milestone reward engine: node src/rewards.test.mjs
import assert from 'node:assert/strict';
import {
    activeMerchants,
    claimAll,
    claimBreakdown,
    MAX_PER_REFERRAL,
    paidTotal,
    pendingTiers,
    PERSONA_REWARDS,
    TIERS,
} from './rewards.js';

const at = (stage, claimedStage = 0) => ({ name: 'Warung Uji', stage, claimedStage });

// Stage 0 (invited, waiting for registration) pays nothing.
assert.equal(claimBreakdown([at(0)]).total, 0);

// Stage 1 (Registration + QRIS issued + 1st payment >= Rp10k) unlocks Rp5.000 Saldo DANA.
const stage1 = claimBreakdown([at(1)]);
assert.deepEqual([stage1.saldo, stage1.voucher, stage1.total], [5000, 0, 5000]);

// Stage 2 (5 unique transactions + 1-14 days audit) unlocks additional Rp30.000 (total Rp35.000).
const stage2 = claimBreakdown([at(2)]);
assert.deepEqual([stage2.saldo, stage2.voucher, stage2.total], [35000, 0, 35000]);

// Claiming / crediting marks it paid and adds to paidTotal.
const claimed = claimAll([at(2)]);
assert.equal(claimBreakdown(claimed).total, 0);
assert.equal(paidTotal(claimed), 35000);
assert.equal(MAX_PER_REFERRAL, 35000);
assert.equal(TIERS[0].amount, 5000);
assert.equal(TIERS[1].amount, 30000);

// Judul reward per persona harus menyebut angka/kuota yang sama dengan datanya,
// supaya copy di layar tidak pernah lagi beda dengan yang dibayarkan.
const idr = (n) => new Intl.NumberFormat('id-ID').format(n);
for (const [role, data] of Object.entries(PERSONA_REWARDS)) {
    for (const tahap of ['tahap1', 'tahap2']) {
        const r = data[tahap];
        const token = r.type === 'saldo' ? idr(r.amount) : `${r.quota}x`;
        assert.ok(
            r.title.includes(token) && r.benefit.includes(token),
            `${role}.${tahap}: judul/benefit "${r.title}" tidak menyebut ${token}`,
        );
    }
}

// Already-paid tiers are never paid twice.
assert.deepEqual(pendingTiers(at(2, 2)), []);

console.log('reward engine ok');

// "Usaha aktif" counts merchants at stage >= 1 (completed at least Stage 1 with real transaction).
assert.equal(activeMerchants([at(0), at(1), at(2), at(2, 2)]), 3);

// Every tier states what the referred warung gets too.
assert.ok(TIERS.every((t) => typeof t.merchant === 'string' && t.merchant.length > 0));

console.log('dual-sided reward data ok');


