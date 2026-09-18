# Affiliate DANA Bisnis v2.0 — Interactive Prototype

Clickable mobile prototype for the *DANA Bisnis Merchant Referral Program* proposal
(Product Developer Intern take-home, `../planning.md` v2.0). It does not invent a new app: it extends
the **Affiliate DANA Bisnis** Mini Program that already runs in production — same runtime chrome,
same 4 bottom tabs (Beranda / Referal / Peringkat / Inbox), same referral code box and
Hadiah Pencapaian — and adds the v2.0 breakthroughs.

React + Vite + Tailwind, rendered inside a phone frame, no backend and no login required.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/ (relative base, deployable anywhere)
npm test         # self-check for the milestone reward engine
```

## What is kept from production vs what is new

| Kept as-is (audited from the live app) | Added in v2.0 |
| --- | --- |
| Mini Program title bar (`···` / `✕`) and 4 bottom tabs | `Sahabat Warung` / `Mitra Bisnis` track next to `Affiliate Kreator` |
| Referral code box, copy, WhatsApp share, QR | **Bantu Daftarkan**: 3-field assisted nomination, referral code pre-attached |
| Rp45.000 komisi utama, 5-transaction criteria, 1–14 day audit, 48h disbursement | Tiered payout: Rp5.000 → Rp20.000 → Rp25.000, unlocked progressively |
| Hadiah Pencapaian Rp1.000.000 / 50 usaha aktif | Dual-sided rewards: Rp10.000 voucher → Rp15.000 modal usaha → MDR 0% 30 days |
| Papan Peringkat (7/30 hari) + Inspirasi Konten | Tracker with 3-stage progress, x/5 transaction counter, WhatsApp nudge |
| Kelebihan QRIS DANA Bisnis (MDR 0%, saldo cair, Nada DANA, AI foto, Rekan DANA) | KYC Light landing + instant QRIS, e-KTP deferred to first withdrawal |

## Demo script (2 minutes, end to end)

Roles are switched from the left panel; backend events are simulated from the same panel.

1. **Dimas — Konsumen DANA**: Home 8-icon grid → *Affiliate DANA Bisnis* (or `Lihat Semua` →
   Lifestyle & Deals) → Mini Program Beranda. Toggle *Affiliate Kreator* to see the untouched
   creator mode (Rp45.000 komisi, 4-step guide, Rp90 juta banner).
2. Beranda → **Bantu Daftarkan Warung** → store name, category, WhatsApp number → invitation sent,
   lands on `Referal` with the new warung at *Terkirim*.
3. Switch role to **Bu Siti — Warung Diundang**: personalised mobile-web landing (5 real QRIS
   benefits, Rp0, no e-KTP upfront) → *Daftar Gratis dalam 2 Menit* → 3-field KYC Light (pre-filled,
   referral code auto-attached) → **Terbitkan QRIS Saya Sekarang**.
4. On the QRIS screen run *Minta Scan Uji* (Rp1.000) then *Simulasi Pelanggan Bayar* (Rp12.000).
   The Nada DANA soundbox plays (Web Audio, no asset) and the Rp15.000 modal-usaha bonus unlocks.
5. Switch back to **Dimas** → `Referal`: Bu Siti moved to *Aktif* with 1/5 transactions, Rp20.000
   claimable. Run *5 transaksi / 14 hari* to unlock the Rp25.000 retention bonus.
6. `Inbox` shows the milestone notifications; **Hadiah Saya** → *Klaim Saldo DANA Sekarang* credits
   saldo instantly and keeps vouchers separate. `Peringkat` shows the retained creator leaderboard.
7. **Pak Joko — DANA Bisnis** enters the same Mini Program from the Personal/Bisnis toggle in the
   profile tab, in `Mitra Bisnis` track.

## Files

| File | Contents |
| --- | --- |
| `src/App.jsx` | Phone frame, persona/role switcher, event simulator, Nada DANA chime, all app state |
| `src/hostApp.jsx` | Replicas of the settled DANA host screens: Home, All Services, Me / DANA Bisnis |
| `src/screens.jsx` | Mini Program screens (Beranda, Referal, Peringkat, Inbox, Hadiah, Bantu Daftarkan) + the referred warung's mobile-web flow |
| `src/ui.jsx` | Shared atoms: icons, status bar, buttons, host bottom nav, service tiles |
| `src/rewards.js` | Milestone reward engine, production (`LEGACY`) figures used for comparisons |
| `src/rewards.test.mjs` | Reward engine self-check |
| `screens.smoke.jsx` | Renders every screen server-side and asserts persona isolation (no cross-persona identity or wallet leaks) |

`npm test` runs both checks.

## Fidelity of the host-app screens

`Home`, `All Services`, and the `Me → Bisnis` tab are deliberate replicas of the production
screenshots in `../context/`: same header layout (balance + eye toggle + daily-reward pill), same
`Top Up / Request / Send / Inbox` row, same 2×4 shortcut grid ordering with `DANA CICIL` marked NEW
and `Affiliate DANA Bisnis` in place, same Feed strip, DANA Protection block, `DANA Deals` and
`What's New` cards, and the same bottom bar (`Home · Activity · PAY · Wallet · Me`).

Only the slots the real app already uses for campaigns carry this program's material: the header
hero banner, the wide promo banner below the Feed strip, and the first `What's New` row. Brand icons
are approximated with DANA-styled tiles since the original artwork is not redistributable, and third
party voucher brands are replaced with neutral names.

## Notes

- Tier 1 pays a voucher only; cash (Saldo DANA) unlocks from Tier 2, so claiming credits saldo and
  vouchers separately. Claims are per-tier: a referral claimed at Tier 1 can still claim Tier 2 and 3.
- The QRIS code is a syntactically shaped but fictional EMVCo payload — it renders as a real
  scannable QR, it is not a live merchant.
- Leaderboard names, handles, and earnings mirror the production screenshots in masked form; they
  are illustrative, not real data.
- `vite.config.js` uses `base: './'`, so `dist/` works on Netlify, Vercel, GitHub Pages, or from the
  local filesystem.
