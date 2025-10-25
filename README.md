# Kira Inventory

A prototype of an **inventory management application** built with **FastAPI**, **React**, **TypeScript**, and **MySQL**, created for small online sellers (Instagram, Vinted, and similar marketplace platforms).

This project was developed as a **personal technical demonstration**, not as a final product.  
Its main goal was to **show my current programming knowledge** and how I structure a complete application — including backend, frontend, and API integration.  

> **Note:**  
> This project is a **finished prototype** — it will not receive further updates.  
> Its main purpose was to **demonstrate my programming skills** and how I structure a full application (frontend + backend).  
> The **final and complete version** of Kira Inventory will be built from scratch, applying everything learned from this project.

---

## Overview

**Kira Inventory** is a minimalist inventory manager designed for individual sellers who need a simple way to manage products and stock without using complex enterprise tools.

**Author:** Diogo Falardo  
**Status:** Prototype (no further updates)  
**License:** Open Source (core features are free)  
**Stack:** FastAPI + React + MySQL + Docker

---

## Core Features

- **Product Management** — create, edit, and delete products with basic attributes.  
- **Stock Management** — add or remove stock, view and track inventory changes.  
- **User Accounts** — registration, authentication, profile update.  
- **Dashboard** — overview of stock levels and low-stock alerts.  

---

## Tech Stack

### Backend
- **FastAPI (Python)** — asynchronous, modern web framework for APIs.  
- **MySQL** — relational database engine.  
- **SQLAlchemy + Pydantic** — ORM and data validation.  
- **Docker** — containerized development environment.  
- **JWT Authentication** — secure authentication layer.

---

### Frontend

Developed with **React 19**, **TypeScript**, and **Vite**.

#### Main Technologies Used

| Technology | Description |
|-------------|-------------|
| **ShadCN/UI** | Used for UI components and layout styling. The base style was generated using GPT and adapted to this prototype. |
| **Axios** | Used for API communication with the FastAPI backend. |
| **Orval** | Automatically generates API endpoints and React Query hooks from the backend OpenAPI specification. **Note:** I do **not recommend** Orval for beginners — it adds complexity and makes it harder to fully understand what data is being handled. I will only use it again once I have full mastery of **TypeScript** and **React**, or in very large projects with hundreds of endpoints. |
| **TanStack (React Query + Router)** | Used both for API requests and client-side routing. Provides caching, mutation handling, and modern navigation. |
| **Tailwind CSS** | Utility-first CSS framework used for styling and layout. |
| **React Hook Form** | Manages forms efficiently with full TypeScript support. |
| **React Toastify** | Provides toast notifications for success and error messages. |
| **Framer Motion** | Handles smooth UI animations and transitions. |

---

## Development Status

- **Backend:** Stable, modular, and functional with authentication and product endpoints.  
- **Frontend:** Fully connected to backend APIs; built mainly for demonstration purposes, not final design.  
- **Orval + TanStack:** Used for experimentation with automation and type-safe data handling.  
- **Next Steps:** Future work will continue in a complete, redesigned version of Kira Inventory.

---

## Local Setup

> The project uses Docker.

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/kira-inventory.git
cd kira-inventory
