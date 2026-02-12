const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMarkdown() {
  // רשומה 13901
  console.log('\n🔍 רשומה 13901:');
  const { data: r1 } = await supabase
    .from('content_items')
    .select('content_md')
    .eq('id', 13901)
    .single();
  
  if (r1?.content_md) {
    console.log('תוכן (300 תווים ראשונים):');
    console.log(r1.content_md.substring(0, 300));
    console.log('\n---\n');
    
    // בדיקה של כוכביות
    const stars = r1.content_md.match(/\*[^*]+\*/g);
    if (stars) {
      console.log(`מצאתי ${stars.length} מקרים של כוכביות:`);
      stars.slice(0, 5).forEach(match => {
        console.log(`  - "${match}"`);
      });
    }
  }
  
  // רשומה 13752
  console.log('\n\n🔍 רשומה 13752:');
  const { data: r2 } = await supabase
    .from('content_items')
    .select('content_md')
    .eq('id', 13752)
    .single();
  
  if (r2?.content_md) {
    console.log('תוכן (500 תווים ראשונים):');
    console.log(r2.content_md.substring(0, 500));
    console.log('\n---\n');
    
    // בדיקה של כוכביות
    const stars = r2.content_md.match(/\*[^*]+\*['|]*/g);
    if (stars) {
      console.log(`מצאתי ${stars.length} מקרים של כוכביות:`);
      stars.slice(0, 10).forEach(match => {
        console.log(`  - "${match}"`);
      });
    }
  }
}

checkMarkdown().catch(console.error);
