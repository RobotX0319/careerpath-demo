# 🌍 CareerPath Demo'ni global ravishda ulashish (Ngrok)

Bu qo'llanma orqali siz o'z local kompyuteringizdagi CareerPath demo'ni internet orqali barcha bilan ulashishingiz mumkin.

## 📋 Ngrok nima?

Ngrok - bu local serverlarni internet orqali boshqalar bilan ulashish uchun xizmat. Bu "tunnel" yaratadi va public URL beradi.

## 🚀 O'rnatish va ishga tushirish

### 1. Ngrok o'rnatish

```bash
npm install -g ngrok
```

### 2. Ngrok hisob yaratish va authtoken o'rnatish (MAJBURIY QADAM!)

```bash
# 1. https://dashboard.ngrok.com/signup saytida ro'yxatdan o'ting
# 2. https://dashboard.ngrok.com/get-started/your-authtoken sahifasidan tokenni oling
# 3. Token o'rnatish:
ngrok authtoken YOUR_AUTH_TOKEN_HERE
```

### 3. CareerPath demo server'ni ishga tushirish

```bash
# Loyiha direktoriyasiga o'ting
cd c:\Users\user\Desktop\CareerPath\careerpath-demo

# Development server'ni ishga tushiring
npm run dev
```

### 4. Yangi terminal oynasini oching va Ngrok'ni ishga tushiring

```bash
ngrok http 3000
```

### 4. Ngrok public URL'ni oling

Terminal quyidagiga o'xshash ma'lumotni ko'rsatadi:

```
Session Status                online
Account                       Your Account
Version                       3.x.x
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok.io -> http://localhost:3000
```

"Forwarding" qatoridagi URL (masalan, `https://abc123def456.ngrok.io`) sizning public URL'ingiz.

## 🌟 Afzalliklari

- **Bepul plan**:
  - Har 2 soatda URL o'zgaradi
  - Basic features
  
- **To'lov plani** ($10/oydan):
  - Doimiy subdomain
  - Custom domain
  - Longer session duration

## 🔒 Xavfsizlik maslahatlar

- Demo uchun Ngrok ajoyib, lekin production uchun professional hosting kerak
- Haqiqiy foydalanuvchilar ma'lumotlarini test'larda ishlatmang
- URL'ni faqat kerakli odamlarga ulashing

## 🚨 Muammolarni hal qilish

- **"Port already in use" xatoligi**: Ngrok yoki Next.js allaqachon ishlamoqda
  ```bash
  # Ishlab turgan portlarni tekshirish (Windows)
  netstat -ano | findstr :3000
  # Ishlab turgan portlarni tekshirish (Mac/Linux)
  lsof -i :3000
  ```

- **"ngrok is not recognized" xatoligi**: Path variable muammosi
  ```bash
  # Quyidagidan keyin qayta urinib ko'ring:
  npm install -g ngrok
  ```

## 🔄 Public URL'ni yangilash

Har safar Ngrok'ni qayta ishga tushirganingizda yangi URL olasiz (bepul planda). Bu URL'ni kerakli odamlarga qayta ulashishni unutmang.

---

Endi siz CareerPath demo'ni butun dunyo bilan ulashishingiz mumkin! 🌐