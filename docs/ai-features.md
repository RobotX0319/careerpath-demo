# 🧠 CareerPath AI xususiyatlari

Bu qo'llanma CareerPath demo'dagi barcha AI funksiyalari va ularning ishlash tamoyillari haqida ma'lumot beradi.

## 📋 Qo'llanilgan AI texnologiyalar

CareerPath dasturi Google'ning yangi **Gemini 1.5 Flash** modelidan foydalanadi. Bu model quyidagi afzalliklarga ega:

- O'zbek tilida yuqori darajadagi tushunish va javob berish
- Tez va samarali ishlash
- Katta kontekst oynasi (multimodal qobiliyatlar)
- Narxi jihatdan hamyonbop

## 🔍 Asosiy AI funksionalliklarimiz

### 1. Shaxsiyat tahlili

Bu funksiya test natijalarini batafsil tahlil qilib beradi:

- **Input**: Big Five shaxsiyat testidan olingan 5 ta asosiy ko'rsatkich
- **Process**: AI bu ko'rsatkichlarni mavjud shaxsiyat nazariyalari bilan solishtirib, chuqur tahlil qiladi
- **Output**: Foydalanuvchining xususiyatlari, kuchli tomonlari, rivojlanish yo'nalishlari, muloqot uslubi va optimal ish muhiti haqida batafsil ma'lumot

```typescript
async analyzePersonality(personalityScores: PersonalityScores): Promise<string>
```

### 2. Karyera tavsiyalari

Bu funksiya shaxsiyat natijalariga asoslanib, eng mos kasblarni aniqlab beradi:

- **Input**: Big Five shaxsiyat natijasi va (ixtiyoriy) ko'nikmalar ro'yxati
- **Process**: AI shaxsiyat xususiyatlarini turli kasblarga qo'yiladigan talablar bilan solishtirib, moslik darajasini aniqlaydi
- **Output**: TOP-5 eng mos kasblar, har bir kasb uchun mos kelish sabablari, o'qish yo'llari va kelajak istiqbollari

```typescript
async generateCareerRecommendations(personality: PersonalityScores): Promise<string>
```

### 3. AI karyera maslahatchi

Real vaqtda karyera bo'yicha savollarni javoblash imkoniyati:

- **Input**: Foydalanuvchi savoli va (mavjud bo'lsa) shaxsiyat natijasi konteksti
- **Process**: AI savolni tahlil qiladi va foydalanuvchi shaxsiyatiga mos, amaliy maslahat beradi
- **Output**: O'zbek tilidagi aniq, professional va amaliy maslahat

```typescript
async chatWithAI(message: string, context?: {...}): Promise<string>
```

### 4. Streaming chat

Foydalanuvchi tajribasini yaxshilash uchun stream qilish:

- Javoblar bir vaqtning o'zida generatsiya qilinishi bilan ko'rsatiladi
- Foydalanuvchi to'liq javobni kutib o'tirmasdan, jarayonni kuzatishi mumkin

```typescript
streamChatWithAI(userMessage: string, history: {...}): ReadableStream
```

## 🧰 AI Prompt dizayni

Barcha promptlar quyidagi printsiplarga asoslanadi:

1. **Aniq vazifa qo'yish**: AI'ga nima qilish kerakligi aniq aytiladi
2. **Kontekst berish**: Foydalanuvchi haqida muhim ma'lumotlar taqdim etiladi
3. **Format belgilash**: Javobning tuzilishi va formati ko'rsatiladi
4. **Til va uslub ko'rsatmasi**: Professional va tushunarli til ishlatish so'raladi
5. **Output tozalash**: Barcha javoblar `cleanAIResponse()` funksiyasi orqali tozalanadi

## 🔧 Optimizatsiya usullari

AI javoblarini yaxshilash uchun:

1. **Rate limiting**: Foydalanuvchi so'rovlari sonini cheklash (10 so'rov/minut)
2. **Error handling**: Barcha xatoliklar uchun tushunarli javoblar
3. **Fallback responses**: AI ishlamasa ham, tayyor javoblarni ko'rsatish
4. **Response cleaning**: Markdown belgilar va ortiqcha formatlarni olib tashlash
5. **Alternative models**: Asosiy model ishlamasa, zaxira modelga o'tish

## 📈 Kelajak rejalari

AI funksionalligini yanada yaxshilash rejalari:

1. **Ko'p tillilik**: Rus va ingliz tillarini qo'shish
2. **Shaxsiy o'sish rejasi**: Har bir foydalanuvchi uchun unikal rivojlanish yo'l xaritasi
3. **Intervyu simulyatori**: AI bilan suhbat simulyatsiyasi
4. **CV tahlili**: Resume/CV'ni tahlil qilish va yaxshilash bo'yicha tavsiyalar
5. **Kasb yo'nalishlari bo'yicha chuqur ma'lumotlar**: Har bir kasb uchun batafsil yo'riqnoma

## 🛡️ Xavfsizlik choralari

Loyiha quyidagi xavfsizlik choralarini qo'llaydi:

1. **Input sanitization**: Barcha foydalanuvchi kiritgan ma'lumotlar tekshiriladi
2. **Prompt injection protection**: Xavfli so'rovlarni bloklash
3. **Personal data minimization**: Faqat zarur ma'lumotlarni saqlash
4. **API key security**: API kalitlar maxfiy saqlanadi
5. **Rate limiting**: DoS hujumlardan himoya

---

Savollar, tavsiyalar yoki muammolar bo'lsa, Issues bo'limida muhokama qilamiz.