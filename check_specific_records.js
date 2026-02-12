const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRecords() {
  // רשומה 11589
  console.log('\n🔍 רשומה 11589:');
  const { data: r1, error: e1 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 11589)
    .single();
  
  if (e1) console.error('Error:', e1);
  else {
    console.log(`  ID: ${r1.id}`);
    console.log(`  כותרת: ${r1.title}`);
    console.log(`  קטגוריה: ${r1.main_category}`);
    console.log(`  תת-קטגוריה: ${r1.sub_category}`);
    console.log(`  video_id: ${r1.video_id || 'אין'}`);
    console.log(`  content_md: ${r1.content_md ? `יש (${r1.content_md.length} תווים)` : 'אין'}`);
    if (r1.content_md) {
      console.log(`  תחילת תוכן: ${r1.content_md.substring(0, 150)}...`);
    }
  }
  
  // רשומה 14069
  console.log('\n\n🔍 רשומה 14069:');
  const { data: r2, error: e2 } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', 14069)
    .single();
  
  if (e2) console.error('Error:', e2);
  else {
    console.log(`  ID: ${r2.id}`);
    console.log(`  כותרת: ${r2.title}`);
    console.log(`  קטגוריה: ${r2.main_category}`);
    console.log(`  תת-קטגוריה: ${r2.sub_category}`);
    console.log(`  video_id: ${r2.video_id || 'אין'}`);
    console.log(`  content_md: ${r2.content_md ? `יש (${r2.content_md.length} תווים)` : 'אין'}`);
    if (r2.content_md) {
      console.log(`  תחילת תוכן: ${r2.content_md.substring(0, 150)}...`);
    }
  }
  
  // בדיקה של כל הסדרות "שמונה פרקים לרמבם"
  console.log('\n\n📚 סדרת "שמונה פרקים לרמבם":');
  const { data: series, error: e3 } = await supabase
    .from('content_items')
    .select('id, title, content_md, video_id')
    .eq('main_category', 'סדרות')
    .eq('sub_category', 'שמונה פרקים לרמבם')
    .order('id');
  
  if (e3) console.error('Error:', e3);
  else {
    console.log(`  סה"כ רשומות: ${series?.length || 0}`);
    if (series && series.length > 0) {
      console.log('\n  רשימת רשומות:');
      series.forEach(item => {
        const hasContent = item.content_md && item.content_md.trim().length > 0;
        const hasVideo = item.video_id && item.video_id.trim().length > 0;
        console.log(`    ${item.id}: ${item.title}`);
        console.log(`      תוכן: ${hasContent ? '✅' : '❌'} | וידאו: ${hasVideo ? '✅' : '❌'}`);
      });
    }
  }
  
  // סטטיסטיקה של סדרות
  console.log('\n\n📊 סטטיסטיקה כללית של סדרות:');
  const { data: allSeries } = await supabase
    .from('content_items')
    .select('id, title, content_md, video_id')
    .eq('main_category', 'סדרות');
  
  if (allSeries) {
    const withContent = allSeries.filter(item => item.content_md && item.content_md.trim().length > 0);
    const withVideo = allSeries.filter(item => item.video_id && item.video_id.trim().length > 0);
    const withoutBoth = allSeries.filter(item => 
      (!item.content_md || item.content_md.trim().length === 0) && 
      (!item.video_id || item.video_id.trim().length === 0)
    );
    
    console.log(`  סה"כ רשומות סדרות: ${allSeries.length}`);
    console.log(`  עם content_md: ${withContent.length}`);
    console.log(`  עם video_id: ${withVideo.length}`);
    console.log(`  ללא שניהם (ריקות לגמרי): ${withoutBoth.length}`);
    
    if (withoutBoth.length > 0 && withoutBoth.length <= 10) {
      console.log('\n  רשומות ריקות לגמרי:');
      withoutBoth.forEach(item => {
        console.log(`    - ID ${item.id}: ${item.title}`);
      });
    }
  }
}

checkRecords().catch(console.error);
