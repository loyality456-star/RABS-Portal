# Setup Guide — RABS Portal

> Roots & Botanical Solutions — the administration portal.

## Prerequisites

- **Node.js 18+** (ideally 20+)
- A **[Turso](https://turso.tech)** account (free tier works)
- A **[Vercel](https://vercel.com)** account (for deployment)
- A **GitHub** account

---

## 1. Turso Database (shared with RABS Storefront)

Both sites share **one Turso database**. You only set it up once.

### Create database

1. Go to https://turso.tech → Sign up / Login.
2. Click **Create Database**.
3. Name it `rabs-db`, pick a region, click **Create**.

### Get credentials

- Copy the **URL** (looks like `libsql://rabs-db-yourorg.turso.io`).
- Go to **Tokens** → create a full-access token → copy it.

### Create all tables

Run each statement one at a time in the Turso SQL Shell:

```sql
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```sql
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  price REAL NOT NULL,
  image_url TEXT,
  category_id TEXT,
  is_featured INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

```sql
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  reply TEXT,
  replied_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  notes TEXT,
  payment_method TEXT DEFAULT 'cod',
  status TEXT DEFAULT 'pending',
  total REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```sql
CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. Local Development

```bash
cd RABS-Portal
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
TURSO_DATABASE_URL=libsql://rabs-db-yourorg.turso.io
TURSO_AUTH_TOKEN=your-turso-token
JWT_SECRET=any-random-secret-string
```

Start the dev server:

```bash
npm run dev
```

The portal runs at **http://localhost:3001**.

### Create your first admin

1. Visit http://localhost:3001/setup
2. Choose a username and password.
3. You're redirected to the login page — sign in with your new credentials.

Your password is automatically hashed with **scrypt** (salt:hash, matching https://pass-hash.vercel.app) before being stored. You never enter plaintext into the database.

### Run the Storefront locally too

```bash
cd ../RABS-Storefront
npm run dev   # runs on port 3000
```

---

## 3. Vercel Deployment

1. Push this repo to GitHub.
2. Go to https://vercel.com/new → **Import** this repo.
3. Framework: **Next.js** (auto-detected).
4. Add environment variables in the Vercel project settings:

```
TURSO_DATABASE_URL=libsql://rabs-db-yourorg.turso.io
TURSO_AUTH_TOKEN=your-turso-token
JWT_SECRET=your-jwt-secret
```

5. Deploy.

### Update the "back to store" link

In `app/(auth)/layout.tsx`, the "back to the store" link points to `rabs-storefront.vercel.app`. Update it to your actual Storefront URL after deployment.

---

## 4. Portal pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login` | Admin sign in |
| Setup | `/setup` | Create first admin account |
| Dashboard | `/dashboard` | Overview stats, recent orders |
| Products | `/products` | List all, add/edit/delete, toggle featured |
| New product | `/products/new` | Add a new product |
| Edit product | `/products/[id]/edit` | Edit an existing product |
| Categories | `/categories` | Create/edit/delete categories |
| Reviews | `/reviews` | Read and reply to customer reviews |
| Orders | `/orders` | View all COD orders, filter by status |
| Order detail | `/orders/[id]` | Customer info, items, update status |
| Admins | `/admins` | Create new admin accounts, manage existing |

---

## 5. Password hashing (pass-hash.vercel.app spec)

| Parameter | Value |
|-----------|-------|
| Algorithm | scrypt |
| N (CPU/memory cost) | 16384 |
| r (block size) | 8 |
| p (parallelization) | 1 |
| Key length | 64 bytes |
| Salt | 16 random bytes, hex-encoded (32 chars) |
| Output format | `saltHex:hashHex` |

Runs server-side via Node.js `crypto.scryptSync`. The Portal uses jose (HS256 JWT) to manage sessions via HTTP-only cookies.

---

## 6. GitHub setup

Each site is pushed to its own GitHub repo under your account. See the project README for repository URLs.

### Create repos (if not already created)

```bash
gh repo create Talib-ILM/RABS-Storefront --public --source=. --push
gh repo create Talib-ILM/RABS-Portal --public --source=. --push
```