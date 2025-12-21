# Softcode DAWA Address Autocomplete for Magento 2 🇩🇰

Free, lightweight Magento 2 module that adds **DAWA-powered address intelligence**
to any checkout or form using **CSS selectors**.

Built for performance, flexibility, and real-world Danish addresses.

---

## ✨ Features

- 🔢 **Postcode → City autofill**
- 🏠 **Address autocomplete (DAWA)**
- 🧩 Supports **combined** OR **separate** street & house number fields
- 🎯 **Selector-based** (works with any checkout)
- ⚡ Frontend-only (no backend API proxy)
- 🔐 GDPR-safe (no data stored)
- 🧠 Admin configurable
- 🆓 100% free & open source

---

## 🧱 Supported setups

✔ Luma checkout  
✔ Custom checkouts  
✔ OneStepCheckout modules 

✔ B2B & B2C forms

> This module does **not** depend on Magento Checkout JS internals.

---

## 📦 Installation

### Option A – app/code (recommended for testing)

```bash
mkdir -p app/code/Softcode
git clone https://github.com/YOUR_GITHUB/softcode-magento2-dawa-address app/code/Softcode/DawaAddress

bin/magento setup:upgrade
bin/magento cache:flush
