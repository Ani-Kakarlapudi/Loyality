Loyalty & Retention Platform 
A zero-app digital loyalty, stamp card, and customer retention platform Built for offline stores, cafes, and waffle shops.

---

## 🚀 Quick Start

Run these commands inside this folder:

```bash
# 1. Install dependencies (already installed)
npm install

# 2. Run the development server
npm run dev

# OR run the production build
npm run build
npm start
```

The app will be accessible at: **`http://localhost:3000`**

---

## 📱 Core Portals & Features

| Portal | URL | Description |
| :--- | :--- | :--- |
| **Main Hub** | `http://localhost:3000/` | Overview of all 4 engines and navigation to each portal. |
| **Customer Pass** | `http://localhost:3000/c/kakinada-waffles` | Zero-app mobile experience. Stamp cards, scratch-and-win card, social boosters, rewards wallet, and digital menu. |
| **Cashier Terminal** | `http://localhost:3000/cashier` | Fast customer search by phone, 1-tap stamp awarding (`+1`, `+2`, `+3`), voucher redemption, protected by 4-digit staff PIN. |
| **Merchant Admin** | `http://localhost:3000/admin` | Retention metrics, repeat visit rate, customer CRM, printable counter QR standee generator. |

---

## 🔑 Default Credentials & Test Data

- **Store Staff PIN**: `1234` (configurable in `/admin` Settings tab)
- **Pre-seeded Customer**: Phone `9876543210` (Ani K.)
- **Persistent Database**: Stored in `data/db.json` (auto-created and updated automatically)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Interactive Components**: HTML5 Canvas Scratch Card, Canvas Confetti
- **QR Engine**: `qrcode` library for dynamic Standee rendering
- **Icons**: Lucide React
