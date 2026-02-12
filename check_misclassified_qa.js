const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMisclassifiedQA() {
  // חיפוש מאמרים שמתחילים ב"ש:" או "שאלה:"
  console.log('\n🔍 מאמרים שנראים כמו שו"ת:\n');
  
  const { data: articles } = await supabase
    .from('content_items')
    .select('id, title, main_category, sub_category, content_md')
    .eq('main_category', 'מאמרים')
    .not('content_md', 'is', null);
  
  if (articles) {
    const qaLike = articles.filter(item => {
      const content = item.content_md || '';
      // בדיקה אם מתחיל עם ש: או שאלה:
      return content.match(/^(ש:|שאלה:)/m) || content.match(/\nש:/);
    });
    
    console.log(`סה"כ מאמרים: ${articles.length}`);
    console.log(`נראים כמו שו"ת: ${qaLike.length}\n`);
    
    if (qaLike.length > 0) {
      console.log('דוגמאות (10 ראשונות):');
      qaLike.slice(0, 10).forEach(item => {
        console.log(`  - ID ${item.id}: ${item.title}`);
        console.log(`    תת-קטגוריה: ${item.sub_category}`);
        const firstLine = item.content_md?.split('\n')[0];
        console.log(`    שורה ראשונה: ${firstLine?.substring(0, 80)}...`);
        console.log('');
      });
    }
  }
}

checkMisclassifiedQA().catch(console.error);
