const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkIssues() {
  // בעיה 1: מאמר ריק 14395
  console.log('\n🔍 בעיה 1: רשומה 14395 (מאמר ריק):');
  const { data: item1 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 14395)
    .single();
  
  if (item1) {
    console.log(`  ID: ${item1.id}`);
    console.log(`  Original ID: ${item1.original_id}`);
    console.log(`  כותרת: ${item1.title}`);
    console.log(`  קטגוריה: ${item1.main_category}`);
    console.log(`  תת-קטגוריה: ${item1.sub_category}`);
    console.log(`  יש תוכן: ${item1.content_md ? 'כן (' + item1.content_md.length + ' תווים)' : 'לא'}`);
  }
  
  // בעיה 2: שו"ת מסווג כמאמר 13907
  console.log('\n\n🔍 בעיה 2: רשומה 13907 (שו"ת מסווג כמאמר?):');
  const { data: item2 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 13907)
    .single();
  
  if (item2) {
    console.log(`  ID: ${item2.id}`);
    console.log(`  Original ID: ${item2.original_id}`);
    console.log(`  כותרת: ${item2.title}`);
    console.log(`  קטגוריה: ${item2.main_category}`);
    console.log(`  תת-קטגוריה: ${item2.sub_category}`);
    console.log(`  יש תוכן: ${item2.content_md ? 'כן' : 'לא'}`);
    if (item2.content_md) {
      console.log(`  תחילת תוכן: ${item2.content_md.substring(0, 200)}`);
    }
  }
  
  // בעיה 3: דף סדרות ריק
  console.log('\n\n🔍 בעיה 3: סדרות:');
  const { data: series, count } = await supabase
    .from('content_items')
    .select('*', { count: 'exact' })
    .eq('main_category', 'סדרות')
    .limit(5);
  
  console.log(`  סה"כ רשומות בקטגוריה "סדרות": ${count}`);
  if (series && series.length > 0) {
    console.log(`  דוגמאות (${series.length} ראשונות):`);
    series.forEach(item => {
      console.log(`    - ID ${item.id}: ${item.title}`);
      console.log(`      תת-קטגוריה: ${item.sub_category || 'אין'}`);
      console.log(`      יש תוכן: ${item.content_md ? 'כן' : 'לא'}`);
    });
  }
  
  // בדיקה נוספת: כמה מאמרים ריקים יש?
  console.log('\n\n📊 סטטיסטיקה של מאמרים:');
  const { data: articles } = await supabase
    .from('content_items')
    .select('id, title, content_md')
    .eq('main_category', 'מאמרים');
  
  if (articles) {
    const withContent = articles.filter(item => item.content_md && item.content_md.trim().length > 0);
    const withoutContent = articles.filter(item => !item.content_md || item.content_md.trim().length === 0);
    
    console.log(`  ✅ עם תוכן: ${withContent.length}`);
    console.log(`  ❌ בלי תוכן: ${withoutContent.length}`);
    console.log(`  📊 סה"כ: ${articles.length}`);
    
    if (withoutContent.length > 0 && withoutContent.length <= 20) {
      console.log('\n  מאמרים ריקים:');
      withoutContent.forEach(item => {
        console.log(`    - ID ${item.id}: ${item.title}`);
      });
    }
  }
}

checkIssues().catch(console.error);
