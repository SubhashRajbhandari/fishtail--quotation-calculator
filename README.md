# FishTail Travel Quotation Maker & Multi-Currency Tariff Manager

A modern, high-performance web application designed for travel agencies and tour operators to calculate, manage, and export professional multi-currency tour quotations in real time.

Built for **FishTail Tours & Travels Pvt. Ltd.** (Kathmandu & Pokhara, Nepal).

---

## 🌟 Key Features

1. **Trip & Guest Specs Management**
   - Quote reference numbering & issue dates
   - Multi-currency engine: **INR (₹)**, **NPR (Rs)**, and **USD ($)**
   - Dynamic adult pax count & single room allocations

2. **Premier Hotel Costing & Seasonality Engine**
   - Live synchronization with **Supabase PostgreSQL** database
   - Dual-mode: Works in full Cloud database mode or local fallback
   - Real-time half-twin and single room rate calculations
   - Seasonal tariff adjustments and custom hotel rate overrides

3. **Transportation & Private Sector Transfers**
   - Vehicle fleet allocations: Private Sedan Car, 4WD Scorpio/SUV, Toyota Hiace Minibus, Toyota Coaster Bus, Large Tourist Coach
   - A/C supplement controls
   - Real-time per-vehicle route pricing

4. **Activities, Sightseeing, Flights & Guide Services**
   - Per-person vs. Group flat rate activity pricing (e.g., Everest Scenic Flights, Paragliding, Cable Car tickets, National Park permits)
   - Licensed tour guide daily rate calculations

5. **Commercial Pricing Matrix**
   - Net adult cost calculation across all 4 pillars (Hotels, Transport, Activities, Guides)
   - Customizable Agency Profit Margin per pax
   - Automated Child Pricing formulas (75% Child with bed, 35% Child without bed)
   - Single room supplement handling and group grand totals

6. **Executive Quotation Document & Print Engine**
   - Instant on-screen **"Preview Quote"** modal
   - High-resolution **A4 Print / Save as PDF** proposal layout with letterhead branding, terms & conditions, inclusions/exclusions, and authorized signature blocks

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🗄️ Supabase Setup (Optional)

1. Create a project in [Supabase](https://supabase.com).
2. Execute the SQL schema provided in [`supabase_schema.sql`](./supabase_schema.sql) in the Supabase SQL Editor.
3. In the application navbar, click **"Supabase Setup"** and enter your `Project URL` and `Anon API Key` to enable live cloud sync.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Vanilla CSS with modern Glassmorphism and Custom Design System
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti
- **Database / Backend**: Supabase (PostgreSQL)
