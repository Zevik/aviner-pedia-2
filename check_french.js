const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkFrench() {
  console.log('\n🇫🇷 חיפוש תכנים בצרפתית:\n');
  
  // חיפוש לפי מילות מפתח צרפתיות
  const { data, count } = await supabase
    .from('content_items')
    .select('id, title, main_category, sub_category', { count: 'exact' })
    .or('title.ilike.%les cours%,title.ilike.%emouna%,title.ilike.%erets%,title.ilike.%paracha%,title.ilike.%couple%,sub_category.ilike.%français%,sub_category.ilike.%french%');
  
  console.log(`סה"כ מצאתי: ${count} תכנים בצרפתית\n`);
  
  if (data && data.length > 0) {
    // קיבוץ לפי תת-קטגוריה
    const grouped = data.reduce((acc, item) => {
      const key = item.sub_category || 'ללא קטגוריה';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
    
    console.log('תכנים לפי תת-קטגוריה:');
    Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([cat, items]) => {
        console.log(`\n  📁 ${cat} (${items.length} פריטים)`);
        items.slice(0, 3).forEach(item => {
          console.log(`     - ${item.title}`);
        });
        if (items.length > 3) {
          console.log(`     ... ועוד ${items.length - 3}`);
        }
      });
  }
}

checkFrench().catch(console.error);
