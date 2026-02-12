const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  // בדיקה של רשומה 14385
  console.log('\n🔍 רשומה 14385 (original_id: 6830):');
  const { data: item1, error: err1 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 14385)
    .single();
  
  if (err1) console.error('Error:', err1);
  else {
    console.log(`  ID: ${item1.id}`);
    console.log(`  Original ID: ${item1.original_id}`);
    console.log(`  כותרת: ${item1.title}`);
    console.log(`  קטגוריה ראשית: ${item1.main_category}`);
    console.log(`  תת-קטגוריה: ${item1.sub_category}`);
    console.log(`  יש תוכן: ${item1.content_md ? '✅ כן (' + item1.content_md.length + ' תווים)' : '❌ לא'}`);
  }
  
  // בדיקה כמה רשומות של "שו"ת לפי נושא" ריקות
  console.log('\n\n📊 סטטיסטיקה של "שו"ת לפי נושא":');
  
  const { data: all, error: err2 } = await supabase
    .from('content_items')
    .select('id, title, content_md')
    .eq('main_category', 'שו"ת הלכה')
    .eq('sub_category', 'שו"ת לפי נושא');
  
  if (err2) console.error('Error:', err2);
  else {
    const withContent = all.filter(item => item.content_md && item.content_md.trim().length > 0);
    const withoutContent = all.filter(item => !item.content_md || item.content_md.trim().length === 0);
    
    console.log(`  ✅ עם תוכן: ${withContent.length}`);
    console.log(`  ❌ בלי תוכן: ${withoutContent.length}`);
    console.log(`  📊 סה"כ: ${all.length}`);
    
    if (withoutContent.length > 0) {
      console.log('\n  רשומות ריקות:');
      withoutContent.forEach(item => {
        console.log(`    - ID ${item.id}: ${item.title}`);
      });
    }
  }
}

check().catch(console.error);
