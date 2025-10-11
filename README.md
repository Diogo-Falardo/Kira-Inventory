# Kira-Inventory
Open-source inventory management app for small sellers — built with FastAPI, React, TypeScript, and MySQL.



A minimal, focused inventory manager for small sellers (Instagram / Vinted / marketplaces).

> **Solo project** — built by **Diogo Falardo** to show my way of working (structure, code style, and practices).  
> **Open-source core (FREE)** — public and easy to run locally.  
> **Paid/Private parts (future)** — some advanced modules may be closed-source later.  
> **Security note** — only environment files and secrets are intentionally omitted.

---

##  Core (FREE / Open Source)

- **Product Management** — create/edit products, attributes, images.
- **Stock Management** — stock in/out, adjustments, basic history.
- **Dashboard** — quick view of low stock and simple KPIs.

---

##  Tech Stack

- **Backend:** Python **FastAPI**
- **Frontend:** **React + TypeScript + Tailwind CSS**
- **Database:** **MySQL**
- **Dev/Run:** **Docker**

---

##  Getting Started (Local)

> This project uses Docker for quick setup.  
> Environment variables live in `.env` files (not committed). See the example below.

### 1) Clone
```bash
git clone https://github.com/<your-username>/kira-inventory.git
cd kira-inventory
