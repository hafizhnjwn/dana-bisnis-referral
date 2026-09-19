# DANA Bisnis Merchant Referral Program — Master Planning & Product Specification (v2.0)

> **Role & Submission Context**: DANA Take-Home Challenge — **Product Developer Intern**  
> **Topic**: Evolving the Existing "Affiliate DANA Bisnis" into an Adaptive Grassroots Referral Engine  
> **Target Reviewer**: Fritz Nathaniel (`fritz.nathaniel@dana.id`) & Product / Design Review Panel at DANA Indonesia  
> **Candidate**: Hafizh Najwan (`hafizhnjwn`)  
> **Date**: September 2026  
> **Deliverables**: 
> 1. Comprehensive Master Planning & Strategy Specification (`planning.md`)
> 2. 18-Slide Presentation Deck Blueprint in Polished English (`deck_content.md`)
> 3. Interactive Web-Based Clickable Prototype with Smartphone Simulator (Root project `index.html`)

---

## 1. Forensic Audit & Deep Research of Existing DANA Features

Based on a forensic audit of the 18 production screenshots from the current DANA iOS/Android app (`context/` directory) and official DANA documentation (`dana.id`), here is the comprehensive analysis of DANA's existing features, constraints, onboarding requirements, reward structures, and referencing mechanics:

### 1.1 Existing Feature Overview: "Affiliate DANA Bisnis" & "DANA Bisnis"
* **Discovery & Placement in DANA App**:
  - **Home Screen**: Directly accessible via the primary 8-icon shortcut grid as **"Affiliate DAN..."** (`IMG_8049.PNG`).
  - **"All Services" (Lihat Semua)**:
    - Categorized under **"Lifestyle & Deals"** as **"Affiliate DANA Bisnis"** with a dual-silhouette icon (`IMG_8055.PNG`). Located alongside companion merchant tools like *"Edit Foto Jualan"* (AI product photo enhancer).
    - Also discoverable under **"Finance"** as **"DANA Bisnis"** with a store awning and "Rp" emblem (`IMG_8054.PNG`).
  - **User Profile ("Saya")**: Features a top dual-toggle switch allowing users to switch between **"Personal"** and **"Bisnis"** modes (`IMG_8058.PNG`, `IMG_8068.PNG`).
* **Technical Runtime & Architecture**:
  - Built as a **DANA Mini Program** powered by the Ant Financial / Alipay Mini Program container (evidenced by the native title bar with `...` options and `(X)` close buttons, `IMG_8061.PNG`).
* **Navigation Architecture (4 Bottom Tabs)**:
  1. `Beranda` (Home Dashboard): Referral code box, 4-step commission guide, creator earning banners, affiliate guides, recent commissions, and milestone rewards (`IMG_8061.PNG`, `IMG_8062.PNG`).
  2. `Referal` (Referral List): Dedicated search bar and status tabs (`Semua` | `Belum Aktif`) with merchant list (`IMG_8063.PNG`).
  3. `Peringkat` (Leaderboard & Inspiration): Subtabs for `Papan Peringkat` (Top 20 affiliates ranked by 7/30 days) and `Inspirasi Konten` (video tutorials by top creators, `IMG_8064.PNG`, `IMG_8065.PNG`).
  4. `Inbox` (Notification Center): Broadcasts commission disbursement updates and system notices.

### 1.2 Existing Reward & Incentive Rules ("Ketentuan Komisi")
Audited directly from the production legal terms popup (`IMG_8066.PNG`):
* **Base Commission ("Komisi Utama")**: **Rp45.000** per active merchant.
* **Current Active Merchant Criteria ("Kriteria Usaha Aktif")**:
  - **Requirement 1**: Minimum of **5 QRIS transactions** completed.
  - **Requirement 2**: Passes transaction validity audit by the DANA Risk & Compliance Team.
  - **Operational Constraint**: **Verification takes 1 to 14 business days** (*"Pengecekan memerlukan waktu 1 hingga 14 hari"*).
* **Disbursement Timeline**: Commission is automatically credited into the referrer's DANA balance maximum **48 hours** after the active criteria is validated.
* **Commission Variation**: Commission per affiliate can vary based on the affiliate's transaction activity and the activity of the registered merchant.
* **Volume Milestone Bonus ("Hadiah Pencapaian")**:
  - Bonus **Rp1.000.000** for every **50 active merchants** using their QRIS (`IMG_8062.PNG`).
