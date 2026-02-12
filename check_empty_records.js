const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkEmpty() {
  console.log('\n🔍 בודק רשומות של "שו"ת לפי נושא":\n');
  
  const { data, error } = await supabase
    .from('content_items')
    .select('id, title, main_category, sub_category, content_md')
    .eq('main_category', 'שו"ת הלכה')
    .eq('sub_category', 'שו"ת לפי נושא')
    .order('id')
    .limit(20);
  
  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`סה"כ נמצאו: ${data.length} רשומות\n`);
  
  let withContent = 0;
  let withoutContent = 0;
  
  data.forEach(item => {
    const hasContent = item.content_md && item.content_md.trim().length > 0;
    if (hasContent) withContent++;
    else withoutContent++;
    
    console.log(`📄 ID: ${item.id}`);
    console.log(`   כותרת: ${item.title}`);
    console.log(`   יש תוכן: ${hasContent ? '✅ כן' : '❌ לא'}`);
    if (hasContent) {
      console.log(`   אורך: ${item.content_md.length} תווים`);
      console.log(`   תחילת תוכן: ${item.content_md.substring(0, 80)}...`);
    }
    console.log('');
  });
  
  console.log(`\n📊 סיכום:`);
  console.log(`   ✅ עם תוכן: ${withContent}`);
  console.log(`   ❌ בלי תוכן: ${withoutContent}`);
}

checkEmpty().catch(console.error);
