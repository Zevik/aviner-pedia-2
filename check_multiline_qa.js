const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkMultilineQA() {
  const { data } = await supabase
    .from('content_items')
    .select('content_md')
    .eq('id', 13762)
    .single();
  
  if (data?.content_md) {
    console.log('תוכן מלא של רשומה 13762:\n');
    console.log(data.content_md);
    console.log('\n\n---\n');
    
    // בדיקת המבנה
    const lines = data.content_md.split('\n');
    console.log('מבנה התוכן:');
    lines.forEach((line, i) => {
      if (line.trim()) {
        console.log(`שורה ${i + 1}: ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      }
    });
  }
}

checkMultilineQA().catch(console.error);
