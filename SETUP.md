# מדריך התקנה והגדרה - Avinerpedia

## שלב 1: הכנת סביבת העבודה

### דרישות מקדימות

- Node.js 18.17 ומעלה
- npm או yarn
- חשבון Supabase (חינם)

## שלב 2: הגדרת Supabase

### 2.1 צור פרויקט חדש

1. גש ל-[supabase.com](https://supabase.com)
2. לחץ על "Start your project"
3. צור ארגון חדש (אם אין לך)
4. לחץ על "New project"
5. בחר שם לפרויקט: `avinerpedia`
6. הגדר סיסמת מסד נתונים חזקה (שמור אותה!)
7. בחר אזור גיאוגרפי קרוב
8. לחץ על "Create new project"

### 2.2 הפעל את הסקריפט SQL

1. בפרויקט Supabase, לך ל-**SQL Editor** בתפריט השמאלי
2. לחץ על **+ New query**
3. העתק והדבק את כל התוכן מהקובץ `schema.sql` מהתיקייה ההורית
4. לחץ על **Run** (או Ctrl+Enter)
5. וודא שהטבלה `content_items` נוצרה בהצלחה

### 2.3 קבל את מפתחות ה-API

1. לך ל-**Settings** > **API** בתפריט
2. מצא את:
   - **Project URL** (שמור כ-NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (שמור כ-NEXT_PUBLIC_SUPABASE_ANON_KEY)

## שלב 3: הגדרת הפרויקט

### 3.1 צור קובץ .env.local

בתיקיית `avinerpedia`, צור קובץ בשם `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

**החלף את הערכים:**
- `YOUR-PROJECT-ID` - מה-URL של הפרויקט שלך
- `YOUR-ANON-KEY-HERE` - המפתח ה-public שקיבלת

### 3.2 התקן תלויות

```bash
cd avinerpedia
npm install
```

זה יכול לקחת דקה או שתיים.

## שלב 4: טעינת הנתונים

### 4.1 וודא שקובץ ה-CSV במקום הנכון

הקובץ `full_database.csv` צריך להיות **בתיקייה ההורית** של `avinerpedia/`:

```
Aviner-pedia/
├── full_database.csv    ← כאן
├── schema.sql
└── avinerpedia/
    ├── app/
    ├── components/
    └── ...
```

### 4.2 הרץ את סקריפט הטעינה

```bash
npm run seed
```

**מה קורה עכשיו:**
- הסקריפט קורא את ה-CSV
- מנקה את הנתונים (מסיר גרשיים מיותרים)
- מעלה ל-Supabase ב-100 רשומות בכל פעם
- מדווח על התקדמות

**משך זמן צפוי:** 5-10 דקות (תלוי במהירות הרשת)

**פלט צפוי:**
```
🌱 Starting database seeding...

📂 Reading CSV from: ...
📊 Parsing CSV data...
✅ Parsed 162970 rows

🔄 Mapping and sanitizing data...
✅ Prepared 162968 valid records

💾 Inserting records into database...
   Batch size: 100

   Processing batch 1/1630... ✓ (100 total)
   Processing batch 2/1630... ✓ (200 total)
   ...

🎉 Seeding completed!
   ✅ Successfully inserted: 162968
   ❌ Failed: 2
   📊 Total processed: 162970

✨ Done!
```

## שלב 5: הפעלת האתר

### 5.1 הפעל שרת פיתוח

```bash
npm run dev
```

### 5.2 פתח בדפדפן

גש ל-[http://localhost:3000](http://localhost:3000)

**אתה אמור לראות:**
- ✅ דף הבית עם 4 פסים
- ✅ סרטונים אחרונים
- ✅ סדרות לימוד
- ✅ שאלות ותשובות

## פתרון בעיות נפוצות

### בעיה: "Missing Supabase environment variables"

**פתרון:**
1. וודא שיש לך קובץ `.env.local` בתיקיית `avinerpedia/`
2. וודא שהמשתנים נכתבים בדיוק כך:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
3. אין רווחים לפני או אחרי `=`
4. אין גרשיים סביב הערכים

### בעיה: "CSV file not found"

**פתרון:**
הקובץ `full_database.csv` חייב להיות בתיקייה ההורית:
```bash
# ודא שאתה בתיקיית avinerpedia
cd avinerpedia

# בדוק שהקובץ קיים
ls ../full_database.csv  # Linux/Mac
dir ..\full_database.csv  # Windows
```

### בעיה: שגיאות בזמן seed

**שגיאה: "rate limit exceeded"**
- Supabase מגביל מספר בקשות בדקה
- הסקריפט כולל delay אוטומטי
- אם זה קורה, פשוט הפעל שוב `npm run seed`

**שגיאה: "duplicate key value"**
- הנתונים כבר קיימים במסד הנתונים
- אם אתה רוצה לרוקן ולהתחיל מחדש:
  ```sql
  -- הפעל ב-SQL Editor של Supabase
  TRUNCATE TABLE content_items RESTART IDENTITY;
  ```

### בעיה: האתר ריק / אין נתונים

1. בדוק ש-seed הצליח:
   ```bash
   npm run seed
   ```

2. בדוק ב-Supabase:
   - לך ל-**Table Editor**
   - לחץ על `content_items`
   - אמור להיות אלפי רשומות

3. בדוק את ה-RLS (Row Level Security):
   ```sql
   -- הפעל ב-SQL Editor
   SELECT * FROM content_items LIMIT 10;
   ```
   - אם זה עובד, ה-RLS מוגדר נכון

### בעיה: שגיאות TypeScript

```bash
# נקה את ה-cache
rm -rf .next
npm run dev
```

### בעיה: הפונט לא טוען

הפונט Heebo נטען אוטומטית מ-Google Fonts. אם הוא לא נטען:
1. בדוק חיבור אינטרנט
2. נסה לרענן את הדף
3. נקה cache של הדפדפן

## צעדים הבאים

### פריסה ל-Vercel

1. התקן Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. התחבר:
   ```bash
   vercel login
   ```

3. פרוס:
   ```bash
   vercel
   ```

4. הוסף משתני סביבה ב-Vercel Dashboard:
   - לך לפרויקט
   - Settings > Environment Variables
   - הוסף את שני המשתנים מ-`.env.local`

### התאמה אישית

- **צבעים:** ערוך `app/globals.css` (CSS Variables)
- **לוגו:** החלף את הטקסט ב-`components/Navbar.tsx`
- **פוטר:** ערוך את ה-footer ב-`app/layout.tsx`
- **SEO:** ערוך את ה-metadata ב-`app/layout.tsx`

## תמיכה

אם נתקלת בבעיות שלא מופיעות כאן, פנה למפתח או צור Issue ב-GitHub.

---

**בהצלחה! 🎉**