* **Target Audience Bias (Content Creator Orientation)**:
  - The existing UI heavily targets digital influencers and video creators. It showcases banners like *"Ada Affiliate yang sudah dapat Rp90 juta, lho!"* and displays a leaderboard where top affiliates (e.g. `MIC***`, `LIA***`, `FRI***`) have registered 800–900 active merchants earning Rp36M–Rp40M (`IMG_8064.PNG`).
  - It features an *"Inspirasi Konten"* tab with video guides by creators like `@andri.irv`, `@sudutbgrbarat`, and `@mitra.dana.bisnis` (`IMG_8065.PNG`).

### 1.3 Existing Merchant Registration & Onboarding ("Cara Daftar DANA Bisnis")
Audited from the in-app onboarding guide (`IMG_8068.PNG`, `IMG_8069.PNG`):
* **Strict Prerequisites & Steps**:
  - **Step 1**: Open the "Saya" (Profile) tab in DANA.
  - **Step 2**: **Mandatory DANA Premium Account**: User must be verified with an e-KTP photo and biometric facial recognition (`IMG_8068.PNG`).
  - **Step 3**: Toggle top switch from "Personal" to "Bisnis".
  - **Step 4**: Complete business profile:
    - *Profil Usaha*: Store name, business category.
    - *Lokasi Usaha*: Address details (RT/RW, subdistrict, store photo).
    - *Kode Referral*: **User must manually type in the affiliate's referral code**.
  - **Step 5**: Wait for backend verification: *"Memverifikasi datamu... Kami akan mengabarimu setelah prosesnya selesai. Ditunggu ya!"* (`IMG_8069.PNG`).
* **Merchant Value Proposition ("Kelebihan QRIS DANA Bisnis", `IMG_8067.PNG`)**:
  - *QRIS Bebas Potongan*: MDR 0% for micro-merchants (all sales revenue retained 100%).
  - *Saldo Langsung Cair*: Instant bank withdrawal with zero admin fees (no next-day T+1 delay).
  - *Suara di Tiap Transaksi*: Free audio announcement on every incoming payment (*"Nada DANA menyebutkan nominal tiap transaksi masuk"* / soundbox effect).
  - *Percantik Foto Produk*: AI-driven photo enhancer for menus, logos, and promotional posters.
  - *Rekan DANA*: Ability to become a neighborhood cash top-up agent.

---

## 2. Core Friction Points in Existing DANA & Strategic Breakthroughs (v2.0)

While the existing "Affiliate DANA Bisnis" is a strong program for online influencers, it faces severe structural barriers when applied to **organic, offline community referrals** (everyday consumers referring their neighborhood warung, or warung owners referring adjacent merchants):

| Operational Friction in Existing DANA | Root Cause in Production | Strategic Breakthrough in v2.1 |
| :--- | :--- | :--- |
| **1. The Cognitive Registration Wall** | Hesitant warung owners must upgrade to DANA Premium (KTP selfie), toggle to Bisnis, fill extensive forms, and **manually type the referral code**. | **"Bantu Daftarkan" (Assisted Pre-Registration) + KYC Light**: Referrer pre-fills 3 fields (Nama, Kategori, WhatsApp). Merchant verifies in 30s without KTP at start. QRIS issues instantly. |
| **2. The 5-Transaction "Cliff" & 14-Day Black Hole** | Referrers get **Rp 0** unless the warung hits 5 txs AND waits 1–14 days for audit. Stopping at 2 txs yields zero, causing massive drop-off. | **Transaction-Gated Direct Credit**: KYC Light is **Rp 0** (zero incentive for fake signups). Unlocks **Rp 10.000 Saldo DANA** immediately upon first genuine QRIS transaction ≥ Rp 10.000, deposited straight into DANA Pocket. |
| **3. Complex Manual Claim Friction** | Users often miss rewards hidden behind separate claim centers or expiring vouchers. | **Zero-Friction Auto-Credit**: No manual "Pusat Hadiah" claim button. Funds deposit automatically into DANA balance with high-visibility push & inbox notifications. |
| **4. Lack of Guidance for Referred Merchants** | Once registered, micro-merchants often don't know what to do next, leading to dormant QRIS. | **Profil Bisnis Onboarding Checklist**: Step-by-step guidance directly inside their DANA Bisnis profile (Pajang QRIS, Transaksi Pertama ≥Rp10k, Cek Suara Nada DANA, Pantau Penjualan, Upgrade KYC Full). |
| **5. Referral Code Confusion** | Multiple redundant sharing buttons (green WA button, QR invitation) clutter the interface. | **Clean 1-Tap Experience**: Clean referral code card with instant copy and prominent "Bantu Daftarkan" button, plus an interactive First-Time Affiliate Guide for new users. |

