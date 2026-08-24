# 🏛️ Verix Bank — Institutional Cyber Review & Nodal Operations Console

Production-ready Bank Admin Portal & Threat Surveillance Desk for the **VERIX** Real-Time Cyber & UPI Defense Ecosystem (SIH 2026).

---

## ⚡ Features
- **3-Step Institutional Onboarding Flow**:
  1. `Step 1: Admin Authentication` (Officer credentials & security token).
  2. `Step 2: Jurisdiction & Station Setup` (Officer Name, Bank Name, Postal Code, City).
  3. `Step 3: Live Work Console` (Real-time consumer dispute review, 1-click whitelist/block).
- **Real-Time Consumer Dispute Tickets Sync**:
  - Auto-polls live backend `https://fruadsih.onrender.com/api/v1/institution/appeals`.
  - Instantly updates phone apps upon officer verdict approval or block.
- **🔄 10-Minute Automated Render Keep-Alive Daemon**:
  - Native background heartbeat keeps both the web frontend and Render backend (`fruadsih.onrender.com`) awake 24/7 without free-tier cold starts.
- **Swagger API Integration**:
  - Full interactive OpenAPI documentation at `/swagger`.

---

## 🚀 One-Click Render Deployment

1. **Build Command**: `npm install`
2. **Start Command**: `node server.js`
3. **Environment**: Node.js
4. **Port**: `10000` (automatic from `process.env.PORT`)
