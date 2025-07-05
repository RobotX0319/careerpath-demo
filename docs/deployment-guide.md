# 🚀 CareerPath Demo'ni GitHub va Vercel'ga Deploy Qilish

Bu qo'llanma orqali loyihangizni GitHub'ga yuklash va Vercel'da deploy qilish jarayonini o'rganasiz.

## 📋 Mundarija

1. [GitHub'ga Push Qilish](#githubga-push-qilish)
2. [Vercel'da Deploy Qilish](#vercelda-deploy-qilish) 
3. [Environment Varibles (Muhit O'zgaruvchilari)](#environment-variables)
4. [Custom Domain Qo'shish](#custom-domain-qoshish)
5. [Muammolarni Hal Qilish](#muammolarni-hal-qilish)

## 🔄 GitHub'ga Push Qilish

### 1. GitHub Repo Yaratish

GitHub'da yangi repository yarating:
- https://github.com/new saytiga boring
- Repository nomini kiriting: `careerpath-demo`
- "Create repository" tugmasini bosing

### 2. Local Repo Tayyorlash

Agar repo hali tayyorlanmagan bo'lsa:

```bash
# Loyiha papkasida
cd c:\Users\user\Desktop\CareerPath\careerpath-demo

# Git repo yaratish
git init

# GitHub'ga bog'lash (.git/config faylida)
git remote add origin https://github.com/YOUR_USERNAME/careerpath-demo.git
```

### 3. .gitignore Fayli

Quyidagi `.gitignore` faylini yarating:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 4. Fayllarni Qo'shish va Commit Qilish

```bash
# Barcha o'zgarishlarni ko'rish
git status

# Barcha fayllarni qo'shish
git add .

# Commit qilish
git commit -m "CareerPath demo v2.0 with AI"

# Main branch'ga push qilish
git push -u origin main
```

## 🌐 Vercel'da Deploy Qilish

### 1. Vercel'da Hisob Ochish

- https://vercel.com/signup saytiga boring
- GitHub hisob orqali ro'yxatdan o'ting

### 2. Loyihani Import Qilish

- https://vercel.com/new saytiga boring
- GitHub repositoriyangizni tanlang (`careerpath-demo`)
- "Import" tugmasini bosing

### 3. Deploy Sozlamalari

- **Framework Preset**: Next.js
- **Root Directory**: `./` (standart)
- **Build Command**: `npm run build` (standart)
- **Output Directory**: `.next` (standart)
- **Install Command**: `npm install` (standart)

### 4. Deploy Tugmasi

"Deploy" tugmasini bosing va kutib turing.

## 🔑 Environment Variables

Vercel'da `.env.local` dagi muhim o'zgaruvchilarni qo'shish:

1. Vercel dashboard'da loyihangizni tanlang
2. "Settings" bo'limiga boring
3. "Environment Variables" ni tanlang
4. Quyidagi o'zgaruvchilarni qo'shing:
   - `NEXT_PUBLIC_GEMINI_API_KEY`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🌐 Custom Domain Qo'shish

1. Vercel dashboard'da loyihangizni tanlang
2. "Settings" bo'limiga boring
3. "Domains" ni tanlang
4. Domain nomini kiriting (masalan, `careerpath.yourdomain.com`)
5. "Add" tugmasini bosing
6. DNS provider'da DNS sozlamalarini yangilang (Vercel ko'rsatmalariga ko'ra)

## ⚠️ Muammolarni Hal Qilish

### Build Xatoliklari

- **Module not found**: Vercel'da barcha dependency'larni o'rnatganligini tekshiring
- **API Key errors**: Environment variables to'g'ri o'rnatilganligini tekshiring
- **Server-side code in client**: `use client` direktivi to'g'ri qo'llanilganligini tekshiring

### Custom Domain Muammolari

- DNS o'zgarishlar tarqalishi uchun 24-48 soat ketishi mumkin
- DNS sozlamalarini to'g'ri kiritganligingizni qayta tekshiring
- HTTPS sertifikat yaratilishini kuting

### Database Ulanish Muammolari

- Supabase RLS sozlamalarini tekshiring
- Supabase anon key to'g'riligini tekshiring
- Supabase IP restriction borligini tekshiring

---

📢 **Muhim eslatma:** Production'ga deploy qilishdan oldin, Supabase'da security sozlamalarini qayta ko'rib chiqing va haqiqiy API kalitlar ishlating.

Happy coding! 🎉