---

## 3. Product Architecture & Core Wireframe Screens

```mermaid
flowchart TD
    subgraph Discovery_Layer
        D1["DANA Home Feed (8-Grid Icon)"] --> MP["Affiliate & Referral Mini Program"]
        D2["All Services Grid (Lifestyle / Finance)"] --> MP
        D3["DANA Bisnis Dashboard (Profile Tab)"] --> MP
    end

    subgraph Affiliate_Experience
        MP --> Guide["First-Time Affiliate Onboarding Guide"]
        Guide --> Hub["Hub: Referral Code (Copy) & 'Bantu Daftarkan'"]
        Hub --> Nominate["Assisted Pre-Fill Form (3 Fields)"]
        Hub --> Tracker["Real-Time Referral Tracker & WhatsApp Nudge"]
    end

    subgraph Referred_Merchant_Journey
        Nominate --> Landing["Mobile Web Invitation Landing Page"]
        Landing --> KYCLight["3-Field Quick KYC Light Form"]
        KYCLight --> QRIS["Instant Digital QRIS Issuance (Rp 0 Reward)"]
        QRIS --> BizProfile["DANA Bisnis Merchant Profile & Step-by-Step Guidance"]
    end

    subgraph Activation_and_Reward
        BizProfile --> Tx1["First QRIS Transaction ≥ Rp 10.000"]
        Tx1 --> AutoCredit["Rp 10.000 Auto-Credited to Referrer DANA Pocket"]
        Tx1 --> MerchantBenefit["0% MDR + Nada DANA Audio + Daily Sales Ledger"]
    end
```

### 3.1 The 9 Core Product Wireframe Screens
1. **Screen 1: DANA App Discovery (Home 8-Grid & All Services)**
   - Hero banner on DANA Home: *"Ajak Warung Langganan, Dapat Saldo Rp10.000"*.
   - Native branded icon in 8-grid and "All Services" under *Lifestyle & Deals*: *"Affiliate DANA Bisnis"*.
2. **Screen 2: First-Time Affiliate Onboarding Guide (Coachmark Modal)**
   - 4-step introductory walkthrough explaining how to find warungs, pre-fill with "Bantu Daftarkan", guide them to their first transaction, and receive Rp10.000 directly into DANA balance.
3. **Screen 3: Referral Mini Program Hub (Beranda)**
   - Performance Card: Total Saldo Reward DANA earned, active referrals count, and ranking.
   - Clean Referral Code Card (`HAF58W`) with 1-tap copy (no cluttered WA/QR buttons).
   - **Primary Action Card**: *"Bantu Daftarkan Warung Langganan"* (Assisted Nomination).
   - Skema Reward & Panduan Affiliate.
4. **Screen 4: "Bantu Daftarkan Warung" (Assisted Nomination Form)**
   - Step 1: Input Nama Usaha (e.g. *Warung Nasi Bu Siti*).
   - Step 2: Pilih Kategori Usaha (F&B / Warung Makan, Toko Kelontong, Jasa / Bengkel, Fashion / Retail).
   - Step 3: Nomor WhatsApp Pemilik Usaha (+62 auto-formatting).
5. **Screen 5: Referral Tracking Board (Daftar Referal)**
   - Filter Tabs: *Semua*, *Menunggu Transaksi*, *Reward Cair*.
   - Merchant Progress Cards showing 3 visual stages (`Undangan`, `QRIS (KYC Light)`, `Transaksi ≥Rp10k`).
   - Actionable **"Dampingi Transaksi via WhatsApp"** button.
6. **Screen 6: Referred Warung Landing Page (Mobile Web)**
   - Personalized greeting: *"Dimas Mengundang Warung Bu Siti Bergabung ke DANA Bisnis"*.
   - Value props: **Biaya Pendaftaran Rp0**, **Terima Semua Pembayaran (Bank & E-Wallet)**, **0% MDR**.
7. **Screen 7: 3-Field Quick KYC Light Registration**
   - Pre-filled Store Name & Category from assisted submission.
   - GPS Auto-Location picker ("Gunakan Lokasi Toko Saat Ini").
   - Instant Terms & Conditions agreement checkbox. Primary CTA: *"Terbitkan QRIS Saya Sekarang"*.
8. **Screen 8: Instant Digital QRIS Toko**
   - High-resolution National QRIS with merchant name (`WARUNG BU SITI - DANA BISNIS`).
   - Action buttons: *Unduh Poster Siap Cetak (PDF)*, *Bagikan QR*.
   - Primary CTA: *"Buka Profil DANA Bisnis & Panduan Toko"*.
