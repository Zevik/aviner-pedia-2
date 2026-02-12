const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkYoutubeTags() {
  // רשומה 13843
  console.log('\n🔍 רשומה 13843:');
  const { data: r1 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 13843)
    .single();
  
  if (r1) {
    console.log(`  כותרת: ${r1.title}`);
    console.log(`  קטגוריה: ${r1.main_category}`);
    console.log(`  video_id: ${r1.video_id || 'אין'}`);
    console.log(`  content_md (200 תווים):\n${r1.content_md?.substring(0, 200)}`);
  }
  
  // כמה רשומות עם תגי <youtube>
  console.log('\n\n📊 חיפוש רשומות עם <youtube> tags:');
  const { data: withTags, count } = await supabase
    .from('content_items')
    .select('id, title, main_category, content_md', { count: 'exact' })
    .like('content_md', '%<youtube>%');
  
  console.log(`  מצאתי ${count} רשומות עם תגי <youtube>`);
  
  if (withTags && withTags.length > 0) {
    console.log('\n  דוגמאות (5 ראשונות):');
    withTags.slice(0, 5).forEach(item => {
      const match = item.content_md?.match(/<youtube>([^<]+)<\/youtube>/);
      console.log(`    - ID ${item.id}: ${item.title}`);
      console.log(`      קטגוריה: ${item.main_category}`);
      if (match) {
        console.log(`      Video ID בתוך tag: ${match[1].trim()}`);
      }
    });
  }
  
  // רשומה 13898
  console.log('\n\n🔍 רשומה 13898 (מסווג כמאמר אבל זה שו"ת):');
  const { data: r2 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 13898)
    .single();
  
  if (r2) {
    console.log(`  כותרת: ${r2.title}`);
    console.log(`  קטגוריה: ${r2.main_category}`);
    console.log(`  תת-קטגוריה: ${r2.sub_category}`);
    console.log(`  content_md (300 תווים):\n${r2.content_md?.substring(0, 300)}`);
  }
}

checkYoutubeTags().catch(console.error);
