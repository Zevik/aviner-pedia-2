const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function compareSeries() {
  console.log('\n📊 השוואת ספירת סדרות:\n');
  
  // קבלת כל הסדרות
  const { data: allSeries } = await supabase
    .from('content_items')
    .select('sub_category, title, id')
    .eq('main_category', 'סדרות')
    .not('sub_category', 'is', null)
    .order('created_at', { ascending: false });
  
  if (!allSeries) return;
  
  // קיבוץ לפי sub_category
  const grouped = allSeries.reduce((acc, item) => {
    const key = item.sub_category;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        count: 0,
        items: []
      };
    }
    acc[key].count++;
    acc[key].items.push(item);
    return acc;
  }, {});
  
  // מיון לפי מספר פריטים
  const sorted = Object.values(grouped).sort((a, b) => b.count - a.count);
  
  console.log('הסדרות הפופולריות ביותר (20 ראשונות):');
  sorted.slice(0, 20).forEach((series, i) => {
    console.log(`${i + 1}. ${series.name}: ${series.count} שיעורים`);
  });
  
  console.log('\n\n🎯 הסדרות שמוצגות בדף הבית (8 ראשונות לפי תאריך):');
  
  // סימולציה של הלוגיקה הנוכחית
  const first100 = allSeries.slice(0, 100);
  const groupedFirst100 = first100.reduce((acc, item) => {
    const key = item.sub_category;
    if (!acc[key]) {
      acc[key] = { name: key, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {});
  
  Object.values(groupedFirst100).slice(0, 8).forEach((series, i) => {
    console.log(`${i + 1}. ${series.name}: ${series.count} שיעורים (מתוך 100 הראשונים)`);
  });
  
  console.log('\n\n💡 המלצה: להציג לפי הסדרות הגדולות ביותר במקום לפי תאריך');
}

compareSeries().catch(console.error);