9. **Screen 9: Profil Bisnis Merchant & Step-by-Step Guidance (DANA Bisnis Dashboard)**
   - Business Profile header with store name, category, NMID, and `QRIS AKTIF (KYC LIGHT)` badge.
   - Live DANA Bisnis Balance with 0% MDR.
   - **5-Step Operational Guidance Checklist**:
     1. ✅ *Pajang QRIS di Kasir Toko* (download PDF poster / print).
     2. ⏳ *Terima Transaksi Pertama (Min. Rp 10.000)* (Interactive simulate payment button).
     3. 🔊 *Suara Transaksi Nada DANA Aktif* (Audio announcement on payment).
     4. 📈 *Pantau Penjualan Harian Otomatis* (Real-time digital ledger).
     5. 🛡️ *Upgrade ke DANA Bisnis Premium (Opsional)* (Guidance on e-KTP upgrade when omzet > Rp 10M/month).

---

## 4. Incentive Economics & Anti-Fraud Architecture

### 4.1 Focused Milestone Payout Structure (v2.1)

| Stage | Trigger Event | Referrer Reward | Referred Merchant Benefit | Anti-Fraud Verification Gate |
| :--- | :--- | :--- | :--- | :--- |
| **Stage 1: Pendaftaran & QRIS Terbit (KYC Light)** | 3-field submission completed & instant QRIS generated | **Rp 0** (No cash/voucher) | Instant QRIS, MDR 0%, no KTP requirement at start | Device fingerprint, unique SIM card check, max 3 nominations/day per referrer. Eliminates ghost account farming. |
| **Stage 2: Transaksi Pertama (Aktivasi)** | 1st QRIS transaction (≥ Rp 10.000) successfully settled | **Rp 10.000** Saldo DANA (Auto-credited to DANA Pocket) | 100% sales revenue retained (0% MDR), Nada DANA audio confirmation, automated sales recap | Real customer wallet (>14 days old); Payer and Merchant cannot share device ID, IP subnet, or NIK. |
| **Long-Term Volume: Hadiah Pencapaian** | Every 50 active transacting merchants | **Rp 1.000.000** Milestone Cash Bonus | Eligibility for merchant business growth loans & Rekan DANA agent status | Multi-merchant velocity and transaction diversity audit by automated risk engine. |

### 4.2 What is KYC Light? (Regulatory & Operational Deep Dive)
* **Regulatory Foundation**: Based on Bank Indonesia PADG No. 24/7/PADG/2022 on Payment System Providers (PJP) and Tiered Customer Due Diligence (CDD Sederhana / Bertingkat).
* **The Problem it Solves**: Traditional merchant onboarding requires uploading physical e-KTP photos, taking real-time facial liveness selfies, inputting NPWP, and waiting 1–14 business days for manual verification. For micro-merchants (warung nasi, pedagang kaki lima, kelontong), this creates massive friction, fear of data privacy leaks, and fear of sudden tax audits, resulting in >70% onboarding drop-off.
* **KYC Light Implementation**:
  - Requires only **3 operational data points**: Store Name, Business Category, Store Location (GPS) linked to the registered WhatsApp number.
  - **Zero Waiting Time**: QRIS is generated and active in < 5 seconds.
  - **Prudent Risk Controls (Guardrails)**:
    - Transaction limit capped at **Rp 10.000.000 / month** (ideal for micro-merchants).
    - Settlement balance remains in the DANA Bisnis in-app wallet.
    - **Upgrading to KYC Full (DANA Bisnis Premium)**: Required only when the merchant wishes to withdraw funds directly to external bank accounts or exceeds the monthly volume threshold, at which point e-KTP verification is conducted seamlessly.

### 4.3 Benefit Breakdown for Referred Merchant at Each Step
1. **Tahap 1: Pendaftaran Cepat (Tanpa Beban Administrasi)**
   - *Benefit*: Pemilik warung tidak perlu repot foto KTP, selfie wajah, atau mengetik kode referral yang rumit. Proses selesai dalam 30 detik lewat link undangan yang sudah terisi.
2. **Tahap 2: Penerbitan QRIS Instan (Siap Jualan)**
   - *Benefit*: Langsung memiliki QRIS Nasional resmi berstandar ASPI/GPN tanpa menunggu 1–14 hari kerja. Warung langsung bisa menerima pembayaran dari semua bank (BCA, Mandiri, BRI) dan semua e-wallet (GoPay, OVO, ShopeePay, DANA).
3. **Tahap 3: Transaksi Pertama (Min. Rp 10.000) & Operasional Bebas Potongan**
   - *Benefit*: **MDR 0%** (semua uang masuk utuh 100% tanpa potongan admin). Didukung fitur **Nada DANA** (suara otomatis yang menyebutkan nominal pembayaran masuk) sehingga pedagang tidak perlu ragu atau mengecek layar saat sedang sibuk melayani pembeli.
4. **Tahap 4: Pembinaan Harian via Profil Bisnis (DANA Bisnis Dashboard)**
   - *Benefit*: Panduan langkah demi langkah yang jelas, laporan pembukuan transaksi harian real-time tanpa perlu catat manual di buku kasir, dan alat promosi digital seperti AI Foto Produk.
5. **Tahap 5: Pertumbuhan & Peningkatan Usaha**
   - *Benefit*: Kemudahan upgrade ke DANA Bisnis Premium saat omzet naik, akses menjadi agen **Rekan DANA** (layanan setor/tarik saldo untuk warga sekitar), dan histori transaksi digital yang mempermudah akses permodalan usaha resmi.

### 4.2 Unit Economics: Blended CAC vs 1-Year Merchant LTV
* **Weighted Blended CAC per Transacting Merchant**:
  - Referrer Payout (factoring milestone drop-off): **Rp 24,000**
  - Merchant Starter Pack & Vouchers: **Rp 10,500**
  - **Total Blended CAC**: **Rp 34,500** (vs. Rp 75,000 - Rp 120,000 for direct offline sales agents).
* **Expected 1-Year Merchant LTV**:
  - Annual QRIS Volume: ~Rp 15,000,000 @ 0.7% MDR = **Rp 105,000** net fee revenue.
  - Ecosystem Spillover (Warung customers retaining balances and paying bills on DANA): **Rp 195,000**.
  - **Total 1-Year LTV**: **Rp 300,000**.
  - **LTV / CAC Ratio**: **8.7x** with a payback period of **~2.9 months**.

---

## 5. Technical Implementation Architecture

* **Client Runtime**: Ant Financial Mini Program framework (`@alipay/miniprogram-core` DSL) inside DANA iOS/Android host app.
* **API Gateway & Routing**: Kong Gateway handling rate-limiting, JWT authentication, and device integrity checks.
* **Asynchronous Event-Driven Broker**: Apache Kafka topics (`dana.tx.qris.completed`, `dana.referral.assisted_submit`, `dana.referral.milestone_unlocked`).
* **Anti-Fraud Engine**: Automated risk evaluation checking:
  - Device Fingerprinting (IMEI / MAC hash / Android ID).
  - Geolocation proximity between customer scan and registered store coordinates.
  - Social Graph Analysis (flags closed loops where User A pays Merchant B and Merchant B pays User A).
* **Core Ledger Integration**: Direct atomic transactions via DANA Core Wallet Service with ACID compliance.

---

## 6. Execution Roadmap & Deliverables Tracker

```mermaid
flowchart LR
    Step1["1. Master Planning v2.0 (Done)"] --> Step2["2. Updated 18-Slide Deck Content (deck_content.md)"]
    Step2 --> Step3["3. Interactive Web Prototype (Root Project)"]
    Step3 --> Step4["4. Prototype Flow Verification & Visual Assets"]
    Step4 --> Step5["5. Final Submission Review"]
```

1. **Step 1 (Completed)**: Comprehensive planning updated with deep audit of production screenshots, existing constraints, and strategic breakthroughs.
2. **Step 2 (In Progress)**: Update `deck_content.md` with complete 18 slides in polished English, mapping existing DANA features, screenshots, and the "Bantu Daftarkan" breakthrough.
3. **Step 3 (Completed — aligned to v2.0)**: Built the interactive web prototype in `/Users/hafizhnjwn/Lamaran/DANA` (React + Vite + Tailwind) matching DANA's real UI elements (#108EE9, Mini Program title bar with `···`/`✕`, the 4 production bottom tabs `Beranda`/`Referal`/`Peringkat`/`Inbox`, referral code box, Hadiah Pencapaian, Nada DANA soundbox simulation via Web Audio). 12 clickable screens covering the 8 core wireframes plus both production discovery entry points, 3 switchable role lenses (Sahabat Warung / Mitra Bisnis / warung yang diundang), a retained `Affiliate Kreator` mode for comparison, and a backend event simulator. Run with `npm install && npm run dev`; see `README.md` for the demo script and the kept-vs-new matrix.
4. **Step 4**: Test interactive flows end-to-end and document prototype links.
5. **Step 5**: Prepare final submission package for Fritz Nathaniel & DANA Indonesia.
